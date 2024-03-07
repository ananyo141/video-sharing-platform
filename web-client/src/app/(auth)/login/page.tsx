"use client";

import React, { useState, ChangeEvent, useEffect } from "react";
import Link from "next/link";
import Illustration from "@/components/Illustration";
import illustration1 from "/public/assets/illustration/fill-rolls.svg";
import illustration2 from "/public/assets/illustration/live-collabration.svg";
import illustration3 from "/public/assets/illustration/video-upload.svg";
import illustration4 from "/public/assets/illustration/videographer.svg";
import useAuth from "@/hooks/useAuth";
import { LoginInterface } from "@/interface/auth.interface";

const Page = () => {
  const [value, setValue] = useState<LoginInterface>({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const { handleLogin, error } = useAuth<LoginInterface>();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnLogin = async () => {
    // if (!online) {
    //   setErrorMessage("No Internet Connection");
    //   return;
    // }
    const data = await handleLogin(value);

    console.log(data);
  };

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
    }
  }, [error]);

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
          <h2 className="text-tertiary text-2xl font-semibold p-5 select-none">
            Welcome Back to Vimero
          </h2>
          <input
            type="text"
            placeholder="Enter Your Email"
            className="input w-full p-2 px-4 mb-6 rounded-full border-0 outline-1 text-sm outline-tertiary"
            value={value.email}
            onChange={handleChange}
            name="email"
          />
          <input
            type="password"
            placeholder="Enter Your Passwod"
            className="input w-full p-2 px-4 mb-6 rounded-full text-sm outline-tertiary"
            value={value.password}
            onChange={handleChange}
            name="password"
          />
          <span className="font-semibold text-red-600 text-sm">
            {errorMessage}
          </span>
          <button
            className="text-white bg-tertiary rounded-full p-2 w-40 self-center hover:bg-background hover:text-tertiary transition active:scale-95"
            onClick={handleOnLogin}
          >
            Login
          </button>
          <div className="p-2">
            {"Don't Have an Account? "}
            <Link
              href={"/register"}
              className="font-semibold text-tertiary hover:underline"
            >
              Register
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default Page;
