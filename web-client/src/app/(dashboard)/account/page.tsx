"use client";

import Profile from "@/components/Profile";
import VideoComponent from "@/components/VideoComponent";
import img_example from "/public/assets/image.png";

const Page = () => {
  return (
    <div>
      <Profile name="Arup Basak" />
      <div>
        <p>Your Videos</p>
      </div>
      <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2">
        {Array.from({ length: 30 }).map((_, index) => (
          <VideoComponent
            title="This is Video Title"
            url="https://google.com"
            thumbnail={img_example}
            key={index}
          />
        ))}
      </div>
    </div>
  );
};

export default Page;
