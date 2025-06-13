import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verify } from "jsonwebtoken";

// Routes that require authentication
const protectedRoutes = [
  "/profile",
  "/orders",
  "/reports",
  "/admin",
];

// Routes that require admin access
const adminRoutes = [
  "/admin",
];

// Routes that should redirect authenticated users away
const authRoutes = [
  "/auth/login",
  "/login",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value;

  // Check if user is authenticated
  let user = null;
  if (token) {
    try {
      const decoded = verify(token, process.env.NEXTAUTH_SECRET!) as { 
        userId: string; 
        role: string; 
        email: string; 
        phone: string; 
      };
      user = decoded;
    } catch (error) {
      // Invalid token, treat as unauthenticated
      console.error("Invalid token in middleware:", error);
    }
  }

  // Redirect authenticated users away from auth pages
  if (authRoutes.some(route => pathname.startsWith(route))) {
    if (user) {
      // Role-based redirect
      if (user.role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      } else {
        return NextResponse.redirect(new URL("/profile", request.url));
      }
    }
    // Allow access to auth pages for unauthenticated users
    return NextResponse.next();
  }

  // Check admin routes
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    if (!user) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("returnUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Check other protected routes
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!user) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("returnUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, uploads, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images|uploads).*)",
  ],
}; 