import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const session = await auth();

  const pathname = request.nextUrl.pathname;

  // Protected routes
  const protectedRoutes = ["/dashboard"];

  // Check if the current route is protected
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected && !session) {
    // Redirect to sign in if user is not authenticated
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  // If user is authenticated and trying to access sign in page, redirect to dashboard
  if (pathname === "/auth/signin" && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
