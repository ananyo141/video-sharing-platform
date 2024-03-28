import React, { useState } from "react";
import RatLoader from "../loader/RatLoader";
import createVideo, { VideoInput } from "@/network/createVideo";

interface DropBoxProps {
  closeModal: () => void;
}

const DropBox = ({ closeModal }: DropBoxProps) => {
  const [fileName, setFileName] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      setFileName(file.name);
      simulateUploadProgress();

      // Call createVideo function here
      const videoInput: VideoInput = {
        title: file.name,
        description: "Description placeholder",
        fileExtension: ".mp4",
      };
      createVideo(videoInput)
        .then((data) => {

        })
        .catch((error) => {
          // Handle error if needed
          console.log(error);
        });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFileName(file.name);
      simulateUploadProgress();

      // Call createVideo function here
      const videoInput: VideoInput = {
        title: file.name,
        description: "Description placeholder", // You can customize this
        fileExtension: file.name.split(".").pop() || "", // Extract file extension
      };
      createVideo(videoInput)
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {});
    }
  };

  const simulateUploadProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(closeModal, 1000); // Close modal after 2 seconds
      }
    }, 200);
  };

  return (
    <>
      <div
        className="w-full p-3"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <label
          className="flex justify-center h-60 px-4 transition bg-white border-2
       border-gray-300 border-dashed rounded-md appearance-none cursor-pointer
        hover:border-gray-400 focus:outline-none"
        >
          <span className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <span className="font-medium text-gray-600">
              {fileName
                ? `Uploading ${fileName}...`
                : "Drop your file to Attach, or"}
              {!fileName && (
                <span className="text-blue-600 ml-2 underline">browse</span>
              )}
            </span>
            {uploadProgress < 100 && uploadProgress != 0 && (
              <div className="bg-slate-800 ml-4 rounded-full">
                <RatLoader />
              </div>
            )}
          </span>

          <input
            type="file"
            name="file_upload"
            className="hidden"
            onChange={handleFileSelect}
          />
        </label>
      </div>
      {uploadProgress > 0 && (
        <div className="w-[90%] mx-auto h-6 mt-1 bg-gray-200 rounded-lg">
          <div
            className="h-full text-white text-center rounded-lg bg-green-600"
            style={{ width: `${uploadProgress}%` }}
          >
            {fileName && `${uploadProgress}%`}
          </div>
        </div>
      )}
    </>
  );
};

export default DropBox;
