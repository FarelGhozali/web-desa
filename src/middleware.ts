import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get the token from the request
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Debug logging (hapus di production)
  console.log('=== Middleware Debug ===');
  console.log('Path:', pathname);
  console.log('Token exists:', !!token);
  console.log('User role:', token?.role);
  console.log('=====================');

  // Check if accessing admin routes
  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register");

  // If accessing admin route
  if (isAdminRoute) {
    // No token = redirect to login
    if (!token) {
      console.log('❌ No token, redirecting to /login');
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Has token but not ADMIN = redirect to home
    if (token.role !== "ADMIN") {
      console.log('❌ Not admin role, redirecting to /');
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Has token and is ADMIN = allow access
    console.log('✅ Admin access granted');
    return NextResponse.next();
  }

  // If accessing profile routes (contoh route lain yang butuh auth)
  if (pathname.startsWith("/profile")) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // If logged in and trying to access auth pages, redirect to home
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/profile/:path*",
    "/login",
    "/register",
  ],
};
