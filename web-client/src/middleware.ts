import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
  const cookieStore = cookies();

  const JWT_TOKEN = cookieStore.get("jwt-token");
  const path = request.nextUrl.pathname;

  // Logic for redirecting logged-in users from "/login"
  if (JWT_TOKEN && (path === "/login" || path === "/register")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Logic for redirecting unauthenticated users to "/login" (excluding "/login" itself)
  if (!JWT_TOKEN && !(path === "/login" || path === "/register")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Proceed as usual if no redirects are needed
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
  ],
};
