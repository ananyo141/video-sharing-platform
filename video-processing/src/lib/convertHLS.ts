import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";

import logger from "@/utils/logger";
import env from "@/environment";
import { connectToRabbitMQ } from "./eventQueue";

// Function to convert video to HLS format
export default async function convertToHLS(inputPath: string): Promise<string> {
  const { channel } = await connectToRabbitMQ();

  // Function to send progress updates to RabbitMQ
  const sendProgressUpdate = async (progress: number) => {
    try {
      // You can customize the message structure based on your needs
      const message = { progress, file: path.basename(inputPath) };
      const queueName = "progress_updates_queue";

      await channel.assertQueue(queueName, { durable: true });
      channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
      logger.info(`Progress update sent: ${progress}%`);
    } catch (err) {
      logger.error("Error sending progress update to RabbitMQ:", err);
    }
  };

  const inputPathDir = path.join(
    env.UPLOAD_FOLDER,
    path.basename(inputPath) + "_hls",
  );
  if (!fs.existsSync(inputPathDir)) {
    fs.mkdirSync(inputPathDir);
  }
  logger.debug(inputPathDir);
  const playlistPath = path.join(inputPathDir, "playlist.m3u8");
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions([
        // "-profile:v baseline",
        // "-c:v h264",
        "-c:v libx265",
        "-tag:v hvc1",
        "-level 3.0",
        "-start_number 0",
        "-hls_time 10", // Set the segment duration (in seconds)
        "-hls_list_size 0", // 0 means keep all segments in the playlist
        "-f hls",
        `-hls_segment_filename ${path.join(inputPathDir, "segment%03d.ts")}`,
      ])
      .output(playlistPath)
      .on("progress", (progress) => {
        // Send progress update every 10%
        sendProgressUpdate(progress.percent);
      })
      .on("end", () => {
        sendProgressUpdate(100);
        return resolve(inputPathDir);
      })
      .on("error", (err, stdout, stderr) => {
        // Log detailed error information
        logger.error("Error:" + err);
        logger.error("ffmpeg stdout:\n" + stdout);
        logger.error("ffmpeg stderr:\n" + stderr);
        reject(err);
      })
      .run();
  });
}

// Example usage
// const inputVideoPath = "path/to/your/input-video.mp4";
// const outputHLSPath = "path/to/your/output-folder";
// convertToHLS(inputVideoPath, outputHLSPath)
//   .then(() => {
//     logger.info("Conversion to HLS completed successfully.");
//   })
//   .catch((error) => {
//     logger.error("Error during HLS conversion:", error);
//   });
