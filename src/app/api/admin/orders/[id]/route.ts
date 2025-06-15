import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAuth } from "@/lib/auth-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id: orderId } = params;

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Get comprehensive order details
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            dateOfBirth: true,
            gender: true,
          },
        },
        orderItems: {
          include: {
            test: {
              select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                preparationInstructions: true,
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
                description: true,
              },
            },
          },
        },
        homeVisit: {
          include: {
            agent: {
              select: {
                id: true,
                name: true,
                phone: true,
                email: true,
              },
            },
          },
        },
        reports: {
          select: {
            id: true,
            fileName: true,
            fileUrl: true,
            isDelivered: true,
            deliveredAt: true,
            uploadedAt: true,
          },
        },
        address: {
          select: {
            id: true,
            line1: true,
            line2: true,
            city: true,
            state: true,
            pincode: true,
            landmark: true,
            isDefault: true,
          },
        },
        // Notes (if you have a separate notes table)
        // notes: {
        //   include: {
        //     author: {
        //       select: {
        //         name: true,
        //         role: true,
        //       },
        //     },
        //   },
        //   orderBy: {
        //     createdAt: 'desc',
        //   },
        // },
        // Timeline (if you have a separate timeline table)
        // timeline: {
        //   include: {
        //     actor: {
        //       select: {
        //         name: true,
        //         role: true,
        //       },
        //     },
        //   },
        //   orderBy: {
        //     timestamp: 'desc',
        //   },
        // },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Add mock data for features that might not be in your current schema
    const enhancedOrder = {
      ...order,
      homeVisit: order.homeVisit ? {
        ...order.homeVisit,
        address: `${order.address.line1}${order.address.line2 ? ', ' + order.address.line2 : ''}, ${order.address.city}, ${order.address.state} ${order.address.pincode}`,
        scheduledDate: order.homeVisit.scheduledDate.toISOString(),
        completedAt: order.homeVisit.collectionTime?.toISOString() || null,
      } : null,
      reports: order.reports.map(report => ({
        ...report,
        filePath: report.fileUrl, // Map fileUrl to filePath for frontend compatibility
        uploadedAt: report.uploadedAt,
      })),
      // Mock notes data (replace with actual data when you implement notes table)
      notes: [
        {
          id: "note1",
          content: "Customer requested early morning collection",
          isInternal: false,
          createdAt: order.createdAt,
          author: {
            name: "Admin User",
            role: "ADMIN",
          },
        },
        {
          id: "note2",
          content: "Payment verified successfully",
          isInternal: true,
          createdAt: order.createdAt,
          author: {
            name: "System",
            role: "SYSTEM",
          },
        },
      ],
      // Mock timeline data (replace with actual data when you implement timeline table)
      timeline: [
        {
          id: "timeline1",
          action: "Order Created",
          description: "Order was successfully created",
          timestamp: order.createdAt,
          actor: {
            name: "Customer",
            role: "CUSTOMER",
          },
        },
        {
          id: "timeline2",
          action: "Payment Confirmed",
          description: `Payment of ₹${order.finalAmount} confirmed via ${order.paymentMethod}`,
          timestamp: order.createdAt,
          actor: {
            name: "Payment Gateway",
            role: "SYSTEM",
          },
        },
        {
          id: "timeline3",
          action: "Status Updated",
          description: `Order status updated to ${order.status}`,
          timestamp: order.updatedAt,
          actor: {
            name: "Admin User",
            role: "ADMIN",
          },
        },
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    };

    return NextResponse.json({
      success: true,
      order: enhancedOrder,
    });

  } catch (error) {
    console.error("Error fetching order details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id: orderId } = params;
    const updateData = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Update order
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            name: true,
            phone: true,
            email: true,
          },
        },
        orderItems: {
          include: {
            test: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      message: "Order updated successfully",
    });

  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 