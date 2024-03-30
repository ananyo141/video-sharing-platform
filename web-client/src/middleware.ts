import { NextRequest, NextResponse } from "next/server";
import isValidJWT from "./utils/validJwt";

export default async function middleware(request: NextRequest) {
  const JWT_TOKEN = request.cookies.get("jwt-token");
  const path = request.nextUrl.pathname;

  const validJWT = JWT_TOKEN && isValidJWT(JWT_TOKEN.value);

  if (validJWT && authPaths.includes(path)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!validJWT && !authPaths.includes(path)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

const authPaths = ["/login", "/register"];
const dashboardPaths = [
  "account",
  "history",
  "subscription",
  "watch/:path*",
  "watch-later",
];

export const config = {
  matcher: [...authPaths, ...dashboardPaths],
};
