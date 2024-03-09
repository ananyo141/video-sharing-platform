"use server";

import { cookies } from "next/headers";

const cookiesStore = cookies();

const setCookie = (key: string, value: string) => {
  cookiesStore.set(key, value);
};

const getCookie = async (key: string) => {
  const value = await cookiesStore.get(key)?.value;
  return value;
};

export { setCookie, getCookie };
