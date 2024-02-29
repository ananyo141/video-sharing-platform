package com.bucketservice.service.controllers;

import com.bucketservice.service.utils.MinioService;

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
    String bucketName = "videos";
    String objectName = filename;

    // Extract file extension
    String fileExtension = getFileExtension(filename);

    // Check if the file extension is allowed
    if (!isAllowedExtension(fileExtension)) {
      return ResponseEntity.badRequest().body(
          Map.of(
              "success", false,
              "error", "Invalid file extension. Allowed extensions: " + ALLOWED_EXTENSIONS));
    }
    if (!minioService.bucketExists(bucketName)) {
      return ResponseEntity.internalServerError().body(
          Map.of(
              "success", false,
              "error", "Bucket does not exist."));
    }

    // Obtain a presigned URL for uploading the object to the bucket.
    String presignedUrl = minioService.getPresignedUrl(bucketName, objectName);

    if (presignedUrl != null) {
      // Return a JSON response with success true and the presigned URL.
      return ResponseEntity.ok().body(
          Map.of(
              "success", true,
              "data", Map.of("presignedUrl", presignedUrl)));
    } else {
      // Handle the case where obtaining the presigned URL failed.
      return ResponseEntity.status(500).body(
          Map.of(
              "success", false,
              "error", "Failed to obtain presigned URL."));
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
