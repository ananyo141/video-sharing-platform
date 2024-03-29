import * as Minio from "minio";
import * as fs from "fs";
import * as path from "path";
import { promisify } from "util";

import env from "@/environment";
import logger from "@/utils/logger";

export const MinioConfig: Minio.ClientOptions = {
  endPoint: env.MINIO_ENDPOINT,
  port: parseInt(env.MINIO_PORT),
  useSSL: env.MINIO_SSL === "true",
  accessKey: env.MINIO_ROOT_USER,
  secretKey: env.MINIO_ROOT_PASSWORD,
};

// Promisify fs.readdir to use it with async/await
const readdirAsync = promisify(fs.readdir);

export const MinioClient = new Minio.Client(MinioConfig);

const createBucket = (bucketName: string) => {
  MinioClient.bucketExists(bucketName, (err, exists) => {
    if (err) {
      logger.error(err);
      process.exit(1);
    }

    if (!exists) {
      MinioClient.makeBucket(bucketName, "", (err) => {
        if (err) {
          logger.error(err);
          process.exit(1);
        }
        logger.info(`Bucket "${bucketName}" created successfully.`);
      });
    }
    const policy = {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: "*",
          Action: ["s3:GetObject"],
          Resource: [`arn:aws:s3:::${bucketName}/*`],
        },
      ],
    };

    MinioClient.setBucketPolicy(bucketName, JSON.stringify(policy)).catch(
      (err) => logger.error(err.message || err),
    );
  });
};

export const initBucket = () => {
  createBucket(env.MINIO_BUCKET);
  createBucket(env.MINIO_PROCESSED_BUCKET);
};

// Function to recursively upload a folder and its contents to Minio
export async function uploadFolderBucket(
  localFolderPath: string,
  remoteFolderPath: string,
  bucketName: string = env.MINIO_PROCESSED_BUCKET,
): Promise<void> {
  // Get a list of files in the local folder
  const files = await readdirAsync(localFolderPath);

  // Upload each file to MinIO
  for (const file of files) {
    const filePath = path.join(localFolderPath, file);
    const objectName = path.join(remoteFolderPath, file);

    // Check if it's a file or a directory
    const stats = fs.statSync(filePath);
    if (stats.isFile()) {
      // Upload file
      await uploadToBucket(objectName, filePath, bucketName);
      logger.info(`Uploaded file: ${objectName}`);
    } else if (stats.isDirectory()) {
      // Recursively upload contents of subdirectory
      await uploadFolderBucket(filePath, objectName, bucketName);
    }
  }
}

// Function to upload a file to Minio
export async function uploadToBucket(
  objectName: string,
  filePath: string,
  bucketName: string = env.MINIO_PROCESSED_BUCKET,
): Promise<{
  objectName: string;
  filePath: string;
  etag: string;
}> {
  return new Promise((resolve, reject) => {
    // Upload the file
    MinioClient.fPutObject(
      bucketName,
      objectName,
      filePath,
      (
        err: any,
        details: {
          etag: string;
          versionId: string;
        },
      ) => {
        if (err) {
          logger.error(`Error uploading file: ${err}`);
          reject(err);
        } else {
          logger.info(`File uploaded successfully. Etag: ${details.etag}`);
          resolve(
            Object.freeze({
              bucketName,
              objectName,
              filePath,
              etag: details.etag,
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
