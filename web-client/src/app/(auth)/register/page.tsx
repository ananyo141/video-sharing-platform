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
    console.log(value);
    const data = await handleRegister(value);
    console.log(data);
  };

  return (
    <>
      <Illustration src={illustration1} className="top-5 left-32" />
      <Illustration src={illustration2} className="bottom-12 left-[20%]" size={500} />
      <Illustration src={illustration3} className="top-2 right-5" />

      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary">
        <div className="app-container flex items-center justify-center">
          <div className="max-w-2xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="hidden md:block">
              <Illustration src={illustration2} />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                Create an account
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Join Vimero and start sharing your videos with the world.
              </p>

              <label
                htmlFor="register-username"
                className="block text-sm mb-1 text-gray-600 dark:text-gray-300"
              >
                Username
              </label>
              <input
                id="register-username"
                type="text"
                placeholder="username"
                className="w-full p-3 mb-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm outline-none"
                value={value.username}
                onChange={handleChange}
                name="username"
              />

              <label
                htmlFor="register-email"
                className="block text-sm mb-1 text-gray-600 dark:text-gray-300"
              >
                Email
              </label>
              <input
                id="register-email"
                type="text"
                placeholder="you@example.com"
                className="w-full p-3 mb-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm outline-none"
                value={value.email}
                onChange={handleChange}
                name="email"
              />

              <label
                htmlFor="register-password"
                className="block text-sm mb-1 text-gray-600 dark:text-gray-300"
              >
                Password
              </label>
              <input
                id="register-password"
                type="password"
                placeholder="Choose a secure password"
                className="w-full p-3 mb-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm outline-none"
                value={value.password}
                onChange={handleChange}
                name="password"
              />

              <button
                className="w-full py-3 mb-3 rounded-lg bg-gradient-to-r from-primary to-accent text-white font-semibold shadow"
                onClick={handleOnRegister}
              >
                Create account
              </button>

              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href={"/login"} className="text-accent font-semibold">
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

// Export the RegisterPage component as the default export
export default RegisterPage;
