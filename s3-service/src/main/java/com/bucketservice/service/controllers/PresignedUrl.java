package com.bucketservice.service.controllers;

import com.bucketservice.service.utils.HttpResponse;
import com.bucketservice.service.utils.MinioService;
import com.bucketservice.service.utils.UrlManipulation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Arrays;
import java.util.Map;

@RestController
public class PresignedUrl {

  private final MinioService minioService;
  private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList("avi", "mov", "mp4", "mkv");

  @Autowired
  public PresignedUrl(MinioService minioService) {
    this.minioService = minioService;
  }

  @GetMapping("/assets/presignedUrl")
  public ResponseEntity<?> getPresignedUrl(@RequestParam String filename) {
    try {

      String bucketName = MinioService.MINIO_VIDEOUPLOAD_BUCKET;
      String objectName = filename;

      // Extract file extension
      String fileExtension = getFileExtension(filename);

      // Check if the file extension is allowed
      if (!isAllowedExtension(fileExtension)) {
        return ResponseEntity.badRequest().body(
            HttpResponse.respond(false, "Invalid file extension. Allowed extensions: " + ALLOWED_EXTENSIONS, null));
      }
      if (!minioService.bucketExists(bucketName)) {
        return ResponseEntity.internalServerError().body(
            HttpResponse.respond(false, "Bucket does not exist", null));
      }

      // Obtain a presigned URL for uploading the object to the bucket.
      String presignedUrl = null;
      try {
        presignedUrl = minioService.getPresignedUrl(bucketName, objectName);
      } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.internalServerError().body(
            HttpResponse.respond(false, "Failed to obtain presigned URL", null));
      }

      if (presignedUrl != null) {
        // Return a JSON response with success true and the presigned URL.
        String urlWithoutHost = UrlManipulation.removehost(presignedUrl);
        return ResponseEntity.ok().body(
            HttpResponse.respond(true, "Presigned URL obtained successfully",
                Map.of("presignedUrl", urlWithoutHost, "objectName", objectName)));
      } else {
        // Handle the case where obtaining the presigned URL failed.
        return ResponseEntity.internalServerError().body(
            HttpResponse.respond(false, "Failed to obtain presigned URL", null));
      }
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(
          HttpResponse.respond(false, "Error obtaining presigned URL: " + e.getMessage(), null));
    }
  }

  private String getFileExtension(String fileName) {
    int lastDotIndex = fileName.lastIndexOf('.');
    return (lastDotIndex == -1) ? "" : fileName.substring(lastDotIndex + 1);
  }

  private boolean isAllowedExtension(String extension) {
    return ALLOWED_EXTENSIONS.contains(extension.toLowerCase());
  }
}
