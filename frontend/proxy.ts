import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("mindspace_token")?.value;

  const isProtectedRoute =
    req.nextUrl.pathname.startsWith("/dashboard") ||
    req.nextUrl.pathname.startsWith("/mood")       ||
    req.nextUrl.pathname.startsWith("/journal")    ||
    req.nextUrl.pathname.startsWith("/gratitude")  ||
    req.nextUrl.pathname.startsWith("/habits")     ||
    req.nextUrl.pathname.startsWith("/meditation") ||
    req.nextUrl.pathname.startsWith("/profile")    ||
    req.nextUrl.pathname.startsWith("/settings")   || // ← added
    req.nextUrl.pathname.startsWith("/u/");            // ← added

  const isAuthRoute =
    req.nextUrl.pathname === "/login" ||
    req.nextUrl.pathname === "/signup";

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*", "/mood/:path*", "/journal/:path*",
    "/gratitude/:path*", "/habits/:path*", "/meditation/:path*",
    "/profile/:path*", "/settings/:path*", "/u/:path*",
    "/login", "/signup",
  ],
};