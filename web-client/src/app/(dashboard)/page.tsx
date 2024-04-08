"use client";

import VideoComponent from "@/components/VideoComponent";
import img_example from "/public/assets/thumbnail.jpg";
import { useFetchAllVideos } from "@/hooks/useFetch";
import Video from "@/interface/video.interface";

type Response = {
  videos: Video[];
};

const Page = () => {
  const { data, isLoading, error } = useFetchAllVideos<Response>();
  return (
    <div className="flex flex-col justify-center">
      <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-16">
        {data &&
          data.videos &&
          data.videos.map((item) => (
            <VideoComponent
              key={item._id}
              title={item.title}
              url={`watch/${item._id}`}
              thumbnail={img_example}
            />
          ))}
      </div>
    </div>
  );
};

export default Page;
