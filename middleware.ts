import { type NextRequest, NextResponse } from "next/server";

/**
 * Middleware for JWT token verification
 * This middleware runs on protected routes to ensure user authentication
 */
export default async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = [
    "/auth/login",
    "/auth/sign-up",
    "/auth/forgot-password",
    "/auth/update-password",
    "/auth/sign-up-success",
    "/auth/error",
    "/",
  ];

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // If it's a protected route and no token exists, redirect to login
  if (!isPublicRoute && !token) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // If user has a token and trying to access auth pages, verify token first
  if (isPublicRoute && token && pathname.startsWith("/auth/")) {
    try {
      // Verify token by checking with backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      // If token is valid, redirect to dashboard
      if (response.ok) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }
      
      // If token is invalid, clear it and allow access to auth pages
      const url = request.nextUrl.clone();
      const res = NextResponse.redirect(url);
      res.cookies.delete('auth_token');
      return res;
    } catch (error) {
      console.error('Token verification failed:', error);
      // On error, clear cookie and allow access to auth pages
      const res = NextResponse.next();
      res.cookies.delete('auth_token');
      return res;
    }
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
     * - api routes (handled separately)
     */
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
