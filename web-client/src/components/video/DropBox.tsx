import React, { useState, useRef, useEffect, use } from "react";
import VideoSnapshot from "video-snapshot";
import Image from "next/image";
import RatLoader from "../loader/RatLoader";
import createVideo, { VideoInput } from "@/network/createVideo";
import uploadVideo from "@/network/uploadVideo";
import { toast } from "react-toastify";
import uploadImage from "@/network/uploadImage";
import { LuUploadCloud } from "react-icons/lu";
import ProgressBar from "../ProgressBar";
import { normalizeFilename } from "@/utils/normalizeFilename";

interface DropBoxProps {
  closeModal: () => void;
}

const DropBox = ({ closeModal }: DropBoxProps) => {
  const [fileName, setFileName] = useState<string>("");
  const [loader, setLoader] = useState<boolean>(false);
  const [videoTitle, setVideoTitle] = useState<string>("");
  const [thumbnail, setThumbnail] = useState<string>("");
  const [thumbnailName, setThumbnailName] = useState<string>("");

  const [isDragging, setIsDragging] = useState(false);
  const [videoDescription, setVideoDescription] = useState<string>("");
  const [error, setError] = useState<string>("");

  const uploadedFileRef = useRef<File | null>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileDrop(e.dataTransfer.files);
  };

  const handleDragEnter = () => {
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
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

  const handleFileDrop = async (files: FileList) => {
    const file = files[0];
    setFileName(normalizeFilename(videoTitle + Date.now()));

    await handleThumbnail(file);
    uploadedFileRef.current = file;
    if (videoTitle === "" || videoDescription === "") return;


  };

  const handleUploadImage = async ()=>{
    const response = await fetch(thumbnail);
    const blob = await response.blob();

    const thumbnailFile = new File([blob], thumbnailName, { type: "image/png" });

    uploadImage({ file: thumbnailFile })
    .then((data)=>{
      console.log("Response from upload image is -",data)
    })
    .catch((error)=>{
      console.log("Error uploading image", error);
    })

  }

  const handleVideoUpload = async (file: File) => {
    const videoInput: VideoInput = {
      title: videoTitle,
      thumbnailUrl:  thumbnailName,
      description: videoDescription,
      fileExtension: file.name.split(".").pop() || "",
    };

    
    const resImageUpload = handleUploadImage();
    console.log("resImageUpload Response from upload image is -",resImageUpload)
    setLoader(true);
    createVideo(videoInput)
      .then((data) => {
        console.log(data);
        closeModal();
        uploadVideo(data, file);
     
        
        toast.success("Video uploaded successfully");
      })
      .catch((error) => {
        setLoader(false);
        const errorMessage =
          error.response?.errors[0]?.message ||
          "File must be in avi, mov, mp4, mkv format";
        setError(errorMessage);
        console.log(errorMessage);
      });

  };

  

  const handleThumbnail = async (file: File) => {
    const videoSnapshot = new VideoSnapshot(file);
    try {
      const previewSrc = await videoSnapshot.takeSnapshot(2);
      setThumbnail(previewSrc);

    } catch (error) {
      console.error("Error generating thumbnail:", error);
    }
  };

  useEffect(() => {
    if (error.length !== 0) toast(error);
  }, [error]);

  useEffect(() => {


  }, [thumbnail]);

  return (
    <div className={`flex items-center justify-center p-4 `}>
      {thumbnail != "" && (
        <img src={thumbnail} alt="thumbnail" className="w-[200px] h-[300px]" />
      )}
      <div
        className={`w-full max-w-4xl mx-auto  rounded-lg shadow overflow-hidden
      `}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        <div className="px-6 py-8 sm:p-10 lg:p-12">
        {!loader && (
          <div className="space-y-2">
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
                onChange={(e) => {setVideoTitle(e.target.value)
                  setThumbnailName(normalizeFilename(e.target.value + " " + Date.now() ));
                }}
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
        )}
        </div>
        <div className=" px-6  sm:px-10 lg:px-12">
          <div
            className={`border-2 border-dashed rounded-lg ${
              error && !fileName ? "border-red-500" : "border-gray-300"
            } hover:border-gray-400`}
          >
            <label className="flex justify-center items-center  cursor-pointer">
              <div className="text-center">
                <LuUploadCloud size={24} className="mx-auto text-gray-400" />
                <div className="flex flex-col items-center">
                  <span className="mt-1 block text-sm text-gray-600">
                    {fileName
                      ? `Uploading ${fileName}...`
                      : "Drag and drop files here, or click to select files"}
                  </span>
                  {loader == true && (
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
 
        </div>
      </div>
      
    </div>
  );
};

export default DropBox;
