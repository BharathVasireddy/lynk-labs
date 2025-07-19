import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { isTokenBlacklisted } from "@/lib/jwt-blacklist";

/**
 * Comprehensive API Middleware for Authentication and Authorization
 * Prevents authentication bypass vulnerabilities across all API routes
 */

export interface AuthenticatedUser {
  userId: string;
  email: string | null;
  phone: string | null;
  role: string;
}

/**
 * Public API routes that don't require authentication
 */
const PUBLIC_API_ROUTES = [
  // Authentication endpoints
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/logout',
  '/api/auth/refresh',
  '/api/auth/[...nextauth]',
  
  // Public data endpoints (read-only)
  '/api/status',
  '/api/health',
  '/api/categories',
  '/api/tests/',
  '/api/tests',
  '/api/packages',
  '/api/fast/categories',
  '/api/fast/tests',
  '/api/ultra-fast/tests',
  
  // Public payment endpoints (have their own security)
  '/api/payments/create-order',
  
  // Webhooks (should have other security measures)
  '/api/webhooks/'
];

/**
 * Admin-only API routes
 */
const ADMIN_ONLY_ROUTES = [
  '/api/admin/',
  '/api/cron/'
];

/**
 * Agent-only API routes
 */
const AGENT_ONLY_ROUTES = [
  '/api/agent/'
];

/**
 * Routes that require user ownership verification
 */
const USER_OWNED_ROUTES = [
  '/api/orders',
  '/api/addresses',
  '/api/cart'
];

/**
 * Extract and verify JWT token with blacklist checking
 */
async function extractAndVerifyToken(request: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    const token = request.cookies.get("auth-token")?.value;
    
    if (!token) {
      return null;
    }

    // Check if token is blacklisted
    const isBlacklisted = await isTokenBlacklisted(token);
    if (isBlacklisted) {
      return null;
    }

    // Verify and decode token
    const decoded = verify(token, process.env.NEXTAUTH_SECRET!) as { 
      userId: string; 
      email?: string;
      phone?: string;
      role: string; 
    };
    
    if (!decoded.userId || !decoded.role) {
      return null;
    }

    return {
      userId: decoded.userId,
      email: decoded.email || null,
      phone: decoded.phone || null,
      role: decoded.role
    };
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

/**
 * Check if route is public (doesn't require authentication)
 */
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_API_ROUTES.some(route => {
    if (route.endsWith('/')) {
      return pathname.startsWith(route);
    }
    return pathname === route || pathname.startsWith(route + '/');
  });
}

/**
 * Check if route requires admin access
 */
function requiresAdminAccess(pathname: string): boolean {
  return ADMIN_ONLY_ROUTES.some(route => pathname.startsWith(route));
}

/**
 * Check if route requires agent access
 */
function requiresAgentAccess(pathname: string): boolean {
  return AGENT_ONLY_ROUTES.some(route => pathname.startsWith(route));
}

/**
 * Check if route requires user ownership verification
 */
function requiresOwnershipCheck(pathname: string): boolean {
  return USER_OWNED_ROUTES.some(route => pathname.startsWith(route));
}

/**
 * Create unauthorized response
 */
function createUnauthorizedResponse(message: string = "Authentication required"): NextResponse {
  return NextResponse.json(
    { error: message },
    { status: 401 }
  );
}

/**
 * Create forbidden response
 */
function createForbiddenResponse(message: string = "Insufficient permissions"): NextResponse {
  return NextResponse.json(
    { error: message },
    { status: 403 }
  );
}

/**
 * Main API authentication middleware
 */
export async function apiAuthMiddleware(request: NextRequest): Promise<NextResponse | null> {
  const { pathname } = request.nextUrl;

  // Skip non-API routes
  if (!pathname.startsWith('/api/')) {
    return null;
  }

  // Allow public routes
  if (isPublicRoute(pathname)) {
    return null;
  }

  // Extract and verify authentication
  const user = await extractAndVerifyToken(request);
  
  if (!user) {
    return createUnauthorizedResponse("Authentication required");
  }

  // Check admin-only routes
  if (requiresAdminAccess(pathname)) {
    if (user.role !== "ADMIN") {
      return createForbiddenResponse("Admin access required");
    }
  }

  // Check agent-only routes
  if (requiresAgentAccess(pathname)) {
    if (user.role !== "HOME_VISIT_AGENT") {
      return createForbiddenResponse("Agent access required");
    }
  }

  // For routes that require ownership verification, add user context to headers
  // The individual route handlers will need to verify ownership
  if (requiresOwnershipCheck(pathname)) {
    const response = NextResponse.next();
    response.headers.set('x-user-id', user.userId);
    response.headers.set('x-user-role', user.role);
    return response;
  }

  // Add user context to all authenticated requests
  const response = NextResponse.next();
  response.headers.set('x-user-id', user.userId);
  response.headers.set('x-user-role', user.role);
  return response;
}

/**
 * Utility function to extract user from middleware headers
 * For use in API route handlers
 */
export function getUserFromHeaders(request: NextRequest): AuthenticatedUser | null {
  const userId = request.headers.get('x-user-id');
  const userRole = request.headers.get('x-user-role');
  
  if (!userId || !userRole) {
    return null;
  }

  return {
    userId,
    email: null, // Not passed in headers for security
    phone: null, // Not passed in headers for security
    role: userRole
  };
}

/**
 * Enhanced auth verification that works with both middleware and direct token verification
 */
export async function enhancedVerifyAuth(request: NextRequest): Promise<AuthenticatedUser | null> {
  // First try to get user from middleware headers
  const userFromHeaders = getUserFromHeaders(request);
  if (userFromHeaders) {
    return userFromHeaders;
  }

  // Fallback to direct token verification
  return await extractAndVerifyToken(request);
}

/**
 * Require authentication with role checking
 */
export async function requireAuthWithRole(
  request: NextRequest, 
  allowedRoles: string[]
): Promise<AuthenticatedUser | NextResponse> {
  const user = await enhancedVerifyAuth(request);
  
  if (!user) {
    return createUnauthorizedResponse();
  }
  
  if (!allowedRoles.includes(user.role)) {
    return createForbiddenResponse();
  }
  
  return user;
}

/**
 * Security audit logging
 */
export function logSecurityEvent(
  event: string, 
  details: Record<string, any>, 
  request: NextRequest
) {
  const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  console.log(`🔒 Security Event: ${event}`, {
    ...details,
    clientIP,
    userAgent,
    timestamp: new Date().toISOString(),
    path: request.nextUrl.pathname
  });
} 