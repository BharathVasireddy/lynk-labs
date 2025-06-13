import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAuth } from "@/lib/auth-utils";

// PUT /api/addresses/[id]/default - Set address as default
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if address exists and belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!existingAddress) {
      return NextResponse.json(
        { error: "Address not found" },
        { status: 404 }
      );
    }

    // Use transaction to ensure consistency
    await prisma.$transaction([
      // Unset all other addresses as default
      prisma.address.updateMany({
        where: {
          userId: user.id,
          id: { not: params.id },
        },
        data: { isDefault: false },
      }),
      // Set this address as default
      prisma.address.update({
        where: { id: params.id },
        data: { isDefault: true },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Default address updated successfully",
    });
  } catch (error) {
    console.error("Error setting default address:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 