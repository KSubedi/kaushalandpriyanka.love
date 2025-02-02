import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAuth } from "@/utils/auth";

// Mark this file as edge-compatible
export const runtime = "experimental-edge";

export async function middleware(request: NextRequest) {
  // Only protect /admin routes, except /admin/login
  if (
    !request.nextUrl.pathname.startsWith("/admin") ||
    request.nextUrl.pathname === "/admin/login"
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("admin_token");
  console.log("Token from cookie:", token?.value);

  // If no token, redirect to login
  if (!token) {
    console.log("No token found, redirecting to login");
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Verify token
  const isValid = await verifyAuth(token.value);
  console.log("Token validation result:", isValid);

  if (!isValid) {
    console.log("Invalid token, redirecting to login");
    // Clear invalid token and redirect to login
    const response = NextResponse.redirect(
      new URL("/admin/login", request.url)
    );
    response.cookies.delete("admin_token");
    return response;
  }

  return NextResponse.next();
}

// Configure the paths that should be handled by this middleware
export const config = {
  matcher: ["/admin/:path*"],
};
