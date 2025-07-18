import { NextRequest, NextResponse } from "next/server";
import { blacklistToken } from "@/lib/jwt-blacklist";
import { verifyAuth } from "@/lib/auth-utils";

export async function POST(request: NextRequest) {
  try {
    // Get the current token and user info before invalidating
    const token = request.cookies.get("auth-token")?.value;
    const user = await verifyAuth(request);

    // If we have a valid token and user, blacklist the token
    if (token && user) {
      await blacklistToken(token, user.id);
    }

    // Create response
    const response = NextResponse.json({
      success: true,
      message: "Logout successful",
    });

    // Clear the auth-token cookie by setting it with past expiration
    response.cookies.set("auth-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0, // Expire immediately
      path: "/",
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