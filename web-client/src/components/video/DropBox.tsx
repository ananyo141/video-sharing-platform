import React, { useState, useRef } from "react";
import RatLoader from "../loader/RatLoader";
import createVideo, { VideoInput } from "@/network/createVideo";
import uploadVideo from "@/network/uploadVideo";

interface DropBoxProps {
  closeModal: () => void;
}

const DropBox = ({ closeModal }: DropBoxProps) => {

  const [fileName, setFileName] = useState<string>("");
  const [videoTitle, setVideoTitle] = useState<string>("");
  const [videoDescription, setVideoDescription] = useState<string>("");
  const [presignedUrl, setPresignedUrl] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<string>("");

  const uploadedFileRef = useRef<File | null>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFileDrop(e.dataTransfer.files);
  };

  const handleUpload = () => {
    if (videoTitle === "" || videoDescription === "") {
      setError("Please fill out all fields");
      return;
    }
    if (fileName === "") {
      setError("Please select a file to upload");
      return;
    }

    if (uploadedFileRef.current) {
      handleVideoUpload(uploadedFileRef.current);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileDrop(e.target.files);
    }
  };

  const handleFileDrop = (files: FileList) => {
    const file = files[0];
    setFileName(file.name);
    uploadedFileRef.current = file;
    simulateUploadProgress();
    if (videoTitle === "" || videoDescription === "") return;

    handleVideoUpload(file);
  };

  const handleVideoUpload = (file: File) => {
    const videoInput: VideoInput = {
      title: videoTitle,
      description: videoDescription,
      fileExtension: file.name.split(".").pop() || "",
    };

    createVideo(videoInput)
      .then((data) => {
        console.log(data);
        setPresignedUrl(data.createVideo.presignedUrl);
        closeModal();
        uploadVideo(data, file);
        alert("Video uploaded successfully");
      })
      .catch((error) => {
        const errorMessage =
          error.response?.errors[0]?.message ||
          "File must be in avi, mov, mp4, mkv format";
        setError(errorMessage);
        console.log(errorMessage);
      });
  };

  const simulateUploadProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 200);
  };


  return (
    <>
      <div className="">
        <span className="text-xl text-center w-full font-medium text-red-500">
          {error}
        </span>
        <div className="flex">
          <span className="text-xl p-2 w-[200px]">Video title -</span>
          <input
            type="text"
            name="video_title"
            className={`border ml-1 p-1 rounded-lg w-3/4
            ${error && videoTitle == "" ? "border-red-500 border-2" : ""}
            `}
            placeholder="Video Title"
            onChange={(e) => setVideoTitle(e.target.value)}
            required
          />
        </div>
        <div className="flex mt-4">
          <span
            className={`text-xl whitespace-nowrap p-2 w-[200px]
          `}
          >
            Video description -
          </span>

          <textarea
            name="video_description"
            placeholder="Enter your Message"
            className={`border ml-1 p-1 rounded-lg w-3/4
            ${error && videoDescription == "" ? "border-red-500 border-2" : ""}
            `}
            onChange={(e) => setVideoDescription(e.target.value)}
            required
          />
        </div>
        <div className="flex justify-center w-full">
          <button
            onClick={handleUpload}
            type="submit"
            className="text-white px-4 mt-2 bg-sky-500 hover:bg-sky-600 rounded-lg p-2"
          >
            Upload
          </button>
        </div>
      </div>
      <div
        className="w-full p-3"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <label
          className={`flex justify-center h-full md:h-52 lg:h-64 px-4 transition bg-white border-2
       border-gray-300 border-dashed rounded-md appearance-none cursor-pointer
        hover:border-gray-400 focus:outline-none
        ${error && !fileName ? "border-red-500 border-2" : ""}
        `}
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
            <div className="flex flex-col justify-center font-medium text-gray-600 p-3">
              {fileName ? (
                `Uploading ${fileName}...`
              ) : (
                <>
                  <span className="md:block hidden">
                    Drop your file to Attach, or
                  </span>
                  <span className="md:hidden">
                    Click here to choose your file
                  </span>
                </>
              )}
              {!fileName && (
                <span className="text-blue-600 text-center ml-2 underline">
                  browse
                </span>
              )}
            </div>
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
