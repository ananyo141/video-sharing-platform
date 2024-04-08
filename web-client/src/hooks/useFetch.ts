"use client";

import { GraphQLClient } from "graphql-request";
import { useEffect, useState } from "react";
import urlJoin from "url-join";
import Cookies from "js-cookie";
import getVideoGQLQuery from "@/queries/getVideos.graphql";

const baseURL = process.env.NEXT_PUBLIC_SERVER_URL as string;

const useFetch = <T>(query: any, method: "GET" | "POST", variables?: any) => {
  const [isLoading, setLoading] = useState(true);
  const [key, setKey] = useState(0);
  const [error, setError] = useState<string>("");
  const [data, setData] = useState<T>();

  const refresh = () => {
    setKey((prevKey) => prevKey + 1);
  };

  const endpoint = urlJoin(baseURL, "/media/graphql");

  const client = new GraphQLClient(endpoint, {
    method,
    headers: {
      authorization: `Bearer ${Cookies.get("jwt-token")}`,
    },
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: T = await client.request(query, variables);
        setData(response);
      } catch (error: any) {
        setError(String(error));
      }
      setLoading(false);
    };

    fetchData();
  }, [key,client,query,variables]);

  return { data, isLoading, error, refresh };
};

const useFetchAllVideos = <T>() => {
  return useFetch<T>(getVideoGQLQuery, "POST");
};

// const useFetchSingleVideoById = <T>(id: string) => {
//   return useFetch<T>(watchVideo, "POST", { id: id });
// };

export { useFetchAllVideos };

export default useFetch;
