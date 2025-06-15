import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    console.log("Admin Agents GET - Session:", session?.user);
    
    if (!session?.user) {
      console.log("Admin Agents GET - No session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true, isActive: true },
    });
    
    console.log("Admin Agents GET - User found:", user);

    if (!user || user.role !== "ADMIN") {
      console.log("Admin Agents GET - User is not admin");
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    if (!user.isActive) {
      console.log("Admin Agents GET - User is not active");
      return NextResponse.json({ error: "Account disabled" }, { status: 403 });
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

    console.log("Admin Agents GET - Found agents:", agents.length);
    console.log("Admin Agents GET - Agents:", agents);

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
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!user || user.role !== "ADMIN") {
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

    // Create new agent with a default password
    const defaultPassword = await bcrypt.hash('agent123', 10); // Default password

    const newAgent = await prisma.user.create({
      data: {
        name,
        phone,
        email,
        password: defaultPassword,
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
      message: "Agent created successfully",
      agent: newAgent,
      loginInfo: {
        phone: phone,
        defaultPassword: "agent123"
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