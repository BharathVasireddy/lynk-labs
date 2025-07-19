import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { checkRegistrationRateLimit } from "@/lib/auth-rate-limit";
import { timingSafeUserExists } from "@/lib/timing-safe-auth";
import { createTokenPair } from "@/lib/refresh-token";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting for registration attempts
    const clientIP = request.ip || request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'anonymous';
    const rateLimit = await checkRegistrationRateLimit(clientIP);
    
    if (!rateLimit.success) {
      return NextResponse.json(
        { 
          error: "Too many registration attempts. Please try again later.",
          retryAfter: Math.ceil((rateLimit.reset - Date.now()) / 1000)
        },
        { 
          status: 429, 
          headers: rateLimit.headers 
        }
      );
    }

    const { email, phone, password, name } = await request.json();

    if (!email || !phone || !password || !name) {
      return NextResponse.json(
        { error: "Email, phone, password, and name are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Use timing-safe user existence checks to prevent enumeration
    const [emailExists, phoneExists] = await Promise.all([
      timingSafeUserExists(email.toLowerCase()),
      timingSafeUserExists(phone.trim())
    ]);

    if (emailExists) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    if (phoneExists) {
      return NextResponse.json(
        { error: "An account with this phone number already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase(),
        phone: phone.trim(),
        password: hashedPassword,
        role: "CUSTOMER",
        isActive: true,
      },
    });

    // Generate secure token pair (24h access token + 30d refresh token)
    const tokenPair = await createTokenPair(user, request);

    // Create response with user data and token information
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
    };

    const response = NextResponse.json({
      success: true,
      user: userData,
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
      expiresIn: tokenPair.expiresIn,
      tokenType: "Bearer",
      message: "Account created successfully",
    }, {
      headers: rateLimit.headers
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
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 