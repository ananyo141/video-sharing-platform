import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface VideoComponentProps {
  thumbnailURL: string
  title: string;
  url: string;
}

const VideoComponent: React.FC<VideoComponentProps> = ({
  thumbnailURL,
  title,
  url,
}) => {
  return (
    <Link href={url} passHref>
      <motion.a
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="block rounded-lg overflow-hidden transition-transform duration-200 ease-in-out shadow-md bg-surface"
      >
        <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
          {thumbnailURL ? (
            <Image
              alt={title}
              src={`https://videosite.ddns.net/${thumbnailURL}`}
              layout="fill"
              objectFit="cover"
              className="rounded-t-lg"
            />
          ) : (
            <div className="absolute inset-0 bg-gray-200" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
            <span className="text-sm font-semibold text-white line-clamp-2">{title}</span>
          </div>
        </div>
      </motion.a>
    </Link>
  );
};

export default VideoComponent;
