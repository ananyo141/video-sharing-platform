"use client";

import React, { useState } from "react";
import IconFallback from "../IconFallback";
import { IoIosSearch } from "react-icons/io";
import { RiVideoAddLine } from "react-icons/ri";
import { useRouter } from "next/navigation";

const TopNavbar: React.FC = () => {
  const { push } = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Searching for:", searchValue);
    // Add your search logic here
  };

  return (
    <nav className="bg-secondary h-14 flex justify-between px-10 items-center">
      <span className="font-semibold text-xl">Vimero</span>
      <div className="flex">
        <input
          className="p-2 px-6 text-sm border border-tertiary rounded-full rounded-r-none bg-white outline-none min-w-full"
          placeholder="Type Your Search..."
        />
        <button className="p-2 pr-4 border rounded-full rounded-l-none bg-tertiary border-tertiary text-sm text-white flex items-center justify-between gap-2">
          <IoIosSearch size={16} />
          Search
        </button>
      </div>
      <div className="flex gap-4 items-center">
        <div className="hover:bg-slate-400 p-2 rounded-full cursor-pointer">
          <RiVideoAddLine size={25} onClick={() => push("/account?modal=true")} />
        </div>
        <div className="" onBlur={toggleMenu}>
          <IconFallback onClick={() => push("/account")} size="sm" word="A" />
          <div
            className={`mt-2 bg-white rounded p-2 absolute right-0 z-10 ${
              isMenuOpen ? "block" : "hidden"
            }`}
          >
            <div className="m-2 p-2 px-4 hover:bg-slate-200 select-none cursor-pointer rounded-lg">
              Sign Out
            </div>
            <div className="m-2 p-2 px-4 hover:bg-slate-200 select-none cursor-pointer rounded-lg">
              Sign Out
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
