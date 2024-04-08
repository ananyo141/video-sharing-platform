import React from "react";

interface Props {
  percentage: number;
}

const ProgressBar = ({ percentage }: Props) => {
  return (
    <div className="w-[90%] mx-auto h-6 mt-1 bg-gray-200 rounded-lg">
      <div
        className="h-full text-white text-center rounded-lg bg-green-600"
        style={{ width: `${percentage}%` }}
      >
        {percentage}%
      </div>
    </div>
  );
};

export default ProgressBar;
