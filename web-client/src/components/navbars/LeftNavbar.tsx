"use client"

import React from "react";
import NavBarButton from "../NavBarButton";
import { RiHome2Line, RiHome2Fill } from "react-icons/ri";
import { usePathname } from "next/navigation";
import {
  MdSubscriptions,
  MdOutlineSubscriptions,
  MdWatchLater,
  MdOutlineWatchLater,
} from "react-icons/md";
import { RiHistoryFill, RiHistoryLine } from "react-icons/ri";

const LeftNavbar = () => {
  const pathname = usePathname();
  return (
    <div className="flex flex-row h-3.5 md:h-screen md:flex-col bg-secondary md:min-w-[8rem] lg:min-w-[16rem]">
      {urls.map((item, index) => {
        const isActive = pathname === item.href;
        return (
          <NavBarButton
            key={index}
            href={item.href}
            label={item.label}
            icon={isActive ? item.iconFilled : item.icon}
            active={isActive}
          />
        );
      })}
      <hr className="w-full" />
      <h2 className="font-semibold p-4 md:hidden">Subscribptions</h2>
      <div></div>
    </div>
  );
};

export default LeftNavbar;

const urls = [
  {
    label: "Home",
    href: "/",
    icon: <RiHome2Line />,
    iconFilled: <RiHome2Fill />,
  },
  {
    label: "Subscription",
    href: "/subscription",
    icon: <MdOutlineSubscriptions />,
    iconFilled: <MdSubscriptions />,
  },
  {
    label: "History",
    href: "/history",
    icon: <RiHistoryLine />,
    iconFilled: <RiHistoryFill />,
  },
  {
    label: "Watch Later",
    href: "/watch-later",
    icon: <MdOutlineWatchLater />,
    iconFilled: <MdWatchLater />,
  },
];
