import { useState } from "react";
import { setCookie } from "@/utils/handleCookies";
import urlJoin from "url-join";
import publicRequest from "@/utils/publicRequest";
import LoginRequest from "@/interface/login.interface";

interface AuthResponse {
  success: boolean;
  message?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL as string;

const useAuth = <T>() => {
  const [error, setError] = useState<string | null>(null);

  const authUrl = urlJoin(baseUrl, "auth");

  const handleLogin = async (credentials: any): Promise<AuthResponse> => {
    const loginUrl = urlJoin(authUrl, "/login");
    try {
      const data: LoginRequest = await publicRequest(
        loginUrl,
        "POST",
        credentials
      );
      if (!data.success) {
        setError(data.message || "Login failed");
      } else {
        setError(null);
        setCookie("jwt-token", data.data.access_token);
        setCookie("email", credentials.email); //not working
      }
      return data;
    } catch (error) {
      setError(String(error));
      return { success: false };
    }
  };

  const handleRegister = async (credentials: T): Promise<AuthResponse> => {
    const registerUrl = urlJoin(authUrl, "/register");
    try {
      const data = await publicRequest(registerUrl, "POST", credentials);
      if (!data.success) {
        setError(data.message || "Registration failed");
        return { success: false };
      }
      setError(null);
      return { success: true };
    } catch (error) {
      setError("An error occurred during registration");
      return { success: false };
    }
  };

  return { error, handleLogin, handleRegister };
};

export default useAuth;
