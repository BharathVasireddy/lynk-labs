import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { checkRegistrationRateLimit } from "@/lib/auth-rate-limit";
import { timingSafeUserExists } from "@/lib/timing-safe-auth";

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

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role 
      },
      process.env.NEXTAUTH_SECRET!,
      { expiresIn: "7d" }
    );

    // Create response with user data
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
      message: "Account created successfully",
    }, {
      headers: rateLimit.headers
    });

    // Set HTTP-only cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
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