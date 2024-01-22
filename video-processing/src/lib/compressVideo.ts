import ffmpeg from "fluent-ffmpeg";

// Function to compress a video using FFmpeg
export default function compressVideo(
  inputPath: string,
  outputPath: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .videoCodec("libx265") // Video codec
      .audioCodec("aac") // Audio codec
      .size("1280x720") // Output resolution
      .outputOptions(["-crf 23", "-preset medium"]) // Additional options
      .on("end", () => resolve())
      .on("error", (err) => reject(err))
      .save(outputPath);
  });
}

// const inputVideoPath = 'path/to/your/input-video.mp4';
// const outputCompressedPath = 'path/to/your/compressed-video.mp4';
//
// Example usage
// compressVideo(inputVideoPath, outputCompressedPath)
//   .then(() => {
//     console.log('Video compression completed successfully.');
//   })
//   .catch((error) => {
//     console.error('Error during video compression:', error);
//   });
