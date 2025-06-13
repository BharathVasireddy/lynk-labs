import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAuth } from "@/lib/auth-utils";

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/orders/[id] - Get specific order details
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { searchParams } = new URL(request.url);
    const isSuccessView = searchParams.get("success") === "true";
    
    // For success view (just after order creation), allow access without auth
    // For regular order viewing, require authentication
    let user = null;
    if (!isSuccessView) {
      user = await verifyAuth(request);
      if (!user) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
    }

    const { id } = params;

    const order = await prisma.order.findUnique({
      where: { id },
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
        statusHistory: {
          orderBy: {
            createdAt: "desc",
          },
          take: 10,
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // For authenticated requests, check if the order belongs to the user
    if (user && order.userId !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized access to order" },
        { status: 403 }
      );
    }

    // For success view, only allow access to very recent orders (within last 10 minutes)
    if (isSuccessView && !user) {
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
      if (order.createdAt < tenMinutesAgo) {
        return NextResponse.json(
          { error: "Order access expired. Please log in to view order details." },
          { status: 401 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 