import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkLoginRateLimit } from "@/lib/auth-rate-limit";
import { 
  checkLockoutStatus, 
  recordFailedAttempt, 
  clearLoginAttempts,
  LOCKOUT_POLICIES 
} from "@/lib/account-security";
import { timingSafeAuthenticate } from "@/lib/timing-safe-auth";
import { createTokenPair } from "@/lib/refresh-token";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting for login attempts
    const clientIP = request.ip || request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'anonymous';
    const rateLimit = await checkLoginRateLimit(clientIP);
    
    if (!rateLimit.success) {
      return NextResponse.json(
        { 
          error: "Too many login attempts. Please try again later.",
          retryAfter: Math.ceil((rateLimit.reset - Date.now()) / 1000)
        },
        { 
          status: 429, 
          headers: rateLimit.headers 
        }
      );
    }

    const { email, phone, password } = await request.json();

    // Support both email and phone login
    const loginIdentifier = email || phone;

    if (!loginIdentifier || !password) {
      return NextResponse.json(
        { error: "Email/Phone and password are required" },
        { status: 400 }
      );
    }

    // Check account lockout status
    const lockoutStatus = await checkLockoutStatus(loginIdentifier, clientIP);
    if (lockoutStatus.isLocked) {
      const minutesRemaining = lockoutStatus.lockoutExpiresAt 
        ? Math.ceil((lockoutStatus.lockoutExpiresAt.getTime() - Date.now()) / (1000 * 60))
        : 15;
      
      return NextResponse.json(
        { 
          error: `Account temporarily locked due to multiple failed login attempts. Please try again in ${minutesRemaining} minutes.`,
          lockoutExpiresAt: lockoutStatus.lockoutExpiresAt,
          retryAfter: Math.ceil((lockoutStatus.lockoutExpiresAt?.getTime() || Date.now()) / 1000)
        },
        { status: 423 } // 423 Locked
      );
    }

    // Timing-safe authentication to prevent timing attacks
    const authResult = await timingSafeAuthenticate(loginIdentifier, password);

    if (!authResult.success || !authResult.user) {
      // Record failed attempt (this applies whether user exists or not)
      const attemptResult = await recordFailedAttempt(
        loginIdentifier, 
        clientIP, 
        LOCKOUT_POLICIES.USER_LOGIN
      );
      
      const errorResponse = {
        error: "Invalid credentials",
        ...(attemptResult.attemptsRemaining <= 2 && {
          attemptsRemaining: attemptResult.attemptsRemaining,
          warning: `${attemptResult.attemptsRemaining} attempts remaining before account lockout`
        })
      };
      
      return NextResponse.json(errorResponse, { status: 401 });
    }

    const user = authResult.user;

    // For users without passwords (WhatsApp login), we need separate handling
    // Note: timingSafeAuthenticate already handles this, but we add explicit check for clarity
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Clear failed login attempts on successful authentication
    await clearLoginAttempts(loginIdentifier, clientIP);

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
      message: "Login successful",
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
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 