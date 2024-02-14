"use client";

import React from "react";
import { motion } from "framer-motion";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";

interface Props {
  thumbnail?: string | StaticImageData;
  title: string;
  url: string;
}

const VideoComponent = (props: Props) => {
  return (
    <Link href={props.url}>
      <motion.div
        whileHover={{
          transition: { delay: 0.5 },
          scale: 1.05,
          zIndex: 100
        }}
        className="shadow h-[200px] relative rounded"
        style={{ overflow: 'hidden' }}
      >
        <div className="relative w-full h-full">
          {props.thumbnail ? (
            <Image
              alt={props.title}
              src={props.thumbnail}
              layout="fill"
              objectFit="cover"
            />
          ) : (
            <div className="bg-green-300 h-full w-full"></div>
          )}
        </div>
        <span className="absolute bottom-0 left-0 right-0 p-2 bg-black text-white">{props.title}</span>
      </motion.div>
    </Link>
  );
};

export default VideoComponent;
