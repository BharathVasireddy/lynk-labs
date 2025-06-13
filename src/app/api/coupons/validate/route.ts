import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";

const validateCouponSchema = z.object({
  code: z.string().min(1, "Coupon code is required"),
  orderAmount: z.number().min(0, "Order amount must be positive"),
});

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
    const { code, orderAmount } = validateCouponSchema.parse(body);

    // Find the coupon
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      return NextResponse.json(
        { error: "Invalid coupon code" },
        { status: 400 }
      );
    }

    // Check if coupon is active
    if (!coupon.isActive) {
      return NextResponse.json(
        { error: "Coupon is no longer active" },
        { status: 400 }
      );
    }

    // Check expiry date
    if (coupon.validTo && new Date() > coupon.validTo) {
      return NextResponse.json(
        { error: "Coupon has expired" },
        { status: 400 }
      );
    }

    // Check start date
    if (coupon.validFrom && new Date() < coupon.validFrom) {
      return NextResponse.json(
        { error: "Coupon is not yet active" },
        { status: 400 }
      );
    }

    // Check minimum order amount
    if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) {
      return NextResponse.json(
        { error: `Minimum order amount of ₹${coupon.minOrderAmount} required` },
        { status: 400 }
      );
    }

    // Check usage limits
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json(
        { error: "Coupon usage limit exceeded" },
        { status: 400 }
      );
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discountType === "PERCENTAGE") {
      discount = (orderAmount * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else if (coupon.discountType === "FIXED") {
      discount = coupon.discountValue;
      if (discount > orderAmount) {
        discount = orderAmount;
      }
    }

    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        type: coupon.discountType,
        value: coupon.discountValue,
        description: coupon.description,
      },
      discount: Math.round(discount * 100) / 100, // Round to 2 decimal places
      finalAmount: Math.round((orderAmount - discount) * 100) / 100,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error validating coupon:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 