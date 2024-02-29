package com.bucketservice.service.controllers;

import com.bucketservice.service.utils.MinioService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UploadAssets {

  private final MinioService minioService;

  @Autowired
  public UploadAssets(MinioService minioService) {
    this.minioService = minioService;
  }

  @PostMapping("/assets/images")
  public String images() {
    // Use MinioService to interact with Minio.
    minioService.uploadObject(MinioService.MINIO_IMAGE_BUCKET, "asiaphotos-2015.zip", "/app/HELP.md");
    return "Greetings ";
  }

  @PostMapping("/assets/misc")
  public String misc() {
    // Use MinioService to interact with Minio.
    minioService.uploadObject(MinioService.MINIO_MISC_BUCKET, "asiaphotos-2015.zip", "/app/HELP.md");
    return "Greetings ";
  }
}
