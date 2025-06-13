import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import crypto from "crypto";

const verifyPaymentSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  razorpayPaymentId: z.string().min(1, "Razorpay payment ID is required"),
  razorpayOrderId: z.string().min(1, "Razorpay order ID is required"),
  razorpaySignature: z.string().min(1, "Razorpay signature is required"),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = verifyPaymentSchema.parse(body);

    // Get the order
    const order = await prisma.order.findUnique({
      where: { id: validatedData.orderId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Check if the order belongs to the authenticated user
    if (order.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized access to order" },
        { status: 403 }
      );
    }

    // Verify Razorpay signature
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!razorpayKeySecret) {
      console.error("Razorpay key secret not configured");
      return NextResponse.json(
        { error: "Payment configuration error" },
        { status: 500 }
      );
    }

    const body_string = validatedData.razorpayOrderId + "|" + validatedData.razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", razorpayKeySecret)
      .update(body_string)
      .digest("hex");

    const isSignatureValid = expectedSignature === validatedData.razorpaySignature;

    if (!isSignatureValid) {
      // Log failed verification attempt
      console.error("Payment signature verification failed", {
        orderId: validatedData.orderId,
        razorpayPaymentId: validatedData.razorpayPaymentId,
        expectedSignature,
        receivedSignature: validatedData.razorpaySignature,
      });

      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 400 }
      );
    }

    // Update order with payment information
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Update order status and payment info
      const updated = await tx.order.update({
        where: { id: validatedData.orderId },
        data: {
          status: "CONFIRMED",
          paymentId: validatedData.razorpayPaymentId,
          paymentMethod: "razorpay",
          updatedAt: new Date(),
        },
        include: {
          user: {
            select: {
              name: true,
              phone: true,
            },
          },
          orderItems: {
            include: {
              test: {
                select: {
                  name: true,
                },
              },
            },
          },
          homeVisit: {
            select: {
              scheduledDate: true,
              scheduledTime: true,
            },
          },
        },
      });

      // Add to order status history
      await tx.orderStatusHistory.create({
        data: {
          orderId: validatedData.orderId,
          status: "CONFIRMED",
          notes: "Payment verified successfully",
          createdBy: session.user.id,
        },
      });

      return updated;
    });

    // TODO: Send confirmation notifications
    // - Send SMS/WhatsApp to customer
    // - Send email confirmation
    // - Notify admin about new confirmed order
    // - Schedule home visit reminder

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      order: {
        id: updatedOrder.id,
        orderNumber: updatedOrder.orderNumber,
        status: updatedOrder.status,
        finalAmount: updatedOrder.finalAmount,
        paymentId: updatedOrder.paymentId,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 