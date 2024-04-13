"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  split,
  concat,
} from "@apollo/client";
import urlJoin from "url-join";
import { ToastContainer } from "react-toastify";
import { HttpLink, ApolloLink } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";

const baseURL = process.env.NEXT_PUBLIC_SERVER_URL as string;
const graphqlSubsciptionEndpoint = process.env
  .NEXT_PUBLIC_GRAPHQL_SUBSCRIPTION_URL as string;

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
  const graphqlEndpoint = urlJoin(baseURL, "/media/graphql");
  const TOKEN = Cookies.get("jwt-token");
  const authMiddleware = new ApolloLink((operation, forward) => {
    const token = localStorage.getItem("token");
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
    });
    return forward(operation);
  });
  const httpLink = new HttpLink({
    uri: graphqlEndpoint,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  const wsLink = new WebSocketLink({
    uri: graphqlSubsciptionEndpoint,
    options: {
      reconnect: true,
      // connectionParams: {
      //   authorization: `Bearer ${TOKEN}`,
      //   // : `Bearer ${TOKEN}`,
      // },
    },
  });

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wsLink,
    httpLink
  );

  const client = new ApolloClient({
    link: concat(splitLink, authMiddleware),
    cache: new InMemoryCache(),
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
