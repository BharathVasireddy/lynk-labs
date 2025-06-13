import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const updateStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "CONFIRMED", 
    "SAMPLE_COLLECTION_SCHEDULED",
    "SAMPLE_COLLECTED",
    "REPORT_READY",
    "COMPLETED",
    "CANCELLED"
  ]),
  notes: z.string().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true, isActive: true }
    });

    if (!user?.isActive || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = updateStatusSchema.parse(body);

    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        user: true,
        orderItems: {
          include: {
            test: true
          }
        }
      }
    });

    if (!existingOrder) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: {
        status: validatedData.status,
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true
          }
        },
        orderItems: {
          include: {
            test: {
              select: {
                name: true,
                slug: true
              }
            }
          }
        },
        homeVisit: {
          include: {
            agent: {
              select: {
                name: true,
                phone: true
              }
            }
          }
        },
        reports: true
      }
    });

    // Create status history entry if notes provided
    if (validatedData.notes) {
      await prisma.orderStatusHistory.create({
        data: {
          orderId: params.id,
          status: validatedData.status,
          notes: validatedData.notes,
          updatedBy: session.user.id,
        }
      });
    }

    // Send notification to customer about status change
    const { sendOrderNotification } = await import("@/lib/notifications");
    
    // Map status to notification event
    const statusEventMap: Record<string, string> = {
      "CONFIRMED": "ORDER_CONFIRMED",
      "SAMPLE_COLLECTION_SCHEDULED": "SAMPLE_COLLECTION_SCHEDULED", 
      "SAMPLE_COLLECTED": "SAMPLE_COLLECTED",
      "REPORT_READY": "REPORT_READY",
      "COMPLETED": "ORDER_COMPLETED",
      "CANCELLED": "ORDER_CANCELLED"
    };
    
    const notificationEvent = statusEventMap[validatedData.status];
    if (notificationEvent) {
      await sendOrderNotification(params.id, notificationEvent as any);
    }

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      message: `Order status updated to ${validatedData.status.replace(/_/g, " ")}`
    });

  } catch (error) {
    console.error("Error updating order status:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 