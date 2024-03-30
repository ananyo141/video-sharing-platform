import urlJoin from "url-join";

const baseURL = process.env.NEXT_PUBLIC_SERVER_URL as string;

const getVideoURI = (uri: string) => {
  return urlJoin(String(baseURL), "/bucket", uri);
};

export default getVideoURI;