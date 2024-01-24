import type { IncomingMessage, ServerResponse } from "http";
import type { Upload } from "@tus/server";
import { Queue } from "bullmq";

import logger from "@/utils/logger";
import env from "@/environment";

const queue = new Queue(env.JOB_QUEUE_NAME, {
  connection: {
    host: env.REDIS_HOST,
    port: parseInt(env.REDIS_PORT),
  },
});

export const onUploadFinish = async (
  _: IncomingMessage,
  res: ServerResponse,
  upload: Upload
) => {
  logger.info("Uploaded file to server", upload.id);
  const filename = `./${env.UPLOAD_FOLDER}/${upload.id}`;
  const job = await queue.add("video", { filename });
  logger.info(`Job ${job.id} added to queue`);

  return res;
};
