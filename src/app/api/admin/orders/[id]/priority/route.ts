import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAuth } from "@/lib/auth-utils";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id: orderId } = params;
    const { isPriority } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Check if order exists
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true, orderNumber: true },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // For now, we'll store priority status in a note or status history
    // In a production app, you would add a priority field to the order schema
    
    // Add status history entry
    await prisma.orderStatusHistory.create({
      data: {
        orderId: orderId,
        status: "PRIORITY_UPDATED",
        notes: isPriority ? "Order marked as priority" : "Priority removed from order",
        createdBy: user.id,
      },
    });

    // TODO: If you add a priority field to the Order model, update it here:
    // await prisma.order.update({
    //   where: { id: orderId },
    //   data: { isPriority: isPriority },
    // });

    return NextResponse.json({
      success: true,
      message: isPriority ? "Order marked as priority" : "Priority removed from order",
      isPriority: isPriority,
    });

  } catch (error) {
    console.error("Error updating priority:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 