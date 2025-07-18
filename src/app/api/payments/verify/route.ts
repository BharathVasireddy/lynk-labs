import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { safeOperation } from "@/lib/data-protection";
import { z } from "zod";
import crypto from "crypto";

const verifyPaymentSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  razorpay_payment_id: z.string().min(1, "Razorpay payment ID is required"),
  razorpay_order_id: z.string().min(1, "Razorpay order ID is required"),
  razorpay_signature: z.string().min(1, "Razorpay signature is required"),
});

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = verifyPaymentSchema.parse(body);

    // Get the order first
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

    // Verify Razorpay signature
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!razorpayKeySecret) {
      console.error("Razorpay key secret not configured");
      return NextResponse.json(
        { error: "Payment configuration error" },
        { status: 500 }
      );
    }

    const body_string = validatedData.razorpay_order_id + "|" + validatedData.razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", razorpayKeySecret)
      .update(body_string)
      .digest("hex");

    const isSignatureValid = expectedSignature === validatedData.razorpay_signature;

    if (!isSignatureValid) {
      // Log failed verification attempt
      console.error("Payment signature verification failed", {
        orderId: validatedData.orderId,
        razorpayPaymentId: validatedData.razorpay_payment_id,
        expectedSignature,
        receivedSignature: validatedData.razorpay_signature,
      });

      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 400 }
      );
    }

    // Update order with payment information using safe operation
    const updatedOrder = await safeOperation(
      `payment_verify:${validatedData.orderId}`,
      async () => {
        return await prisma.$transaction(async (tx) => {
          // Update order status and payment info
          const updated = await tx.order.update({
            where: { id: validatedData.orderId },
            data: {
              status: "CONFIRMED",
              paymentId: validatedData.razorpay_payment_id,
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
              notes: `Payment verified successfully. Payment ID: ${validatedData.razorpay_payment_id}`,
              createdBy: session.user.id,
            },
          });

          return updated;
        });
      }
    );

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

    console.error("Error verifying payment:", {
      error: error.message,
      stack: error.stack,
      orderId: request.body?.orderId || 'unknown',
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 