import ffmpeg from "fluent-ffmpeg";

// Function to convert video to HLS format
export default function convertToHLS(
  inputPath: string,
  outputPath: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions([
        "-profile:v baseline",
        "-level 3.0",
        "-start_number 0",
        "-hls_time 10", // Set the segment duration (in seconds)
        "-hls_list_size 0", // 0 means keep all segments in the playlist
        "-f hls",
      ])
      .output(outputPath)
      .on("end", () => resolve())
      .on("error", (err) => reject(err))
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
