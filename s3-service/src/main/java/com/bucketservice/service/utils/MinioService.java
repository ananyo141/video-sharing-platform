package com.bucketservice.service.utils;

import io.minio.BucketExistsArgs;
import io.minio.GetPresignedObjectUrlArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.UploadObjectArgs;
import io.minio.errors.ErrorResponseException;
import io.minio.errors.InsufficientDataException;
import io.minio.errors.InternalException;
import io.minio.errors.InvalidResponseException;
import io.minio.errors.MinioException;
import io.minio.errors.ServerException;
import io.minio.errors.XmlParserException;
import io.minio.http.Method;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.concurrent.TimeUnit;

@Service
public class MinioService {

  private MinioClient minioClient;
  private static final String MINIO_ENDPOINT = System.getenv("MINIO_ENDPOINT");
  private static final String MINIO_ROOT_USER = System.getenv("MINIO_ROOT_USER");
  private static final String MINIO_ROOT_PASSWORD = System.getenv("MINIO_ROOT_PASSWORD");
  public static final String MINIO_IMAGE_BUCKET = System.getenv("MINIO_IMAGE_BUCKET");
  public static final String MINIO_MISC_BUCKET = System.getenv("MINIO_MISC_BUCKET");
  public static final String MINIO_VIDEOUPLOAD_BUCKET = System.getenv("MINIO_VIDEOUPLOAD_BUCKET");

  public MinioService() {
    this.minioClient = null;
  }

  @PostConstruct
  public void init() {
    // Initialize MinioClient in the constructor.
    this.minioClient = MinioClient.builder()
        .endpoint(MINIO_ENDPOINT)
        .credentials(MINIO_ROOT_USER, MINIO_ROOT_PASSWORD)
        .build();
  }

  public boolean bucketExists(String bucketName) {
    try {
      boolean found = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());
      return found;
    } catch (MinioException | IOException | NoSuchAlgorithmException | InvalidKeyException e) {
      // Handle exceptions as needed.
      e.printStackTrace();
      return false;
    }
  }

  public void createBucketIfNotExists(String bucketName)
      throws MinioException, IOException, NoSuchAlgorithmException, InvalidKeyException {
    boolean found = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());
    if (!found) {
      minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
    }
  }

  public String uploadObject(String bucketName, String objectName, String filePath)
      throws MinioException, IOException, NoSuchAlgorithmException, InvalidKeyException {
    return '/' + bucketName + '/' + minioClient.uploadObject(
        UploadObjectArgs.builder()
            .bucket(bucketName)
            .object(objectName)
            .filename(filePath)
            .build())
        .object();
  }

  public String uploadObjectStream(String bucketName, String objectName, InputStream file)
      throws XmlParserException, ServerException, NoSuchAlgorithmException, IOException, InvalidResponseException,
      InvalidKeyException, InternalException, InsufficientDataException, ErrorResponseException {
    return '/' + bucketName + '/' + minioClient.putObject(
        PutObjectArgs.builder().bucket(bucketName).object(objectName).stream(
            file, -1, 10485760)
            .contentType("application/octet-stream")
            .build())
        .object();
  }

  public String getPresignedUrl(String bucketName, String objectName)
      throws MinioException, IOException, NoSuchAlgorithmException, InvalidKeyException {
    // Generate a presigned URL for HTTP PUT operation with a validity of 30
    // minutes.
    return minioClient.getPresignedObjectUrl(
        GetPresignedObjectUrlArgs.builder()
            .method(Method.PUT)
            .bucket(bucketName)
            .object(objectName)
            .expiry(30, TimeUnit.MINUTES)
            .build());
  }
}
