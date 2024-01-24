import fs from "fs";
import { Worker } from "bullmq";

import logger from "@/utils/logger";
import { uploadFolderBucket } from "@/lib/uploadBucket";
import convertToHLS from "@/lib/convertHLS";
import env from "@/environment";

const VideoWorker = new Worker(
  env.JOB_QUEUE_NAME,
  async (job: any) => {
    const filename = job.data.filename;

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
  },
  {
    connection: {
      host: env.REDIS_HOST,
      port: parseInt(env.REDIS_PORT),
    },
  }
);

export default VideoWorker;
