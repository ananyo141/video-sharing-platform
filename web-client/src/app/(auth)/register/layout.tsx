import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
};

const LoginLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default LoginLayout;
