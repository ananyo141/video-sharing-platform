"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import Cookies from "js-cookie";
import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, ApolloProvider } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import urlJoin from "url-join";
import { ToastContainer } from "react-toastify";
import TopProgresBar from "@/components/loader/TopProgressBar";

const resolveServerUrl = () => {
  const configuredUrl = process.env.NEXT_PUBLIC_SERVER_URL?.trim();

  if (configuredUrl) {
    return configuredUrl;
  }

  if (process.env.NODE_ENV === "development") {
    return "http://localhost:5000";
  }

  throw new Error("NEXT_PUBLIC_SERVER_URL must be set in non-development environments.");
};

const baseURL = resolveServerUrl();

interface UserContextType {
  user: { email: string; token: string };
  setUser: React.Dispatch<React.SetStateAction<{ email: string; token: string }>>;
}

const UserContext = createContext<UserContextType>({
  user: { email: "", token: "" },
  setUser: () => {},
});

const useUser = () => useContext(UserContext);

const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
  const client = useMemo(() => {
    const authLink = setContext((_, { headers }) => {
      const token = Cookies.get("jwt-token");

      return {
        headers: {
          ...headers,
          ...(token ? { authorization: `Bearer ${token}` } : {}),
        },
      };
    });

    const httpLink = new HttpLink({
      uri: urlJoin(baseURL, "/media/graphql"),
    });

    return new ApolloClient({
      link: ApolloLink.from([authLink, httpLink]),
      cache: new InMemoryCache(),
    });
  }, []);

  const [user, setUser] = useState<{ email: string; token: string }>({
    email: "",
    token: "",
  });

  return (
    <ApolloProvider client={client}>
      <UserContext.Provider value={{ user, setUser }}>
        <TopProgresBar />
        {children}
        <ToastContainer />
      </UserContext.Provider>
    </ApolloProvider>
  );
};

export default LayoutProvider;
export { useUser };
