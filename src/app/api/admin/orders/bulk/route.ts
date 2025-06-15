import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAuth } from "@/lib/auth-utils";

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { action, orderIds, status, notes } = await request.json();

    if (!action || !orderIds || orderIds.length === 0) {
      return NextResponse.json(
        { error: "Action and order IDs are required" },
        { status: 400 }
      );
    }

    switch (action) {
      case "update_status":
        if (!status) {
          return NextResponse.json(
            { error: "Status is required for status update" },
            { status: 400 }
          );
        }

        // Update status for all selected orders
        await prisma.order.updateMany({
          where: {
            id: { in: orderIds },
          },
          data: {
            status: status,
            updatedAt: new Date(),
          },
        });

        // Add timeline entries for each order
        const statusUpdatePromises = orderIds.map((orderId: string) =>
          prisma.timeline.create({
            data: {
              orderId: orderId,
              action: "Status Updated",
              description: `Order status changed to ${status}${notes ? `. Note: ${notes}` : ""}`,
              timestamp: new Date(),
              actorId: user.id,
            },
          })
        );

        await Promise.all(statusUpdatePromises);
        break;

      case "add_notes":
        if (!notes) {
          return NextResponse.json(
            { error: "Notes content is required" },
            { status: 400 }
          );
        }

        // Add notes to all selected orders
        const notePromises = orderIds.map((orderId: string) =>
          prisma.orderNote.create({
            data: {
              orderId: orderId,
              content: notes,
              isInternal: true,
              authorId: user.id,
            },
          })
        );

        await Promise.all(notePromises);
        break;

      case "mark_priority":
        // Add priority flag to orders (you might need to add a priority field to your schema)
        await prisma.order.updateMany({
          where: {
            id: { in: orderIds },
          },
          data: {
            // priority: true, // Add this field to your schema if needed
            updatedAt: new Date(),
          },
        });

        // Add timeline entries
        const priorityPromises = orderIds.map((orderId: string) =>
          prisma.timeline.create({
            data: {
              orderId: orderId,
              action: "Marked Priority",
              description: "Order marked as priority",
              timestamp: new Date(),
              actorId: user.id,
            },
          })
        );

        await Promise.all(priorityPromises);
        break;

      case "export_selected":
        // Return the selected order data for export
        const ordersForExport = await prisma.order.findMany({
          where: {
            id: { in: orderIds },
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
            homeVisit: true,
            reports: true,
          },
        });

        return NextResponse.json({
          success: true,
          orders: ordersForExport,
          message: `Successfully exported ${ordersForExport.length} orders`,
        });

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully performed ${action} on ${orderIds.length} orders`,
    });

  } catch (error) {
    console.error("Error performing bulk action:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 