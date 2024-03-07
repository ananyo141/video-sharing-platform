import Response from "./response.interface";

export default interface LoginRequest extends Response {
  message: string;
  data: Data;
  page: string;
}

interface Data {
    access_token: string
}