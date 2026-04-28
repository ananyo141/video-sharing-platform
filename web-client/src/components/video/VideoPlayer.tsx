"use client";
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
const VideoPlayer = () => {
  const [error, setError] = useState<any>(null);

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg bg-black">
      <div className="relative" style={{ paddingTop: "56.25%" }}>
        <ReactPlayer
          className="absolute top-0 left-0"
          url="https://videosite.ddns.net/bucket/video-bucket/testing-video-_1710599097751.mp4"
          width="100%"
          height="100%"
          controls={true}
          onError={(e) => setError(e)}
        />
      </div>
      {error && <p className="p-2 text-sm text-red-400">Error: {String(error)}</p>}
    </div>
  );
};

export default VideoPlayer;
