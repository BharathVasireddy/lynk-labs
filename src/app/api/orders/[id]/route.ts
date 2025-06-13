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
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
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

    // Check if the order belongs to the authenticated user
    if (order.userId !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized access to order" },
        { status: 403 }
      );
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