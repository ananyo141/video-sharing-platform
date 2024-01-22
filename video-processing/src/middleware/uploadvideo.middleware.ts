import type { IncomingMessage, ServerResponse } from "http";
import type { Upload } from "@tus/server";

import fs from "fs";
import logger from "@/utils/logger";
import { uploadToMinio } from "@/lib/uploadBucket";
import env from "@/environment";
import compressVideo from "@/lib/compressVideo";
import convertToHLS from "@/lib/convertHLS";

export const onUploadFinish = async (
  req: IncomingMessage,
  res: ServerResponse,
  upload: Upload
) => {
  logger.info("Uploaded file to server", upload.id);
  const filename = `./${env.UPLOAD_FOLDER}/${upload.id}`;
  const filenameCompressed = filename + "-compressed.mp4";
  const filenameHLS = filename + "-hls";

  try {
    // compress video
    await compressVideo(filename, filenameCompressed);
    // delete file
    fs.unlink(filename, (err) => {
      if (err) logger.error(err);
    });
    fs.unlink(filename + ".json", (err) => {
      if (err) logger.error(err);
    });
    // transcode video
    await convertToHLS(filenameCompressed, filenameHLS);
    fs.unlink(filenameCompressed, (err) => {
      if (err) logger.error(err);
    });
    // upload to minio
    await uploadToMinio(upload.id, filenameHLS);
    fs.unlink(filenameHLS, (err) => {
      if (err) logger.error(err);
    });
  } catch (err) {
    logger.error(err);
  }
  return res;
};
