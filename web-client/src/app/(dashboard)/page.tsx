"use client";

import VideoComponent from "@/components/VideoComponent";
import img_example from "/public/assets/thumbnail.jpg";
import Video from "@/interface/video.interface";
import { useQuery, gql } from "@apollo/client";
import getVideoGQLQuery from "@/queries/getVideByUser.graphql";

type Response = {
  videos: Video[];
};

const Page = () => {
  const { data, loading, error } = useQuery<Response>(gql`
    ${getVideoGQLQuery}
  `);
  return (
    <div className="app-container py-6">
      <h1 className="text-2xl font-semibold mb-4">Recommended</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {data &&
          data.videos &&
          data.videos.map((item) => (
            <VideoComponent
              key={item._id}
              title={item.title}
              url={`watch/${item._id}`}
              thumbnailURL={item.thumbnailUrl}
            />
          ))}
      </div>
    </div>
  );
};

export default Page;
