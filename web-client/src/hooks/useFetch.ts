import { GraphQLClient } from "graphql-request";
import { useEffect, useState } from "react";
import urlJoin from "url-join";
import Cookies from "js-cookie";
import getVideoGQLQuery from "@/queries/getVideos.graphql";
import getVideoByUser from "@/queries/getVideByUser.graphql";
import Video from "@/interface/video.interface";

const baseURL = process.env.NEXT_PUBLIC_SERVER_URL as string;

const useFetch = <T>(
  query: string | any,
  method: "GET" | "POST",
  variables?: Record<string, any>
) => {
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [data, setData] = useState<T | undefined>();

  const endpoint = urlJoin(baseURL, "/media/graphql");

  useEffect(() => {
    const client = new GraphQLClient(endpoint, {
      method,
      headers: {
        authorization: `Bearer ${Cookies.get("jwt-token")}`,
      },
    });

    const fetchData = async () => {
      setLoading(true);
      try {
        const response: T = await client.request(query, variables);
        setData(response);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [method]);

  return { data, isLoading, error };
};

const useFetchAllVideos = <T>() => {
  return useFetch<T>(getVideoGQLQuery, "POST");
};

const useFetchByUserId = <T>(userId: string | number) => {
  return useFetch<T>(getVideoByUser, "POST", { userId });
};

export { useFetchAllVideos, useFetchByUserId };

export default useFetch;
