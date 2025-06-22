import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const addToCartSchema = z.object({
  testId: z.string().optional(),
  packageId: z.string().optional(),
  quantity: z.number().min(1).default(1),
}).refine(data => data.testId || data.packageId, {
  message: "Either testId or packageId must be provided"
});

const updateCartSchema = z.object({
  itemId: z.string(),
  quantity: z.number().min(1),
});

const removeFromCartSchema = z.object({
  itemId: z.string(),
});

export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'anonymous';
    const rateLimit = await checkRateLimit(clientIP);
    
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: rateLimit.headers }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: {
        test: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            discountPrice: true,
            reportTime: true,
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
            price: true,
            originalPrice: true,
            testCount: true,
            reportTime: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      items: cartItems,
    }, {
      headers: rateLimit.headers
    });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'anonymous';
    const rateLimit = await checkRateLimit(clientIP);
    
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: rateLimit.headers }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = addToCartSchema.parse(body);

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        userId: session.user.id,
        ...(validatedData.testId && { testId: validatedData.testId }),
        ...(validatedData.packageId && { packageId: validatedData.packageId }),
      },
    });

    if (existingItem) {
      // Update quantity if item already exists
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + validatedData.quantity,
          updatedAt: new Date(),
        },
        include: {
          test: {
            select: {
              id: true,
              name: true,
              slug: true,
              price: true,
              discountPrice: true,
              reportTime: true,
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
              price: true,
              originalPrice: true,
              testCount: true,
              reportTime: true,
            },
          },
        },
      });

      return NextResponse.json({
        success: true,
        message: "Item quantity updated in cart",
        item: updatedItem,
      }, {
        headers: rateLimit.headers
      });
    } else {
      // Create new cart item
      const cartItem = await prisma.cartItem.create({
        data: {
          userId: session.user.id,
          testId: validatedData.testId,
          packageId: validatedData.packageId,
          quantity: validatedData.quantity,
        },
        include: {
          test: {
            select: {
              id: true,
              name: true,
              slug: true,
              price: true,
              discountPrice: true,
              reportTime: true,
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
              price: true,
              originalPrice: true,
              testCount: true,
              reportTime: true,
            },
          },
        },
      });

      return NextResponse.json({
        success: true,
        message: "Item added to cart",
        item: cartItem,
      }, {
        headers: rateLimit.headers
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Apply rate limiting
    const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'anonymous';
    const rateLimit = await checkRateLimit(clientIP);
    
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: rateLimit.headers }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateCartSchema.parse(body);

    // Verify the cart item belongs to the user
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        id: validatedData.itemId,
        userId: session.user.id,
      },
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: validatedData.itemId },
      data: {
        quantity: validatedData.quantity,
        updatedAt: new Date(),
      },
      include: {
        test: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            discountPrice: true,
            reportTime: true,
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
            price: true,
            originalPrice: true,
            testCount: true,
            reportTime: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Cart item updated",
      item: updatedItem,
    }, {
      headers: rateLimit.headers
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating cart item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Apply rate limiting
    const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'anonymous';
    const rateLimit = await checkRateLimit(clientIP);
    
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: rateLimit.headers }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = removeFromCartSchema.parse(body);

    // Verify the cart item belongs to the user
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        id: validatedData.itemId,
        userId: session.user.id,
      },
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }

    await prisma.cartItem.delete({
      where: { id: validatedData.itemId },
    });

    return NextResponse.json({
      success: true,
      message: "Item removed from cart",
    }, {
      headers: rateLimit.headers
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error removing cart item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}