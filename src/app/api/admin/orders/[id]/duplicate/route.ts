import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAuth } from "@/lib/auth-utils";

export async function POST(
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

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Get original order with all details
    const originalOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: {
            test: true,
            package: true,
          },
        },
        address: true,
      },
    });

    if (!originalOrder) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Generate new order number
    const currentYear = new Date().getFullYear();
    const timestamp = Date.now();
    const newOrderNumber = `LL${currentYear}${timestamp}`;

    // Create duplicate order
    const duplicatedOrder = await prisma.order.create({
      data: {
        userId: originalOrder.userId,
        orderNumber: newOrderNumber,
        status: "PENDING",
        totalAmount: originalOrder.totalAmount,
        discountAmount: 0, // Reset discount for new order
        finalAmount: originalOrder.totalAmount, // No discount applied
        addressId: originalOrder.addressId,
        paymentMethod: null, // Reset payment method
        paymentId: null, // Reset payment ID
        couponCode: null, // Reset coupon
        orderItems: {
          create: originalOrder.orderItems.map(item => ({
            testId: item.testId,
            packageId: item.packageId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        orderItems: {
          include: {
            test: true,
            package: true,
          },
        },
        user: {
          select: {
            name: true,
            phone: true,
            email: true,
          },
        },
      },
    });

    // Add status history for the new order
    await prisma.orderStatusHistory.create({
      data: {
        orderId: duplicatedOrder.id,
        status: "PENDING",
        notes: `Order duplicated from ${originalOrder.orderNumber} by admin`,
        createdBy: user.id,
      },
    });

    // Add status history for the original order
    await prisma.orderStatusHistory.create({
      data: {
        orderId: originalOrder.id,
        status: "DUPLICATED",
        notes: `Order duplicated to ${newOrderNumber}`,
        createdBy: user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Order duplicated successfully",
      newOrderId: duplicatedOrder.id,
      newOrderNumber: newOrderNumber,
      originalOrderNumber: originalOrder.orderNumber,
    });

  } catch (error) {
    console.error("Error duplicating order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}