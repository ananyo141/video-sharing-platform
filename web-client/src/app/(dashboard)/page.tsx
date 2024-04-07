"use client";

import VideoComponent from "@/components/VideoComponent";
import img_example from "/public/assets/image.png";
import { useFetchAllVideos } from "@/hooks/useFetch";
import Video from "@/interface/video.interface";

type Response = {
  videos: Video[];
};

const Page = () => {
  const { data, isLoading, error } = useFetchAllVideos<Response>();
  return (
    <div className="flex flex-col justify-center py-20">
      <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {/* {Array.from({ length: 30 }).map((_, index) => (
          <VideoComponent
            title="This is Video Title"
            url={`watch/${index}`}
            thumbnail={img_example}
            key={index}
          />
        ))} */}
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
