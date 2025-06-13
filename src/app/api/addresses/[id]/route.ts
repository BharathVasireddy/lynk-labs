import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { verifyAuth } from "@/lib/auth-utils";

const updateAddressSchema = z.object({
  type: z.enum(["HOME", "WORK", "OTHER"]),
  line1: z.string().min(1, "Address line 1 is required"),
  line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  landmark: z.string().optional(),
  isDefault: z.boolean().optional(),
});

// PUT /api/addresses/[id] - Update address
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

    const body = await request.json();
    const validatedData = updateAddressSchema.parse(body);

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

    // If setting as default, unset other default addresses
    if (validatedData.isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: user.id,
          id: { not: params.id },
        },
        data: { isDefault: false },
      });
    }

    // Update the address
    const updatedAddress = await prisma.address.update({
      where: { id: params.id },
      data: {
        type: validatedData.type,
        line1: validatedData.line1.trim(),
        line2: validatedData.line2?.trim() || null,
        city: validatedData.city.trim(),
        state: validatedData.state.trim(),
        pincode: validatedData.pincode,
        landmark: validatedData.landmark?.trim() || null,
        isDefault: validatedData.isDefault || false,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Address updated successfully",
      address: updatedAddress,
    });
  } catch (error) {
    console.error("Address update error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/addresses/[id] - Delete address
export async function DELETE(
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

    // Check if this is the only address
    const addressCount = await prisma.address.count({
      where: { userId: user.id },
    });

    if (addressCount === 1) {
      return NextResponse.json(
        { error: "Cannot delete the only address. Please add another address first." },
        { status: 400 }
      );
    }

    // If deleting default address, set another address as default
    if (existingAddress.isDefault) {
      const nextAddress = await prisma.address.findFirst({
        where: {
          userId: user.id,
          id: { not: params.id },
        },
        orderBy: { createdAt: 'asc' },
      });

      if (nextAddress) {
        await prisma.address.update({
          where: { id: nextAddress.id },
          data: { isDefault: true },
        });
      }
    }

    // Delete the address
    await prisma.address.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error("Address deletion error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/addresses/[id] - Get specific address
export async function GET(
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

    const address = await prisma.address.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!address) {
      return NextResponse.json(
        { error: "Address not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      address,
    });
  } catch (error) {
    console.error("Error fetching address:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 