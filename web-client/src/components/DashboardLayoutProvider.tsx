"use client";

import React, { useEffect, useState } from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import urlJoin from "url-join";
import { useUser } from "./LayoutProvider";
import { getCookie } from "@/utils/handleCookies";

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL as string;

const DashboardLayoutProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user, setUser } = useUser();
  const graphqlEndpoint = urlJoin(baseUrl, "/media/graphql");

  useEffect(() => {
    getCookie("jwt-token").then((token) => {
      if (token) {
        setUser({ ...user, token: String(token) });
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const client = new ApolloClient({
    uri: graphqlEndpoint,
    cache: new InMemoryCache(),
    headers: {
      Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMCwiZXhwIjoxNzEyNDMzODkwfQ.rvx4nmgfVpInN39yqNLc8oSJpLTU2Y_yHTHeXOGeYic`,
    },
  });
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default DashboardLayoutProvider;
