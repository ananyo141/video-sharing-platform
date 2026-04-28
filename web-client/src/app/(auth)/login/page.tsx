"use client";

import React, { useState, ChangeEvent, useEffect } from "react";
import Link from "next/link";
import Illustration from "@/components/Illustration";
import illustration1 from "/public/assets/illustration/fill-rolls.svg";
import illustration2 from "/public/assets/illustration/live-collabration.svg";
import illustration3 from "/public/assets/illustration/video-upload.svg";
import illustration4 from "/public/assets/illustration/videographer.svg";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const handleOnLogin = async () => {
    // if (!online) {
    //   setErrorMessage("No Internet Connection");
    //   return;
    // }
    const data = await handleLogin(value);
    if (data.success) {
      router.refresh();
    }
    console.log(data);
  };

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
    }
  }, [error]);

  return (
    <>
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary">
        <div className="app-container flex items-center justify-center">
          <div className="max-w-2xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="hidden md:block">
              <Illustration src={illustration1} className="" />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">Welcome Back</h2>
              <p className="text-sm text-gray-500 mb-6">Sign in to your account to continue watching and uploading videos.</p>

              <label htmlFor="login-email" className="block text-sm mb-1 text-gray-600 dark:text-gray-300">Email</label>
              <input
                id="login-email"
                type="text"
                placeholder="you@example.com"
                className="w-full p-3 mb-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm outline-none"
                value={value.email}
                onChange={handleChange}
                name="email"
              />

              <label htmlFor="login-password" className="block text-sm mb-1 text-gray-600 dark:text-gray-300">Password</label>
              <input
                id="login-password"
                type="password"
                placeholder="Your password"
                className="w-full p-3 mb-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm outline-none"
                value={value.password}
                onChange={handleChange}
                name="password"
              />

              <div className="text-sm text-red-600 mb-4">{errorMessage}</div>

              <button
                className="w-full py-3 mb-3 rounded-lg bg-gradient-to-r from-primary to-accent text-white font-semibold shadow"
                onClick={handleOnLogin}
              >
                Sign in
              </button>

              <div className="text-center text-sm">
                Don&apos;t have an account?{' '}
                <Link href={'/register'} className="text-accent font-semibold">
                  Create account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Page;
