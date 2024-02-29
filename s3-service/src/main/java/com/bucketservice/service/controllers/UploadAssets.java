package com.bucketservice.service.controllers;

import com.bucketservice.service.utils.HttpResponse;
import com.bucketservice.service.utils.MinioService;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class UploadAssets {

  private final MinioService minioService;

  @Autowired
  public UploadAssets(MinioService minioService) {
    this.minioService = minioService;
  }

  @PostMapping("/assets/images")
  public ResponseEntity<?> uploadImages(@RequestParam("file") MultipartFile file) {
    try {
      // Use MinioService to interact with Minio.
      String objectName = minioService.uploadObjectStream(MinioService.MINIO_IMAGE_BUCKET, file.getOriginalFilename(),
          file.getInputStream());
      return ResponseEntity.ok(
          HttpResponse.respond(true, "Image uploaded successfully", Map.of("objectName", objectName)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(
          HttpResponse.respond(false, "Error uploading file: " + e.getMessage(), null));
    }
  }

  @PostMapping("/assets/misc")
  public ResponseEntity<?> uploadMisc(@RequestParam("file") MultipartFile file) {
    try {
      // Use MinioService to interact with Minio.
      String objectName = minioService.uploadObjectStream(MinioService.MINIO_MISC_BUCKET, file.getOriginalFilename(),
          file.getInputStream());
      return ResponseEntity.ok(
          HttpResponse.respond(true, "Asset uploaded successfully", Map.of("objectName", objectName)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(
          HttpResponse.respond(false, "Error uploading file: " + e.getMessage(), null));
    }
  }
}
