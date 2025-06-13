import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { verifyAuth } from "@/lib/auth-utils";

const userActionSchema = z.object({
  action: z.enum(["activate", "deactivate", "make_admin", "remove_admin"]),
});

// PATCH /api/admin/users/[id] - Perform user actions
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action } = userActionSchema.parse(body);

    // Check if target user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Prevent admin from modifying themselves
    if (targetUser.id === user.id) {
      return NextResponse.json(
        { error: "Cannot perform actions on your own account" },
        { status: 400 }
      );
    }

    const updateData: { isActive?: boolean; role?: string } = {};
    let message = "";

    switch (action) {
      case "activate":
        updateData.isActive = true;
        message = "User activated successfully";
        break;
      case "deactivate":
        updateData.isActive = false;
        message = "User deactivated successfully";
        break;
      case "make_admin":
        updateData.role = "ADMIN";
        message = "User promoted to admin successfully";
        break;
      case "remove_admin":
        updateData.role = "USER";
        message = "Admin privileges removed successfully";
        break;
    }

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Admin user action error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid action", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/admin/users/[id] - Get user details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        dateOfBirth: true,
        gender: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            orders: true,
            addresses: true,
          },
        },
        orders: {
          take: 5,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            orderNumber: true,
            status: true,
            finalAmount: true,
            createdAt: true,
          },
        },
      },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: targetUser,
    });
  } catch (error) {
    console.error("Admin user details error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 