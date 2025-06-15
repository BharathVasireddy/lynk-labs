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
    const notificationSettings = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Check if order exists
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true, orderNumber: true },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // For now, we'll store notification preferences in status history
    // In a production app, you would have a separate notification preferences table
    
    const settingsDescription = Object.entries(notificationSettings)
      .map(([key, value]) => `${key}: ${value ? 'enabled' : 'disabled'}`)
      .join(', ');

    // Add status history entry
    await prisma.orderStatusHistory.create({
      data: {
        orderId: orderId,
        status: "NOTIFICATION_SETTINGS_UPDATED",
        notes: `Notification settings updated: ${settingsDescription}`,
        createdBy: user.id,
      },
    });

    // TODO: If you add notification preferences to your schema, update them here:
    // await prisma.orderNotificationPreferences.upsert({
    //   where: { orderId: orderId },
    //   update: notificationSettings,
    //   create: { orderId: orderId, ...notificationSettings },
    // });

    return NextResponse.json({
      success: true,
      message: "Notification settings updated successfully",
      settings: notificationSettings,
    });

  } catch (error) {
    console.error("Error updating notification settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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

    // Check if order exists
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // TODO: Get actual notification preferences from database
    // const preferences = await prisma.orderNotificationPreferences.findUnique({
    //   where: { orderId: orderId },
    // });

    // For now, return default settings
    const defaultSettings = {
      email: true,
      sms: true,
      autoDeliver: false,
    };

    return NextResponse.json({
      success: true,
      settings: defaultSettings,
    });

  } catch (error) {
    console.error("Error fetching notification settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 