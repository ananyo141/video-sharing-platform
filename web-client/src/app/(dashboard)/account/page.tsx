"use client";
import { useState } from "react";
import Profile from "@/components/Profile";
import VideoComponent from "@/components/VideoComponent";
import DropBox from "@/components/video/DropBox";
import ModalScreen from "@/components/ModalScreen";
import img_example from "/public/assets/image.png";
import { GoUpload } from "react-icons/go";
import { motion } from "framer-motion";
import { useUser } from "@/components/LayoutProvider";

const Page = () => {
  const { user } = useUser();
  const [modal, setModal] = useState(false);
  return (
    <>
      <ModalScreen visible={modal} onClose={() => setModal(false)}>
        <div className="h-full w-full">
          <h1 className="text-center text-lg">Upload your video{"(s)"}</h1>
          <div className="flex w-full justify-center">
            <DropBox />
          </div>
        </div>
      </ModalScreen>
      <div>
        <Profile name={user.email} />
        <div className="flex flex-row justify-between py-2">
          <p className="font-semibold text-2xl">Your Videos</p>
          <motion.button
            className="bg-secondary hover:bg-secondary text-red font-bold py-2 px-4 rounded flex flex-row gap-1 items-center"
            whileTap={{ scale: 0.9 }}
            onClick={() => setModal(true)}
          >
            <GoUpload />
            Upload a Video
          </motion.button>
        </div>
        <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2">
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
    </>
  );
};

export default Page;
