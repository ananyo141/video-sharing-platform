"use client";

import React, { useState, useEffect } from "react";
import IconFallback from "../IconFallback";
import { IoIosSearch } from "react-icons/io";
import { RiVideoAddLine } from "react-icons/ri";
import { useRouter } from "next/navigation";

const TopNavbar: React.FC = () => {
  const { push } = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [theme, setTheme] = useState("light");

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

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setTheme("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (theme === "light") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setTheme("light");
    }
  };

  return (
    <nav className="w-full bg-white dark:bg-bg-dark/80 dark:backdrop-blur-sm shadow-sm sticky top-0 z-30">
      <div className="app-container flex items-center gap-6 h-16">
        <div className="flex items-center gap-3">
          <span className="font-extrabold text-xl text-primary">Vimero</span>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex flex-1 max-w-xl items-center gap-2">
          <div className="relative w-full">
            <input
              value={searchValue}
              onChange={handleSearchChange}
              className="w-full py-2 px-4 rounded-full border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 text-sm shadow-sm outline-none"
              placeholder="Search videos, creators..."
            />
            <button type="submit" className="absolute right-1 top-1.5 bg-accent text-white px-3 py-1.5 rounded-full text-sm shadow">
              <IoIosSearch size={16} />
            </button>
          </div>
        </form>

        <div className="flex items-center gap-3">
          <button
            aria-label="upload"
            onClick={() => push("/account?modal=true")}
            className="p-2 rounded-full bg-secondary hover:scale-105 transition-transform"
          >
            <RiVideoAddLine size={22} />
          </button>

          <button
            aria-label="toggle-theme"
            onClick={toggleTheme}
            className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-sm"
          >
            {theme === "light" ? "Dark" : "Light"}
          </button>

          <div className="relative" onBlur={toggleMenu}>
            <IconFallback onClick={() => push("/account")} size="sm" word="A" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
