"use client"

import { StaticImageData } from "next/image";
import React from "react";
import Image from "next/image";
import IconFallback from "./IconFallback";
import Card from "./ui/Card";

interface ProfileProps {
  name: string;
  icon?: StaticImageData | string;
}

const Profile = (props: ProfileProps) => {
  return (
    <Card className="flex items-center gap-4 p-4 mb-4">
      <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
        {props.icon ? (
          <Image src={props.icon} alt={props.name} height={64} width={64} />
        ) : (
          <IconFallback word={props.name} />
        )}
      </div>
      <div>
        <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{props.name}</div>
        <div className="text-sm text-gray-500">Member</div>
      </div>
    </Card>
  );
};

export default Profile;
