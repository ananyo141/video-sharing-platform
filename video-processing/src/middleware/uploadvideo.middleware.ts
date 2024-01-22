import type { IncomingMessage, ServerResponse } from "http";
import type { Upload } from "@tus/server";

import fs from "fs";
import logger from "@/utils/logger";
import { uploadToMinio } from "@/lib/uploadBucket";
import env from "@/environment";

// TODO: Implement minio upload logic
export const onUploadFinish = async (
  req: IncomingMessage,
  res: ServerResponse,
  upload: Upload
) => {
  logger.info("Upload complete", upload.id);
  await uploadToMinio(upload.id, `./${env.UPLOAD_FOLDER}/${upload.id}`);
  fs.unlink(`./${env.UPLOAD_FOLDER}/${upload.id}`, (err) => {
    if (err) logger.error(err);
  });
  fs.unlink(`./${env.UPLOAD_FOLDER}/${upload.id}.json`, (err) => {
    if (err) logger.error(err);
  });
  return res;
};
