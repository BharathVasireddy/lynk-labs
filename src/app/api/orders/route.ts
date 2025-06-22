import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { verifyAuth } from "@/lib/auth-utils";
import { createOrderSafely, verifyOrderIntegrity } from '@/lib/data-protection';
import { checkRateLimit } from "@/lib/rate-limit";

const createOrderSchema = z.object({
  items: z.array(z.object({
    testId: z.string().optional(),
    packageId: z.string().optional(),
    quantity: z.number().min(1).default(1),
    price: z.number().min(0),
  })).min(1, "At least one item is required").refine(
    items => items.every(item => item.testId || item.packageId),
    "Each item must have either testId or packageId"
  ),
  addressId: z.string().min(1, "Address is required"),
  scheduledDate: z.string().min(1, "Scheduled date is required"),
  scheduledTime: z.string().min(1, "Scheduled time is required"),
  couponCode: z.string().optional().nullable(),
  paymentMethod: z.enum(["razorpay", "cod"]).default("razorpay"),
  totalAmount: z.number().min(0),
  discountAmount: z.number().min(0).default(0),
  finalAmount: z.number().min(0),
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
              package: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
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

// POST /api/orders - Create new order with enhanced protection
export async function POST(request: Request) {
  try {
    // Verify authentication
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = createOrderSchema.parse(body);

    // Validate that each item has either testId or packageId
    for (const item of validatedData.items) {
      if (!item.testId && !item.packageId) {
        return NextResponse.json(
          { error: "Each item must have either testId or packageId" },
          { status: 400 }
        );
      }
    }

    // Verify address belongs to user
    const address = await prisma.address.findFirst({
      where: {
        id: validatedData.addressId,
        userId: user.id
      }
    });

    if (!address) {
      return NextResponse.json(
        { error: "Invalid address" },
        { status: 400 }
      );
    }

    // Verify all tests/packages exist and are active
    const testIds = validatedData.items.filter(item => item.testId).map(item => item.testId);
    const packageIds = validatedData.items.filter(item => item.packageId).map(item => item.packageId);

    if (testIds.length > 0) {
      const tests = await prisma.test.findMany({
        where: {
          id: { in: testIds },
          isActive: true
        }
      });

      if (tests.length !== testIds.length) {
        return NextResponse.json(
          { error: "Some tests are not available" },
          { status: 400 }
        );
      }
    }

    if (packageIds.length > 0) {
      const packages = await prisma.package.findMany({
        where: {
          id: { in: packageIds },
          isActive: true
        }
      });

      if (packages.length !== packageIds.length) {
        return NextResponse.json(
          { error: "Some packages are not available" },
          { status: 400 }
        );
      }
    }

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Prepare order data for safe creation
    const orderData = {
      userId: user.id,
      orderNumber,
      status: 'PENDING',
      totalAmount: validatedData.totalAmount,
      discountAmount: validatedData.discountAmount || 0,
      finalAmount: validatedData.finalAmount,
      addressId: validatedData.addressId,
      paymentMethod: validatedData.paymentMethod,
      couponCode: validatedData.couponCode,
      items: validatedData.items,
      homeVisit: {
        scheduledDate: new Date(validatedData.scheduledDate),
        scheduledTime: validatedData.scheduledTime,
      }
    };

    // Create order with comprehensive protection
    const order = await createOrderSafely(orderData);

    // Double-verify order integrity
    const isValid = await verifyOrderIntegrity(order.id);
    if (!isValid) {
      throw new Error('Order integrity verification failed after creation');
    }

    // Fetch complete order data for response
    const completeOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        orderItems: {
          include: {
            test: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
            package: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        homeVisit: true,
        address: true,
        statusHistory: true,
      },
    });

    return NextResponse.json({
      success: true,
      order: completeOrder,
      message: "Order created successfully with full data protection"
    });

  } catch (error) {
    // Enhanced error logging
    console.error('Order creation failed:', {
      error: error.message,
      stack: error.stack,
      userId: request.headers.get('user-id') || 'unknown',
      timestamp: new Date().toISOString()
    });

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: "Validation failed", 
          details: error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
        },
        { status: 400 }
      );
    }

    // Handle specific error types
    if (error.message.includes('Operation in progress')) {
      return NextResponse.json(
        { error: "Another order is being processed. Please wait and try again." },
        { status: 409 }
      );
    }

    if (error.message.includes('integrity')) {
      return NextResponse.json(
        { error: "Order validation failed. Please try again." },
        { status: 422 }
      );
    }

    // Generic error response
    return NextResponse.json(
      { error: "Unable to create order. Please try again." },
      { status: 500 }
    );
  }
} 