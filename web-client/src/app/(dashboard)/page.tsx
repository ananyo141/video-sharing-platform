"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client";
import { get_videos } from "@/query/graphql";

const Page = () => {
  const { loading, error, data } = useQuery(get_videos);

  console.log(data)

  return (
    <div className="flex flex-col justify-center">
      <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4"></div>
      {
        data && (<>{String(data)}</>)
      }
    </div>
  );
};

export default Page;
