import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAuth } from "@/lib/auth-utils";

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
    const { status, note } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = [
      "PENDING",
      "CONFIRMED", 
      "SAMPLE_COLLECTION_SCHEDULED",
      "SAMPLE_COLLECTED",
      "PROCESSING",
      "REPORT_READY",
      "COMPLETED",
      "CANCELLED"
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    // Get current order to check previous status
    const currentOrder = await prisma.order.findUnique({
      where: { id: orderId },
      select: { status: true, orderNumber: true },
    });

    if (!currentOrder) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: status,
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

    // Add timeline entry (if you have timeline table)
    // await prisma.timeline.create({
    //   data: {
    //     orderId: orderId,
    //     action: "Status Updated",
    //     description: `Order status changed from ${currentOrder.status} to ${status}${note ? `. Note: ${note}` : ""}`,
    //     timestamp: new Date(),
    //     actorId: user.id,
    //   },
    // });

    // Add note if provided (if you have notes table)
    // if (note && note.trim()) {
    //   await prisma.orderNote.create({
    //     data: {
    //       orderId: orderId,
    //       content: note,
    //       isInternal: true,
    //       authorId: user.id,
    //     },
    //   });
    // }

    // Handle status-specific actions
    switch (status) {
      case "CONFIRMED":
        // Auto-create home visit if not exists
        const existingHomeVisit = await prisma.homeVisit.findFirst({
          where: { orderId: orderId },
        });

        if (!existingHomeVisit) {
          await prisma.homeVisit.create({
            data: {
              orderId: orderId,
              status: "SCHEDULED",
              scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
              scheduledTime: "09:00",
            },
          });
        }
        break;

      case "SAMPLE_COLLECTION_SCHEDULED":
        // Update home visit status
        await prisma.homeVisit.updateMany({
          where: { orderId: orderId },
          data: { status: "SCHEDULED" },
        });
        break;

      case "SAMPLE_COLLECTED":
        // Update home visit status
        await prisma.homeVisit.updateMany({
          where: { orderId: orderId },
          data: { 
            status: "COMPLETED",
            collectionTime: new Date(),
          },
        });
        break;

      case "COMPLETED":
        // Mark all reports as delivered if not already
        await prisma.report.updateMany({
          where: { 
            orderId: orderId,
            isDelivered: false,
          },
          data: { 
            isDelivered: true,
            deliveredAt: new Date(),
          },
        });
        break;
    }

    // Send notifications based on status (implement as needed)
    // await sendStatusUpdateNotification(updatedOrder, status, note);

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      message: `Order status updated to ${status}`,
      previousStatus: currentOrder.status,
    });

  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper function to send status update notifications
// async function sendStatusUpdateNotification(order: any, status: string, note?: string) {
//   // Implement SMS/Email notifications based on status
//   const notifications = {
//     CONFIRMED: "Your order has been confirmed and sample collection will be scheduled.",
//     SAMPLE_COLLECTION_SCHEDULED: "Your sample collection has been scheduled.",
//     SAMPLE_COLLECTED: "Your samples have been collected and sent for processing.",
//     REPORT_READY: "Your test reports are ready for download.",
//     COMPLETED: "Your order has been completed. Thank you for choosing Lynk Labs.",
//   };

//   const message = notifications[status];
//   if (message && order.user.phone) {
//     // Send SMS notification
//     // await sendSMS(order.user.phone, message);
//   }

//   if (message && order.user.email) {
//     // Send email notification
//     // await sendEmail(order.user.email, `Order ${order.orderNumber} Update`, message);
//   }
// } 