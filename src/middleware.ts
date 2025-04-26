import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the token from cookies
  const token = request.cookies.get("authToken")?.value;

  // Define protected paths
  const protectedPaths = ["/dashboard", "/api/protected", "/settings"];

  // Define authentication paths
  const authPaths = ["/auth/signin", "/auth/signup", "/auth/reset-password"];

  // Check if the path is protected
  const isProtectedPath = protectedPaths.some((pp) =>
    request.nextUrl.pathname.startsWith(pp),
  );

  // Check if the path is an auth path
  const isAuthPath = authPaths.some((ap) =>
    request.nextUrl.pathname.startsWith(ap),
  );

  // If the path is protected and there's no token, redirect to the login page
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  // If the user is authenticated and tries to access auth paths, redirect to dashboard
  if (isAuthPath && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
