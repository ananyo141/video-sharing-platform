"use client";

import React from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input: React.FC<Props> = ({ label, className = "", ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">{label}</label>}
      <input
        {...props}
        className={`w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm outline-none ${className}`}
      />
    </div>
  );
};

export default Input;
