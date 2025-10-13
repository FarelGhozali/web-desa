export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    // Protect admin routes (jika ada)
    "/admin/:path*",
    // Protect user profile routes (jika ada)
    "/profile/:path*",
    // Add more protected routes as needed
  ],
};
