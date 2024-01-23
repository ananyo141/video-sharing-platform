import type { IncomingMessage, ServerResponse } from "http";
import type { Upload } from "@tus/server";

import fs from "fs";
import logger from "@/utils/logger";
import { uploadFolderBucket } from "@/lib/uploadBucket";
import env from "@/environment";
import convertToHLS from "@/lib/convertHLS";

export const onUploadFinish = async (
  _: IncomingMessage,
  res: ServerResponse,
  upload: Upload
) => {
  logger.info("Uploaded file to server", upload.id);
  const filename = `./${env.UPLOAD_FOLDER}/${upload.id}`;

  try {
    // transcode video
    await convertToHLS(filename);
    // delete original file
    fs.unlink(filename, (err) => {
      if (err) logger.error(err);
    });
    fs.unlink(filename + ".json", (err) => {
      if (err) logger.error(err);
    });
    // upload to minio
    await uploadFolderBucket(filename + "_hls", filename);
    // delete muxed file
    fs.rm(filename + "_hls", { recursive: true }, (err) => {
      if (err) logger.error(err);
    });
  } catch (err) {
    logger.error(err);
  }
  return res;
};
