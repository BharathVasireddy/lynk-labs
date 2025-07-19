import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { generateAgentPassword } from "@/lib/password-utils";
import { validateEmailForAPI } from "@/lib/email-validation";

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get all home visit agents
    const agents = await prisma.user.findMany({
      where: {
        role: "HOME_VISIT_AGENT",
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      agents,
    });
  } catch (error) {
    console.error("Error fetching agents:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { name, phone, email } = body;

    // Validate required fields
    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone are required" },
        { status: 400 }
      );
    }

    // Check if phone already exists
    const existingUser = await prisma.user.findUnique({
      where: { phone },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this phone number already exists" },
        { status: 400 }
      );
    }

    // Generate a secure random password for the new agent
    const temporaryPassword = generateAgentPassword();
    const hashedPassword = await bcrypt.hash(temporaryPassword, 12);

    const newAgent = await prisma.user.create({
      data: {
        name,
        phone,
        email,
        password: hashedPassword,
        role: "HOME_VISIT_AGENT",
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Agent created successfully with secure temporary password",
      agent: newAgent,
      loginInfo: {
        phone: phone,
        temporaryPassword: temporaryPassword,
        note: "This is a temporary password. Agent should change it after first login."
      }
    });
  } catch (error) {
    console.error("Error creating agent:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 