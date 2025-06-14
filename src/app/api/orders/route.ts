import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { verifyAuth } from "@/lib/auth-utils";

const createOrderSchema = z.object({
  items: z.array(z.object({
    testId: z.string(),
    quantity: z.number().min(1),
    price: z.number().min(0),
  })),
  addressId: z.string(),
  scheduledDate: z.string(),
  scheduledTime: z.string(),
  couponCode: z.string().nullable().optional(),
  paymentMethod: z.enum(["razorpay", "cod"]),
  totalAmount: z.number().min(0).optional(),
});

// Generate unique order number
function generateOrderNumber(): string {
  const prefix = "LL";
  const year = new Date().getFullYear();
  const timestamp = Date.now().toString().slice(-6);
  return `${prefix}${year}${timestamp}`;
}

// GET /api/orders - Get user's orders
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");

    const skip = (page - 1) * limit;

    const where = {
      userId: user.id,
      ...(status && { status }),
    };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          address: true,
          orderItems: {
            include: {
              test: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  category: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
          homeVisit: true,
          reports: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
  try {
    console.log("📋 Order creation started");
    
    const user = await verifyAuth(request);
    if (!user) {
      console.log("❌ User not authenticated");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log(`👤 User authenticated: ${user.name} (${user.phone})`);

    const body = await request.json();
    console.log("📦 Request body:", JSON.stringify(body, null, 2));
    
    const validatedData = createOrderSchema.parse(body);
    console.log("✅ Data validation passed");

    // Verify address belongs to user
    const address = await prisma.address.findFirst({
      where: {
        id: validatedData.addressId,
        userId: user.id,
      },
    });

    if (!address) {
      console.log(`❌ Address not found: ${validatedData.addressId} for user ${user.id}`);
      return NextResponse.json(
        { error: "Invalid address" },
        { status: 400 }
      );
    }

    console.log(`📍 Address verified: ${address.line1}, ${address.city}`);

    // Verify all tests exist and calculate total
    const testIds = validatedData.items.map(item => item.testId);
    console.log(`🧪 Checking tests: ${testIds.join(', ')}`);
    
    const tests = await prisma.test.findMany({
      where: {
        id: { in: testIds },
        isActive: true,
      },
    });

    if (tests.length !== testIds.length) {
      console.log(`❌ Test mismatch: Found ${tests.length}, expected ${testIds.length}`);
      return NextResponse.json(
        { error: "Some tests are not available" },
        { status: 400 }
      );
    }

    console.log(`✅ All tests verified: ${tests.map(t => t.name).join(', ')}`);

    // Calculate totals
    let totalAmount = 0;
    let discountAmount = 0;

    for (const item of validatedData.items) {
      const test = tests.find(t => t.id === item.testId);
      if (!test) continue;

      const itemTotal = item.price * item.quantity;
      totalAmount += itemTotal;

      // Calculate discount if test has discountPrice
      if (test.discountPrice && test.discountPrice < test.price) {
        const originalTotal = test.price * item.quantity;
        discountAmount += originalTotal - itemTotal;
      }
    }

    const finalAmount = totalAmount - discountAmount;
    console.log(`💰 Totals calculated: Total=${totalAmount}, Discount=${discountAmount}, Final=${finalAmount}`);

    // Create order with transaction
    console.log("🔄 Starting database transaction...");
    const result = await prisma.$transaction(async (tx) => {
      // Create order
      const order = await tx.order.create({
        data: {
          userId: user.id,
          orderNumber: generateOrderNumber(),
          status: "PENDING",
          totalAmount,
          discountAmount,
          finalAmount,
          addressId: validatedData.addressId,
          paymentMethod: validatedData.paymentMethod,
          couponCode: validatedData.couponCode,
        },
      });

      console.log(`📋 Order created: ${order.orderNumber}`);

      // Create order items
      const orderItems = await Promise.all(
        validatedData.items.map(item =>
          tx.orderItem.create({
            data: {
              orderId: order.id,
              testId: item.testId,
              quantity: item.quantity,
              price: item.price,
            },
          })
        )
      );

      console.log(`📦 Order items created: ${orderItems.length} items`);

      // Create home visit
      const homeVisit = await tx.homeVisit.create({
        data: {
          orderId: order.id,
          scheduledDate: new Date(validatedData.scheduledDate),
          scheduledTime: validatedData.scheduledTime,
          status: "SCHEDULED",
        },
      });

      console.log(`🏠 Home visit scheduled: ${validatedData.scheduledDate} at ${validatedData.scheduledTime}`);

      return { order, orderItems, homeVisit };
    });

    // If payment method is Razorpay, create Razorpay order
    let razorpayOrderId = null;
    if (validatedData.paymentMethod === "razorpay") {
      // TODO: Integrate with Razorpay API
      // For now, we'll simulate the order ID
      razorpayOrderId = `order_${Date.now()}`;
      console.log(`💳 Razorpay order ID generated: ${razorpayOrderId}`);
    }

    console.log("✅ Order creation completed successfully");

    return NextResponse.json({
      success: true,
      message: "Order created successfully",
      order: result.order,
      razorpayOrderId,
    });
  } catch (error) {
    console.error("❌ Error creating order:", error);
    
    if (error instanceof z.ZodError) {
      console.log("📝 Validation errors:", error.errors);
      return NextResponse.json(
        { error: "Invalid input data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
} 