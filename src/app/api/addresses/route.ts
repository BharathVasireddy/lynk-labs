import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { verifyAuth } from "@/lib/auth-utils";

const createAddressSchema = z.object({
  type: z.enum(["HOME", "WORK", "OTHER"]),
  line1: z.string().min(1, "Address line 1 is required"),
  line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "Invalid pincode format"),
  landmark: z.string().optional(),
  isDefault: z.boolean().optional().default(false),
});

// GET /api/addresses - Get user's addresses
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const addresses = await prisma.address.findMany({
      where: {
        userId: user.id,
      },
      orderBy: [
        { isDefault: "desc" },
        { createdAt: "desc" }
      ],
    });

    return NextResponse.json({
      success: true,
      addresses,
    });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/addresses - Create new address
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = createAddressSchema.parse(body);

    // If this is set as default, unset other default addresses
    if (validatedData.isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: user.id,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    // If this is the user's first address, make it default
    const existingAddressCount = await prisma.address.count({
      where: { userId: user.id },
    });

    const address = await prisma.address.create({
      data: {
        ...validatedData,
        userId: user.id,
        isDefault: validatedData.isDefault || existingAddressCount === 0,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Address created successfully",
      address,
    });
  } catch (error) {
    console.error("Error creating address:", error);
    
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