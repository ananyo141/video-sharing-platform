import axios, { AxiosRequestConfig } from "axios";

const privateRequest = async (
  url: string,
  method: "GET" | "POST" | "DELETE" | "PUT",
  token: string,
  body?: any
): Promise<any> => {
  const config: AxiosRequestConfig = {
    method,
    url,
    headers: {
      Authorization: token,
    },
    data: body,
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default privateRequest;
