import type { Request, Response, NextFunction } from "express";

import CustomError from "@/errors";
import path from "path";
import { MinioClient } from "@/lib/uploadBucket";
import env from "@/environment";
import { httpResponse } from "@/utils/httpResponse";

export const getPresignedUrl = async (
  _req: Request,
  _res: Response,
  _next: NextFunction,
) => {
  try {
    const bucketName = env.MINIO_BUCKET; // Replace with your MinIO bucket name
    const filename = _req.query.filename;
    if (!filename || typeof filename !== "string") {
      return _next(
        new CustomError.BadRequestError("Filename string is required"),
      );
    }

    const ext = path.extname(filename);
    if (![".mp4", ".mov", ".avi", ".mkv"].includes(ext)) {
      return _next(
        new CustomError.BadRequestError(
          "Only video files with extensions .mp4, .mov, .avi, .mkv are allowed",
        ),
      );
    }
    // add timestamp to filename before extension
    const timestamp = new Date().getTime();
    const newFilename = `${filename.split(".")[0]}_${timestamp}${ext}`;

    const objectName = "uploads/" + newFilename; // Replace with the desired object name

    // Presigned URL expiration time in seconds
    const expiryInSeconds = 15 * 60; // 15 minutes

    // NOTE: https://github.com/minio/minio/issues/11870
    // Set `Host` header to docker service name (`video-bucket:9000`) in the request
    const presignedUrl = await MinioClient.presignedPutObject(
      bucketName,
      objectName,
      expiryInSeconds,
    );

    _res.json(httpResponse(true, "Presigned URL generated", { presignedUrl }));
  } catch (error: any) {
    _next(
      new CustomError.InternalServerError(
        `Something went wrong ${error.message}`,
      ),
    );
  }
};
