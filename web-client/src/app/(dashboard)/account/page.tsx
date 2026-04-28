"use client";

import { useState, useEffect } from "react";
import Profile from "@/components/Profile";
import Button from "@/components/ui/Button";
import VideoComponent from "@/components/VideoComponent";
import DropBox from "@/components/video/DropBox";
import ModalScreen from "@/components/ModalScreen";
import { GoUpload } from "react-icons/go";
import { motion } from "framer-motion";
import { useUser } from "@/provider/LayoutProvider";
import getVideoByUser from "@/queries/getVideByUser.graphql";
import Video from "@/interface/video.interface";
import { gql, useQuery } from "@apollo/client";
import CubesLoader from "@/components/loader/CubesLoader";

interface Response {
  videos: Video[];
}

const Page = () => {
  const { user } = useUser();
  const [modal, setModal] = useState(false);

  const { data, loading, error } = useQuery<Response>(gql`
    ${getVideoByUser}
  `);

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
        <div className="flex items-center justify-between gap-4">
          <Profile name={user.email} />
          <div className="ml-auto">
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button onClick={() => setModal(true)}>
                <span className="mr-2">
                  <GoUpload />
                </span>
                Upload
              </Button>
            </motion.div>
          </div>
        </div>
        <div className="flex items-center justify-between py-2">
          <p className="font-semibold text-2xl">Your Videos</p>
        </div>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {!loading &&
            data &&
            data?.videos.map((item) => (
              <VideoComponent
                title={item.title}
                url={`watch/${item._id}`}
                thumbnailURL={item.thumbnailUrl}
                key={item._id}
              />
            ))}
        </div>
      </div>
    </>
  );
};

export default Page;
