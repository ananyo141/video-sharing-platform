"use client";

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
    <aside className="hidden md:flex md:flex-col md:h-screen md:sticky md:top-16 bg-white dark:bg-gray-900 shadow-sm md:min-w-[72px] lg:min-w-[220px] p-3 gap-3">
      <div className="flex flex-col gap-2">
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
      </div>
      <hr className="my-2 border-gray-100 dark:border-gray-800" />
      <div className="mt-auto text-sm text-muted hidden lg:block">Subscriptions</div>
    </aside>
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
