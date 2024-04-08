"use client";

import { useState, useEffect } from "react";
import Profile from "@/components/Profile";
import VideoComponent from "@/components/VideoComponent";
import DropBox from "@/components/video/DropBox";
import ModalScreen from "@/components/ModalScreen";
import { GoUpload } from "react-icons/go";
import { motion } from "framer-motion";
import { useUser } from "@/provider/LayoutProvider";
import { useFetchByUserId } from "@/hooks/useFetch";
import Video from "@/interface/video.interface";

interface VideoInterface {
  videos: Video[];
}

const Page = () => {
  const { user } = useUser();
  const [modal, setModal] = useState(false);

  const { data, isLoading, error } = useFetchByUserId<VideoInterface>(9);

  useEffect(() => {
    console.log(data);
  }, [data]);

  const closeModal = () => {
    setModal(false);
  };

  return (
    <>
      <ModalScreen visible={modal} onClose={() => setModal(false)}>
        <DropBox closeModal={closeModal} />
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
        <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2 mb-16">
          {!isLoading &&
            data &&
            data?.videos.map((item) => (
              <VideoComponent
                title={item.title}
                url={`watch/${item._id}`}
                key={item._id}
              />
            ))}
        </div>
      </div>
    </>
  );
};

export default Page;
