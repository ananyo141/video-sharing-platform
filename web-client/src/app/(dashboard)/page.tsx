"use client";

import VideoComponent from "@/components/VideoComponent";
import img_example from "/public/assets/image.png";

const Page = () => {
  return (
    <div className="flex flex-col justify-center">
      <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 30 }).map((_, index) => (
          <VideoComponent
            title="This is Video Title"
            url={`watch/${index}`}
            thumbnail={img_example}
            key={index}
          />
        ))}
      </div>
    </div>
  );
};

export default Page;