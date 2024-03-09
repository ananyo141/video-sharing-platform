import publicRequest from "./publicRequest";

// enum HttpMethod {
//   GET = "GET",
//   POST = "POST",
//   DELETE = "DELETE",
//   PUT = "PUT",
// }

const privateRequest = async (
  url: string,
  method: "GET" | "POST",
  token: string,
  body?: any
): Promise<any> => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  return publicRequest(url, method, body, headers);
};

export default privateRequest;
