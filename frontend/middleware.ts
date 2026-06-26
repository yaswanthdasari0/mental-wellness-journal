import { NextRequest, NextResponse } from "next/server";

// This file must live at frontend/src/middleware.ts (Next.js picks it up automatically)

export function middleware(req: NextRequest) {
  const token = req.cookies.get("mindspace_token")?.value;

  const isProtectedRoute = req.nextUrl.pathname.startsWith("/dashboard") ||
    req.nextUrl.pathname.startsWith("/mood") ||
    req.nextUrl.pathname.startsWith("/journal") ||
    req.nextUrl.pathname.startsWith("/gratitude") ||
    req.nextUrl.pathname.startsWith("/habits") ||
    req.nextUrl.pathname.startsWith("/meditation") ||
    req.nextUrl.pathname.startsWith("/profile");

  const isAuthRoute =
    req.nextUrl.pathname === "/login" ||
    req.nextUrl.pathname === "/signup";

  // No token + trying to access a protected route → redirect to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Already has token + trying to access login/signup → redirect to dashboard
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  // Run middleware on these paths only
  matcher: [
    "/dashboard/:path*",
    "/mood/:path*",
    "/journal/:path*",
    "/gratitude/:path*",
    "/habits/:path*",
    "/meditation/:path*",
    "/profile/:path*",
    "/login",
    "/signup",
  ],
};