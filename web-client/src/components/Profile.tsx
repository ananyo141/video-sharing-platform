"use client"

import { StaticImageData } from "next/image";
import React from "react";
import Image from "next/image";

interface ProfileProps {
  name: string;
  icon?: StaticImageData | string;
}

const IconFallback = ({ word }: { word: string }) => {
  return (
    <div className="bg-secondary rounded-full h-24 w-24 flex justify-center items-center select-none">
      <span className="text-red font-semibold text-5xl">{word.at(0)?.toUpperCase()}</span>
    </div>
  );
};

const Profile = (props: ProfileProps) => {
  return (
    <div className="m-2 flex flex-row items-center gap-2">
      {props.icon ? (
        <Image src={props.icon} alt={props.name} height={100} width={100} />
      ) : (
        <IconFallback word={props.name} />
      )}
      <span className="text-2xl">{props.name}</span>
    </div>
  );
};

export default Profile;
