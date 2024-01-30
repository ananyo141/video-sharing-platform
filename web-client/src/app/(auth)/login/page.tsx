"use client";

import React, { useState, ChangeEvent } from "react";
import Illustration from "@/components/Illustration";
import illustration1 from "/public/assets/illustration/fill-rolls.svg";
import illustration2 from "/public/assets/illustration/live-collabration.svg";
import illustration3 from "/public/assets/illustration/video-upload.svg";
import illustration4 from "/public/assets/illustration/videographer.svg";

const Page = () => {
  const [value, setValue] = useState({ email: "", password: "" });
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = () => {};

  return (
    <>
      <Illustration src={illustration1} className="right-5 bottom-32" />
      <Illustration
        src={illustration2}
        className="top-12 right-[40%]"
        size={400}
      />
      <Illustration src={illustration3} className="bottom-2 left-2" />
      <Illustration src={illustration4} className="top-32 left-5" />
      <main className="bg-background flex items-center justify-center h-screen">
        <div className="bg-secondary flex flex-col item-center text-center p-10 px-24 rounded-lg w-[36rem] z-10 shadow">
          <h2 className="text-red text-2xl font-semibold p-5 select-none">
            Welcome to Vimero
          </h2>
          <input
            type="text"
            placeholder="Enter Your Email"
            className="input w-full p-2 px-4 mb-6 rounded-full border-0 outline-1 text-sm"
            value={value.email}
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Enter Your Passwod"
            className="input w-full p-2 px-4 mb-6 rounded-full text-sm"
            value={value.password}
            onChange={handleChange}
          />
          <button
            className="text-white bg-red rounded-full p-2 w-40 self-center hover:bg-background hover:text-red transition active:scale-95"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </main>
    </>
  );
};

export default Page;
