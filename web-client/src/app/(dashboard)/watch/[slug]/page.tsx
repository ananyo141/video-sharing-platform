import VideoComponent from "@/components/VideoComponent";
import img_example from "/public/assets/image.png";

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <div className="grid md:grid-cols-[1fr_400px] overflow-hidden">
      <div>
        Video will Shown Here
      </div>
      <div className="flex flex-col gap-2 overflow-y-scroll">
        {Array.from({ length: 30 }).map((_, index) => (
          <VideoComponent
            title="This is Video Title"
            url={`/watch/${index}`}
            thumbnail={img_example}
            key={index}
          />
        ))}
      </div>
    </div>
  );
}
