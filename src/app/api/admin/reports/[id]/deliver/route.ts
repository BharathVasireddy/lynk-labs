import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("🔐 Report delivery request received for ID:", params.id);
    console.log("🍪 Request headers:", Object.fromEntries(request.headers.entries()));
    
    const user = await verifyAuth(request);
    console.log("👤 Auth verification result:", user ? `User: ${user.name} (${user.role})` : "No user");
    
    if (!user) {
      console.log("❌ Authentication failed - no user found");
      return NextResponse.json({ error: "Unauthorized - Please log in again" }, { status: 401 });
    }

    // Check if user is admin
    if (user.role !== "ADMIN") {
      console.log(`❌ Access denied - user role: ${user.role}, required: ADMIN`);
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 });
    }
    
    console.log("✅ Admin access verified");

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
      console.log(`❌ Report not found with ID: ${params.id}`);
      return NextResponse.json(
        { error: `Report not found with ID: ${params.id}` },
        { status: 404 }
      );
    }
    
    console.log(`📄 Report found: ${report.fileName} for order ${report.order.orderNumber}`);

    if (report.isDelivered) {
      console.log(`⚠️ Report already delivered at: ${report.deliveredAt}`);
      return NextResponse.json(
        { error: "Report is already marked as delivered" },
        { status: 400 }
      );
    }

    console.log("🚀 Updating report as delivered...");

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

    console.log("📋 Updating order status to COMPLETED...");

    // Update order status
    await prisma.order.update({
      where: { id: report.orderId },
      data: { status: "COMPLETED" },
    });

    console.log("📝 Adding status history entry...");

    // Add to order status history
    await prisma.orderStatusHistory.create({
      data: {
        orderId: report.orderId,
        status: "COMPLETED",
        notes: "Report delivered to customer",
        createdBy: user.id,
      },
    });

    console.log("✅ Report delivery completed successfully");

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
    console.error("💥 Error marking report as delivered:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
} 