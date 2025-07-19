import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAuth } from "@/lib/auth-utils";
import { timingSafeUserLookup } from "@/lib/timing-safe-auth";
import { createTokenPair } from "@/lib/refresh-token";
import { validateEmailForAPI } from "@/lib/email-validation";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Get current user from auth token
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { name, email } = await request.json();

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Comprehensive email validation
    const emailValidation = validateEmailForAPI(email, false);
    if (!emailValidation.valid) {
      return NextResponse.json(
        { error: emailValidation.error },
        { status: 400 }
      );
    }

    const normalizedEmail = emailValidation.email!;

    // Check if email is already taken by another user (timing-safe)
    const existingUser = await timingSafeUserLookup(normalizedEmail);

    if (existingUser && existingUser.id !== user.id) {
      return NextResponse.json(
        { error: "This email is already associated with another account" },
        { status: 409 }
      );
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name.trim(),
        email: normalizedEmail,
      },
    });

    // Generate new secure token pair with updated user info
    const tokenPair = await createTokenPair(updatedUser, request);

    // Create response with updated user data
    const userData = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      isActive: updatedUser.isActive,
    };

    const response = NextResponse.json({
      success: true,
      user: userData,
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
      expiresIn: tokenPair.expiresIn,
      tokenType: "Bearer",
      message: "Profile completed successfully",
    });

    // Set access token as HTTP-only cookie (24 hours)
    response.cookies.set("auth-token", tokenPair.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: tokenPair.expiresIn, // 24 hours
      path: "/",
    });

    // Set refresh token as HTTP-only cookie (30 days, restricted path)
    response.cookies.set("refresh-token", tokenPair.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: tokenPair.refreshExpiresIn, // 30 days
      path: "/api/auth/refresh", // Restrict to refresh endpoint only
    });

    return response;
  } catch (error) {
    console.error("Profile completion error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 