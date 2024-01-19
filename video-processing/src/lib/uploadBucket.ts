import * as Minio from "minio";

import env from "@/environment";
import logger from "@/utils/logger";

const MinioConfig: Minio.ClientOptions = {
  endPoint: env.MINIO_ENDPOINT,
  port: parseInt(env.PORT),
  useSSL: env.MINIO_SSL === "true",
  accessKey: env.MINIO_ACCESS_KEY,
  secretKey: env.MINIO_SECRET_KEY,
};

const MinioClient = new Minio.Client(MinioConfig);

MinioClient.bucketExists(env.MINIO_BUCKET, (err, exists) => {
  if (err) {
    logger.crit(err);
    process.exit(1);
  }

  if (!exists) {
    MinioClient.makeBucket(env.MINIO_BUCKET, "", (err) => {
      if (err) {
        logger.crit(err);
        process.exit(1);
      }
      logger.alert(`Bucket "${env.MINIO_BUCKET}" created successfully.`);
    });
  }
});

// Function to upload a file to Minio
export async function uploadToMinio(
  objectName: string,
  filePath: string,
): Promise<{
  objectName: string;
  filePath: string;
  etag: string;
}> {
  return new Promise((resolve, reject) => {
    // Check if the bucket exists, and create it if not
    const bucketName = env.MINIO_BUCKET;
    // Upload the file
    MinioClient.fPutObject(
      bucketName,
      objectName,
      filePath,
      (err: any, etag: string) => {
        if (err) {
          logger.error(`Error uploading file: ${err}`);
          reject(err);
        } else {
          logger.info(`File uploaded successfully. Etag: ${etag}`);
          resolve(
            Object.freeze({
              bucketName,
              objectName,
              filePath,
              etag,
            }),
          );
        }
      },
    );
  });
}

// Example usage:
// Uncomment and adjust the following lines based on your Minio server details and file paths
/*

uploadToMinio(minioConfig, bucketName, objectName, filePath)
  .then(() => console.log('File upload completed successfully.'))
  .catch((error) => console.error('Error during file upload:', error));
*/
