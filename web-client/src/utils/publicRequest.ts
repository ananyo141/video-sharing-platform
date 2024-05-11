import axios, { AxiosRequestConfig } from "axios";
interface Headers {
  [key: string]: string;
}

const publicRequest = async (
  url: string,
  method: string = "GET",
  body?: any,
  headers: Headers = {} 
) => {
  const config: AxiosRequestConfig = {
    method,
    url,
    headers: {
      "content-type": "application/json",
      ...headers,
    },
    data: body,
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error("Error occurred during request:", error);
    throw error;
  }
};

export default publicRequest;
