"use client";

import React, { useState, ChangeEvent } from "react";
import Link from "next/link";
import Illustration from "@/components/Illustration";
import illustration1 from "/public/assets/illustration/fill-rolls.svg";
import illustration2 from "/public/assets/illustration/live-collabration.svg";
import illustration3 from "/public/assets/illustration/video-upload.svg";
import useAuth from "@/hooks/useAuth";
import { RegisterInterface } from "@/interface/auth.interface";

const RegisterPage = () => {
  // State for form inputs
  const { handleRegister, error } = useAuth<RegisterInterface>();
  const [value, setValue] = useState<RegisterInterface>({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnRegister = async () => {
    console.log(value)
    const data = await handleRegister(value)
    console.log(data)
  };

  return (
    <>
      <Illustration src={illustration1} className="top-5 left-32" />
      <Illustration
        src={illustration2}
        className="bottom-12 left-[20%]"
        size={500}
      />
      <Illustration src={illustration3} className="top-2 right-5" />

      <main className="bg-background flex items-center justify-center h-screen">
        <div className="bg-secondary flex flex-col item-center text-center p-10 px-24 rounded-lg w-[36rem] z-10 shadow">
          <h2 className="text-tertiary text-2xl font-semibold p-5 select-none">
            Create an Account
          </h2>

          <input
            type="password"
            placeholder="Enter Username"
            className="input w-full p-2 px-4 mb-6 rounded-full text-sm outline-tertiary"
            value={value.username}
            onChange={handleChange}
            name="username"
          />

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
            placeholder="Enter Your Password"
            className="input w-full p-2 px-4 mb-6 rounded-full text-sm"
            value={value.password}
            onChange={handleChange}
            name="password"
          />

          <button
            className="text-white bg-tertiary rounded-full p-2 w-40 self-center hover:bg-background hover:text-tertiary transition active:scale-95"
            onClick={handleOnRegister}
          >
            Register
          </button>

          <div className="p-2">
            {"Already have an account? "}
            <Link
              href={"/login"}
              className="font-semibold text-tertiary hover:underline"
            >
              Login
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

// Export the RegisterPage component as the default export
export default RegisterPage;
