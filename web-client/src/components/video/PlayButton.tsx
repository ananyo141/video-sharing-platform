import React from "react";
import { IoPlayCircleOutline } from "react-icons/io5";

const Playbutton = () => {
  return (
    <div className="flex items-center justify-center backdrop-blur-[5px] h-full w-full">
      <IoPlayCircleOutline size={100} color="white" />
    </div>
  );
};

export default Playbutton;
