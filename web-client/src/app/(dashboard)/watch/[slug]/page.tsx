"use client";

import VideoComponent from "@/components/VideoComponent";
import img_example from "/public/assets/image.png";
import VideoPlayer from "@/components/video/VideoPlayer";
import useFetch from "@/hooks/useFetch";
import watchVideo from "@/queries/watchVideo.graphql";
import urlJoin from "url-join";
import Video from "@/interface/video.interface";
import ReactPlayer from "react-player";
import CubesLoader from "@/components/loader/CubesLoader";

const baseURL = process.env.NEXT_PUBLIC_SERVER_URL as string;

export default function Page({ params }: { params: { slug: string } }) {
  const { data, isLoading } = useFetch<{ video: Video }>(watchVideo, "POST", {
    id: params.slug,
  });


  return (
    <div className="h-full">
      <div className="grid md:grid-cols-[1fr_400px] overflow-hidden h-full">
        {isLoading && (
          <>
            <CubesLoader />{" "}
          </>
        )}
        <div className="p-3 h-full">
          <div className="z-50 flex w-full justify-center">
            {data && data.video.transcodedUrl && data.video.source && (
              <div className="">
                <ReactPlayer
                  url={urlJoin(
                    "https://videosite.ddns.net/",
                    "/bucket",
                    data.video.source
                  )}
                  controls
                  width="1000px"
                  height="500px"
                />
                <div className="py-4 h-full space-y-2 rounded-lg">
                  <span className="text-2xl font-medium px-4 ">
                    {data.video.title}
                  </span>
                  <div className="border rounded-lg px-4 py-3 bg-gray-100">
                    <div className="">
                      <span className="">26k views</span>
                      <span className="ml-3">2 days ago</span>
                    </div>
                    <div className="text-xl text font-medium">
                      {data.video.description}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 overflow-y-scroll">
          {/* {Array.from({ length: 30 }).map((_, index) => (
          <VideoComponent
            title="This is Video Title uploaded by user from the dashboard"
            url={`/watch/${index}`}
            thumbnail={img_example}
            key={index}
          />
        ))} */}
        </div>
      </div>
    </div>
  );
}
