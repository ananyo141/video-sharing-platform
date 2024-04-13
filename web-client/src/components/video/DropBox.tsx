"use client";

import React, { useState, useRef, useEffect } from "react";
import RatLoader from "../loader/RatLoader";
import createVideo, { VideoInput } from "@/network/createVideo";
import uploadVideo from "@/network/uploadVideo";
import { toast } from "react-toastify";
import { LuUploadCloud } from "react-icons/lu";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import ProgressBar from "../ProgressBar";
import { gql, useSubscription } from "@apollo/client";
import videoProgressGQL from "@/queries/videoProgress.graphql";

interface DropBoxProps {
  closeModal: () => void;
}

const DropBox = ({ closeModal }: DropBoxProps) => {
  const [fileName, setFileName] = useState<string>("");
  const [videoTitle, setVideoTitle] = useState<string>("");
  const [videoDescription, setVideoDescription] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<string>("");

  const { data } = useSubscription(
    gql`
      subscription {
        videoProgress(videoId: "66183b74e45c4793bc9f0e25") {
          videoId
          userId
          progress
          updatedAt
        }
      }
    `
  );

  console.log(data);

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

        closeModal();
        uploadVideo(data, file);
        toast("Video uploaded successfully");
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

  useEffect(() => {
    if (error.length !== 0) toast(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-8 sm:p-10 lg:p-12">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="video_title"
                className="block text-sm font-medium text-gray-700"
              >
                Video Title
              </label>
              <input
                type="text"
                name="video_title"
                className={`p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-tertiary focus:ring focus:ring-tertiary focus:ring-opacity-50
            ${error && videoTitle === "" ? "border-red-500" : ""}`}
                placeholder="Enter video title"
                onChange={(e) => setVideoTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="video_description"
                className="block text-sm font-medium text-gray-700"
              >
                Video Description
              </label>
              <textarea
                name="video_description"
                rows={4}
                className={`p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-tertiary focus:ring focus:ring-tertiary focus:ring-opacity-50
            ${error && videoDescription === "" ? "border-red-500" : ""}`}
                placeholder="Enter video description"
                onChange={(e) => setVideoDescription(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-center items-center">
              <button
                onClick={handleUpload}
                className="w-full sm:w-auto px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-tertiary hover:bg-secondary hover:text-tertiary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tertiary"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 sm:px-10 lg:px-12">
          <div
            className={`border-2 border-dashed rounded-lg ${
              error && !fileName ? "border-red-500" : "border-gray-300"
            } hover:border-gray-400`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <label className="flex justify-center items-center h-48 cursor-pointer">
              <div className="text-center">
                <LuUploadCloud size={24} className="mx-auto text-gray-400" />
                <div className="flex flex-col items-center">
                  <span className="mt-1 block text-sm text-gray-600">
                    {fileName
                      ? `Uploading ${fileName}...`
                      : "Drag and drop files here, or click to select files"}
                  </span>
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="mt-2">
                      <RatLoader />
                    </div>
                  )}
                </div>
              </div>
              <input
                type="file"
                name="file_upload"
                className="hidden"
                onChange={handleFileSelect}
              />
            </label>
          </div>
          {uploadProgress > 0 && (
            <div className="mt-4">
              <ProgressBar percentage={uploadProgress} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DropBox;
