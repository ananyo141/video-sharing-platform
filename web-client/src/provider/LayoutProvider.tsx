"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import urlJoin from "url-join";
import { ToastContainer } from "react-toastify";

const baseURL = process.env.NEXT_PUBLIC_SERVER_URL as string;

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
  const client = new ApolloClient({
    uri: urlJoin(baseURL, "/media/graphql"),
    cache: new InMemoryCache(),
    headers: {
      authorization: `Bearer ${Cookies.get("jwt-token")}`,
    },
  });

  const [user, setUser] = useState<{ email: string; token: string }>({
    email: "",
    token: "",
  });

  // useEffect(() => {
  //   setUser({ ...user, token: Cookies.get("jwt-token") as string });
  // }, [user]);

  return (
    <ApolloProvider client={client}>
      <UserContext.Provider value={{ user, setUser }}>
        {children}
        <ToastContainer />
      </UserContext.Provider>
    </ApolloProvider>
  );
};

export default LayoutProvider;
export { useUser };
