import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { z } from "zod";

const fastCreateOrderSchema = z.object({
  items: z.array(z.object({
    testId: z.string().optional(),
    packageId: z.string().optional(),
    quantity: z.number().min(1).default(1),
    price: z.number().min(0),
  })).min(1),
  addressId: z.string().min(1),
  scheduledDate: z.string().min(1),
  scheduledTime: z.string().min(1),
  paymentMethod: z.enum(["razorpay", "cod"]).default("razorpay"),
  totalAmount: z.number().min(0),
  finalAmount: z.number().min(0),
});

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log("Received order data:", body);

    // Validate input
    const validatedData = fastCreateOrderSchema.parse(body);
    console.log("Validated data:", validatedData);

    // Verify items exist and prices match
    const itemVerifications = await Promise.all(
      validatedData.items.map(async (item) => {
        if (item.testId) {
          const test = await prisma.test.findFirst({
            where: { id: item.testId, isActive: true },
            select: { id: true, price: true, discountPrice: true }
          });
          if (!test) throw new Error(`Test ${item.testId} not found`);
          
          const expectedPrice = test.discountPrice || test.price;
          if (Math.abs(item.price - expectedPrice) > 0.01) {
            throw new Error(`Price mismatch for test ${item.testId}`);
          }
          return { ...item, verified: true };
        }
        
        if (item.packageId) {
          const pkg = await prisma.package.findFirst({
            where: { id: item.packageId, isActive: true },
            select: { id: true, price: true }
          });
          if (!pkg) throw new Error(`Package ${item.packageId} not found`);
          
          if (Math.abs(item.price - pkg.price) > 0.01) {
            throw new Error(`Price mismatch for package ${item.packageId}`);
          }
          return { ...item, verified: true };
        }
        
        throw new Error("Item must have either testId or packageId");
      })
    );

    // Verify address belongs to user
    const address = await prisma.address.findFirst({
      where: { id: validatedData.addressId, userId: user.id }
    });
    if (!address) {
      return NextResponse.json(
        { error: "Address not found or doesn't belong to user" },
        { status: 400 }
      );
    }

    // Generate order number
    const orderNumber = `LL${new Date().getFullYear()}${Date.now().toString().slice(-6)}`;

    // Create order in transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: user.id,
          orderNumber,
          status: "PENDING",
          totalAmount: validatedData.totalAmount,
          discountAmount: 0,
          finalAmount: validatedData.finalAmount,
          addressId: validatedData.addressId,
          paymentMethod: validatedData.paymentMethod,
          createdAt: new Date(),
        },
      });

      // Create order items
      await tx.orderItem.createMany({
        data: validatedData.items.map(item => ({
          orderId: newOrder.id,
          testId: item.testId || null,
          packageId: item.packageId || null,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      // Create home visit
      await tx.homeVisit.create({
        data: {
          orderId: newOrder.id,
          scheduledDate: new Date(validatedData.scheduledDate),
          scheduledTime: validatedData.scheduledTime,
          status: "SCHEDULED",
        },
      });

      // Add to order status history
      await tx.orderStatusHistory.create({
        data: {
          orderId: newOrder.id,
          status: "PENDING",
          notes: "Order created successfully",
          createdBy: user.id,
        },
      });

      return newOrder;
    });

    console.log("Order created successfully:", order.id);

    return NextResponse.json({
      success: true,
      message: "Order created successfully",
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        finalAmount: order.finalAmount,
      },
    });

  } catch (error) {
    console.error("Fast order creation error:", error);
    
    if (error instanceof z.ZodError) {
      console.log("Validation errors:", error.errors);
      return NextResponse.json(
        { 
          error: "Validation failed", 
          details: error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}