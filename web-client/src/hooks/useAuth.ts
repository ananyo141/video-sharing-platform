import { useState } from "react";
import { setCookie } from "@/utils/handleCookies";
import urlJoin from "url-join";

interface AuthResponse {
  success: boolean;
  message?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL as string;

const useAuth = <T>() => {
  const [error, setError] = useState<string | null>(null);

  const authUrl = urlJoin(baseUrl, "auth");

  const handleLogin = async (credentials: T): Promise<AuthResponse> => {
    const loginUrl = urlJoin(authUrl, "/login");
    try {
      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Login failed");
        return data;
      }
      setError(null);
      setCookie("jwt-token", data.data.access_token);
      return data;
    } catch (error) {
      setError("An error occurred during login");
      return { success: false };
    }
  };

  const handleRegister = async (credentials: T): Promise<AuthResponse> => {
    const registerUrl = urlJoin(authUrl, "/register");
    try {
      const response = await fetch(registerUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        // mode: "no-cors",
      });
      const data = await response.json();
      console.log(data)
      if (!response.ok) {
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
