"use client";

import VideoComponent from "@/components/VideoComponent";
import img_example from "/public/assets/image.png";
import VideoPlayer from "@/components/video/VideoPlayer";
import useFetch from "@/hooks/useFetch";
import watchVideo from "@/queries/watchVideo.graphql";
import urlJoin from "url-join";
import Video from "@/interface/video.interface";
import ReactPlayer from "react-player";

const baseURL = process.env.NEXT_PUBLIC_SERVER_URL as string;

export default function Page({ params }: { params: { slug: string } }) {
  const { data, isLoading } = useFetch<{video: Video}>(watchVideo, "POST", {
    id: params.slug,
  });

  console.log(data);

  return (
    <div className="grid md:grid-cols-[1fr_400px] overflow-hidden">
      <div className="p-3">
        <div className="z-50 flex justify-center">
          {isLoading && <>Loading... </>}
          {data && data.video.transcodedUrl && data.video.source &&  (
            <div>
              <ReactPlayer
                url={urlJoin("https://videosite.ddns.net/", "/bucket", data.video.source)}
                controls
              />
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
  );
}
