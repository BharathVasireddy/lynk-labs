import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { refreshAccessToken, revokeRefreshToken } from "@/lib/refresh-token";
import { checkAuthCheckRateLimit } from "@/lib/auth-rate-limit";

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

/**
 * POST /api/auth/refresh - Refresh access token using refresh token
 * Implements secure token rotation and device tracking
 */
export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting for refresh attempts
    const clientIP = request.ip || request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'anonymous';
    const rateLimit = await checkAuthCheckRateLimit(clientIP);
    
    if (!rateLimit.success) {
      return NextResponse.json(
        { 
          error: "Too many refresh attempts. Please try again later.",
          retryAfter: Math.ceil((rateLimit.reset - Date.now()) / 1000)
        },
        { 
          status: 429, 
          headers: rateLimit.headers 
        }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const { refreshToken } = refreshTokenSchema.parse(body);

    // Attempt to refresh the access token
    const tokenPair = await refreshAccessToken(refreshToken, request);

    if (!tokenPair) {
      return NextResponse.json(
        { 
          error: "Invalid or expired refresh token",
          code: "INVALID_REFRESH_TOKEN"
        },
        { 
          status: 401,
          headers: rateLimit.headers
        }
      );
    }

    // Create response with new tokens
    const response = NextResponse.json({
      success: true,
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
      expiresIn: tokenPair.expiresIn,
      refreshExpiresIn: tokenPair.refreshExpiresIn,
      tokenType: "Bearer",
      message: "Token refreshed successfully"
    }, {
      headers: rateLimit.headers
    });

    // Set new access token as HTTP-only cookie
    response.cookies.set("auth-token", tokenPair.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: tokenPair.expiresIn, // 24 hours
      path: "/",
    });

    // Set new refresh token as HTTP-only cookie (more secure than localStorage)
    response.cookies.set("refresh-token", tokenPair.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: tokenPair.refreshExpiresIn, // 30 days
      path: "/api/auth/refresh", // Restrict to refresh endpoint only
    });

    return response;

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: "Invalid request data",
          details: error.errors
        },
        { status: 400 }
      );
    }

    console.error("Token refresh error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/auth/refresh - Revoke refresh token (logout from specific device)
 */
export async function DELETE(request: NextRequest) {
  try {
    // Parse refresh token from request body or cookie
    let refreshToken: string | null = null;

    try {
      const body = await request.json();
      refreshToken = body.refreshToken;
    } catch {
      // If no body, try to get from cookie
      refreshToken = request.cookies.get("refresh-token")?.value || null;
    }

    if (!refreshToken) {
      return NextResponse.json(
        { error: "Refresh token not provided" },
        { status: 400 }
      );
    }

    // Revoke the refresh token
    const revoked = await revokeRefreshToken(refreshToken);

    if (!revoked) {
      return NextResponse.json(
        { error: "Failed to revoke token" },
        { status: 400 }
      );
    }

    // Create response and clear cookies
    const response = NextResponse.json({
      success: true,
      message: "Refresh token revoked successfully"
    });

    // Clear refresh token cookie
    response.cookies.set("refresh-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0, // Expire immediately
      path: "/api/auth/refresh",
    });

    return response;

  } catch (error) {
    console.error("Token revocation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 