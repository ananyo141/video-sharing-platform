"use client";

import React from "react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
}

const Button: React.FC<Props> = ({ children, className = "", variant = "primary", ...props }) => {
  const base =
    "inline-flex items-center justify-center rounded-lg px-4 py-2 font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants: Record<string, string> = {
    primary: "bg-gradient-to-r from-primary to-accent text-white shadow",
    ghost: "bg-transparent text-muted",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
