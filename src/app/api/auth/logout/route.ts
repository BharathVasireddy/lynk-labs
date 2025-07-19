import { NextRequest, NextResponse } from "next/server";
import { blacklistToken } from "@/lib/jwt-blacklist";
import { revokeRefreshToken, revokeAllUserRefreshTokens } from "@/lib/refresh-token";
import { verifyAuth } from "@/lib/auth-utils";

export async function POST(request: NextRequest) {
  try {
    // Parse request body to check for logout type
    let logoutAll = false;
    try {
      const body = await request.json();
      logoutAll = body.logoutAll === true;
    } catch {
      // If no body or invalid JSON, default to single device logout
    }

    // Get the current token and user info before invalidating
    const token = request.cookies.get("auth-token")?.value;
    const refreshToken = request.cookies.get("refresh-token")?.value;
    const user = await verifyAuth(request);

    // If we have a valid token and user, blacklist the access token
    if (token && user) {
      await blacklistToken(token, user.id);
    }

    // Revoke refresh tokens based on logout type
    if (user) {
      if (logoutAll) {
        // Logout from all devices
        await revokeAllUserRefreshTokens(user.id);
      } else {
        // Logout from current device only
        if (refreshToken) {
          await revokeRefreshToken(refreshToken);
        }
      }
    }

    // Create response
    const response = NextResponse.json({
      success: true,
      message: logoutAll ? "Logged out from all devices" : "Logout successful",
    });

    // Clear the auth-token cookie
    response.cookies.set("auth-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0, // Expire immediately
      path: "/",
    });

    // Clear the refresh-token cookie
    response.cookies.set("refresh-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0, // Expire immediately
      path: "/api/auth/refresh",
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 