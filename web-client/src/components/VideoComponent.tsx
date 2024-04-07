import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface VideoComponentProps {
  thumbnail?: string; // Adjust for StaticImageData if needed
  title: string;
  url: string;
}

const VideoComponent: React.FC<VideoComponentProps> = ({
  thumbnail,
  title,
  url,
}) => {
  return (
    <Link href={url} passHref>
      <motion.a
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="block shadow-md rounded-md overflow-hidden transition-transform duration-200 ease-in-out"
        style={{ position: "relative", width: "100%", height: "200px" }}
      >
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-transparent to-transparent">
          <span className="absolute bottom-0 left-0 right-0 p-4 text-white text-shadow">
            {title}
          </span>
        </div>

        {thumbnail ? (
          <Image alt={title} src={thumbnail} layout="fill" objectFit="cover" />
        ) : (
          <div className="bg-gray-200 h-full w-full" />
        )}
      </motion.a>
    </Link>
  );
};

export default VideoComponent;
