"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

interface UserContextType {
  user: { email: string; token: string };
  setUser: React.Dispatch<
    React.SetStateAction<{ email: string; token: string }>
  >;
}

const UserContext = createContext<UserContextType>({
  user: { email: "", token: "" },
  setUser: () => {},
});

const useUser = () => useContext(UserContext);

const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<{ email: string; token: string }>({
    email: "",
    token: "",
  });

  useEffect(() => {
    setUser({ ...user, token: Cookies.get("jwt-token") as string });
  }, [user]);

  return (
    <>
      <UserContext.Provider value={{ user, setUser }}>
        {children}
      </UserContext.Provider>
    </>
  );
};

export default LayoutProvider;
export { useUser };
