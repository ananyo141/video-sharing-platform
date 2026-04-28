"use client";

import React from "react";

const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = "", ...props }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl p-4 shadow ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
