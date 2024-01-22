import type { IncomingMessage, ServerResponse } from "http";
import type { Upload } from "@tus/server";

import logger from "@/utils/logger";
import { uploadToMinio } from "@/lib/uploadBucket";

// TODO: Implement minio upload logic
export const onUploadFinish = async (
  req: IncomingMessage,
  res: ServerResponse,
  upload: Upload
) => {
  logger.info("Upload complete", upload.id);
  uploadToMinio(upload.id, `./uploads/${upload.id}`);
  return res;
};
