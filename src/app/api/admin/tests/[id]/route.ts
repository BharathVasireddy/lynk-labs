import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { verifyAuth } from "@/lib/auth-utils";

const testActionSchema = z.object({
  action: z.enum(["activate", "deactivate"]),
});

// PATCH /api/admin/tests/[id] - Perform test actions
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
    const { action } = testActionSchema.parse(body);

    // Check if test exists
    const test = await prisma.test.findUnique({
      where: { id: params.id },
    });

    if (!test) {
      return NextResponse.json(
        { error: "Test not found" },
        { status: 404 }
      );
    }

    const updateData: { isActive?: boolean } = {};
    let message = "";

    switch (action) {
      case "activate":
        updateData.isActive = true;
        message = "Test activated successfully";
        break;
      case "deactivate":
        updateData.isActive = false;
        message = "Test deactivated successfully";
        break;
    }

    // Update the test
    const updatedTest = await prisma.test.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        slug: true,
        isActive: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message,
      test: updatedTest,
    });
  } catch (error) {
    console.error("Admin test action error:", error);
    
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

// DELETE /api/admin/tests/[id] - Delete test
export async function DELETE(
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

    // Check if test exists
    const test = await prisma.test.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            orderItems: true,
          },
        },
      },
    });

    if (!test) {
      return NextResponse.json(
        { error: "Test not found" },
        { status: 404 }
      );
    }

    // Check if test has orders
    if (test._count.orderItems > 0) {
      return NextResponse.json(
        { error: "Cannot delete test with existing orders. Deactivate instead." },
        { status: 400 }
      );
    }

    // Delete the test
    await prisma.test.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: "Test deleted successfully",
    });
  } catch (error) {
    console.error("Admin test delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/admin/tests/[id] - Get test details
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

    const test = await prisma.test.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        price: true,
        discountPrice: true,
        preparationInstructions: true,
        reportTime: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        _count: {
          select: {
            orderItems: true,
          },
        },
        orderItems: {
          take: 5,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            quantity: true,
            price: true,
            createdAt: true,
            order: {
              select: {
                id: true,
                orderNumber: true,
                status: true,
                user: {
                  select: {
                    name: true,
                    phone: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!test) {
      return NextResponse.json(
        { error: "Test not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      test,
    });
  } catch (error) {
    console.error("Admin test details error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 