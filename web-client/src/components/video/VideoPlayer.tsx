"use client";
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
const VideoPlayer = () => {
  const [video, setVideoUrl] = useState<any>(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    setVideoUrl(
      <ReactPlayer
        url="https://videosite.ddns.net/bucket/video-bucket/testing-video-_1710599097751.mp4"
        controls={true}
        onError={(e) => setError(e)}
      />
    );
  }, []);

  return (
    <div className="">
      {video}
      {error && <p className="font-medium bg-red-600">Error: {error}</p>}
    </div>
  );
};

export default VideoPlayer;
