import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if report exists
    const report = await prisma.report.findUnique({
      where: { id: params.id },
      include: {
        order: {
          include: {
            user: {
              select: {
                name: true,
                phone: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!report) {
      return NextResponse.json(
        { error: "Report not found" },
        { status: 404 }
      );
    }

    if (report.isDelivered) {
      return NextResponse.json(
        { error: "Report is already marked as delivered" },
        { status: 400 }
      );
    }

    // Update report as delivered
    const updatedReport = await prisma.report.update({
      where: { id: params.id },
      data: {
        isDelivered: true,
        deliveredAt: new Date(),
      },
      include: {
        order: {
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
                  },
                },
              },
            },
          },
        },
        uploader: {
          select: {
            name: true,
          },
        },
      },
    });

    // Update order status
    await prisma.order.update({
      where: { id: report.orderId },
      data: { status: "COMPLETED" },
    });

    // Add to order status history
    await prisma.orderStatusHistory.create({
      data: {
        orderId: report.orderId,
        status: "COMPLETED",
        notes: "Report delivered to customer",
        createdBy: session.user.id,
      },
    });

    // TODO: Send notification to customer about report delivery
    // This could include:
    // - Email with report attachment
    // - WhatsApp message with download link
    // - SMS notification
    
    // Example notification logic (to be implemented):
    /*
    await sendNotification({
      userId: report.order.userId,
      type: "REPORT_DELIVERED",
      channels: ["email", "whatsapp", "sms"],
      data: {
        orderNumber: report.order.orderNumber,
        reportUrl: report.fileUrl,
        customerName: report.order.user.name,
      },
    });
    */

    return NextResponse.json({
      success: true,
      message: "Report marked as delivered successfully",
      report: updatedReport,
    });
  } catch (error) {
    console.error("Error marking report as delivered:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 