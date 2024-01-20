import type { IncomingMessage, ServerResponse } from "http";
import type { Upload } from "@tus/server";

import logger from "@/utils/logger";

// TODO: Implement minio upload logic
export const onUploadFinish = async (
  req: IncomingMessage,
  res: ServerResponse,
  upload: Upload
) => {
  logger.info("Upload complete", upload.id);
  return res;
};
