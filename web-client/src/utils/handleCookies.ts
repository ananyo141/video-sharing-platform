"use server";

import { cookies } from "next/headers";

const cookiesStore = cookies();

const setCookie = (key: string, value: string) => {
  cookiesStore.set(key, value);
};

const getCookie = (key: string) => {
  const value = cookiesStore.get(key)?.value;
  return value;
};

export { setCookie, getCookie };
