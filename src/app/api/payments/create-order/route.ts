import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createRazorpayOrder, isRazorpayConfigured } from "@/lib/razorpay";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { verifyAuth } from "@/lib/auth-utils";

const createPaymentOrderSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
});

export async function POST(request: NextRequest) {
  try {
    // Check if Razorpay is configured
    if (!isRazorpayConfigured()) {
      return NextResponse.json(
        { error: "Payment gateway not configured" },
        { status: 503 }
      );
    }

    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { orderId } = createPaymentOrderSchema.parse(body);

    // Get the order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        orderNumber: true,
        finalAmount: true,
        userId: true,
        status: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Check if the order belongs to the authenticated user
    if (order.userId !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized access to order" },
        { status: 403 }
      );
    }

    // Check if order is in correct status
    if (order.status !== "PENDING") {
      return NextResponse.json(
        { error: "Order is not in pending status" },
        { status: 400 }
      );
    }

    // Create Razorpay order
    const razorpayResult = await createRazorpayOrder({
      amount: Math.round(order.finalAmount * 100), // Convert to paise
      receipt: order.orderNumber,
      notes: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        userId: user.id,
      },
    });

    if (!razorpayResult.success) {
      console.error("Razorpay order creation failed:", razorpayResult.error);
      return NextResponse.json(
        { error: "Failed to create payment order" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      razorpayOrder: razorpayResult.order,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        amount: order.finalAmount,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating payment order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 