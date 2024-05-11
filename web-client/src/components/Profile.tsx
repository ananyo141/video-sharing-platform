"use client"

import { StaticImageData } from "next/image";
import React from "react";
import Image from "next/image";
import IconFallback from "./IconFallback";

interface ProfileProps {
  name: string;
  icon?: StaticImageData | string;
}

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
