import React from "react";
import Image, { StaticImageData } from "next/image";

interface Props {
  src: string | StaticImageData;
  className?: string;
  size?: number;
}

const Illustration = ({ src, className = "", size = 300 }: Props) => {
  return (
    <div className={`absolute z-0 ${className}`}>
      <Image alt="illustation" src={src} height={size} width={size} />
    </div>
  );
};

export default Illustration;
