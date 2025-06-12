import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { sign } from "jsonwebtoken";
import { otpStore } from "@/lib/otp-store";

const verifyOTPSchema = z.object({
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber, otp } = verifyOTPSchema.parse(body);

    // Check if OTP exists and is valid
    const storedOTP = otpStore.get(phoneNumber);
    
    if (!storedOTP) {
      return NextResponse.json(
        { error: "OTP not found or expired" },
        { status: 400 }
      );
    }

    if (storedOTP.otp !== otp) {
      return NextResponse.json(
        { error: "Invalid OTP" },
        { status: 400 }
      );
    }

    // OTP is valid, remove it from store
    otpStore.delete(phoneNumber);

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { phone: phoneNumber }
    });

    let isNewUser = false;
    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          phone: phoneNumber,
          name: `User ${phoneNumber.slice(-4)}`, // Temporary name
          role: "CUSTOMER",
        }
      });
      isNewUser = true;
    }

    // Check if user needs to complete profile (new WhatsApp users without email)
    const requiresProfile = isNewUser || !user.email;

    // Generate JWT token for session
    const token = sign(
      { 
        userId: user.id, 
        phone: user.phone, 
        role: user.role 
      },
      process.env.NEXTAUTH_SECRET!,
      { expiresIn: "7d" }
    );

    // Create response with secure cookie
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      requiresProfile,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      }
    });

    // Set secure HTTP-only cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input format" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}

// Logout endpoint
export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully"
  });

  // Clear the auth cookie
  response.cookies.delete("auth-token");

  return response;
} 