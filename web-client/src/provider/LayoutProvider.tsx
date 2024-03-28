"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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

  const router = useRouter();

  useEffect(() => {
    if (user.token.length === 0) {
      router.push("/login");
    }
  }, [user.token, router]);

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
