import fs from "fs";
import path from "path";
import { Worker } from "bullmq";

import { uploadFolderBucket } from "@/lib/uploadBucket";
import convertToHLS from "@/lib/convertHLS";
import env from "@/environment";

const VideoWorker = new Worker(
  env.JOB_QUEUE_NAME,
  async (job: any) => {
    const message = JSON.parse(job.data.message);
    const filename = message.Key;
    const fileUrl = "http://video-bucket:9000/" + message.Key;

    try {
      // transcode video
      const folderPath = await convertToHLS(fileUrl);
      // upload to minio
      await uploadFolderBucket(folderPath, 'hls_encoded/' + path.basename(filename));
      // delete muxed file
      fs.rm(folderPath, { recursive: true }, (err) => {
        if (err) console.error(err);
      });
    } catch (err) {
      console.error(err);
    }
  },
  {
    connection: {
      host: env.REDIS_HOST,
      port: parseInt(env.REDIS_PORT),
    },
    concurrency: 5,
  },
);

export default VideoWorker;
