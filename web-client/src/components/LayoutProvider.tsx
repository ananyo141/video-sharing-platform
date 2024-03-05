"use client"

import React from "react";

interface Props {
  children: React.ReactNode;
}

const LayoutProvider = ({ children }: Props) => {
  return <>{children}</>;
};

export default LayoutProvider;
