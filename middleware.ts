import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verify } from "jsonwebtoken";
import { apiAuthMiddleware } from "@/lib/api-middleware";

// Routes that require authentication
const protectedRoutes = [
  "/profile",
  "/orders",
  "/reports",
  "/admin",
  "/agent",
];

// Routes that require admin access
const adminRoutes = [
  "/admin",
];

// Routes that require agent access
const agentRoutes = [
  "/agent",
];

// Routes that should redirect authenticated users away
const authRoutes = [
  "/auth/login",
  "/login",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Handle API routes with comprehensive authentication
  const apiResponse = await apiAuthMiddleware(request);
  if (apiResponse) {
    return apiResponse;
  }
  
  // Continue with existing page-level authentication for non-API routes
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
      } else if (user.role === "HOME_VISIT_AGENT") {
        return NextResponse.redirect(new URL("/agent/dashboard", request.url));
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

  // Check agent routes
  if (agentRoutes.some(route => pathname.startsWith(route))) {
    if (!user) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("returnUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (user.role !== "HOME_VISIT_AGENT") {
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
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, uploads, etc.)
     * 
     * SECURITY: Now includes API routes for authentication enforcement
     */
    "/((?!_next/static|_next/image|favicon.ico|images|uploads).*)",
  ],
}; 