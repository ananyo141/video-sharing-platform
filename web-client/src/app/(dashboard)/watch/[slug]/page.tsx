import VideoComponent from "@/components/VideoComponent";
import img_example from "/public/assets/image.png";
import VideoPlayer from "@/components/video/VideoPlayer";
export default function Page({ params }: { params: { slug: string } }) {
  return (
    <div className="grid md:grid-cols-[1fr_400px] overflow-hidden">
      <div className="p-3">
        <h1>Video will Shown Here</h1>
        <div className="z-50 bg-black flex justify-center">
          <VideoPlayer />
        </div>
      </div>
      
      <div className="flex flex-col gap-2 overflow-y-scroll">
        {Array.from({ length: 30 }).map((_, index) => (
          <VideoComponent
            title="This is Video Title uploaded by user from the dashboard"
            url={`/watch/${index}`}
            thumbnail={img_example}
            key={index}
          />
        ))}
      </div>
    </div>
  );
}
