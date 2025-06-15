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

        // Add status history entries for each order
        const statusUpdatePromises = orderIds.map((orderId: string) =>
          prisma.orderStatusHistory.create({
            data: {
              orderId: orderId,
              status: status,
              notes: notes ? `Bulk status update: ${notes}` : `Bulk status update to ${status}`,
              createdBy: user.id,
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

        // Add notes via status history (since there's no separate notes table)
        const notePromises = orderIds.map((orderId: string) =>
          prisma.orderStatusHistory.create({
            data: {
              orderId: orderId,
              status: "NOTE_ADDED",
              notes: notes,
              createdBy: user.id,
            },
          })
        );

        await Promise.all(notePromises);
        break;

      case "mark_priority":
        // Add priority status history entries
        const priorityPromises = orderIds.map((orderId: string) =>
          prisma.orderStatusHistory.create({
            data: {
              orderId: orderId,
              status: "PRIORITY_MARKED",
              notes: "Order marked as priority via bulk action",
              createdBy: user.id,
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

      case "delete_orders":
        // Get orders to check their status before deletion
        const ordersToDelete = await prisma.order.findMany({
          where: {
            id: { in: orderIds },
          },
          include: {
            orderItems: true,
            homeVisit: true,
            reports: true,
          },
        });

        // Check for protected statuses
        const protectedStatuses = ["PROCESSING", "SAMPLE_COLLECTED"];
        const protectedOrders = ordersToDelete.filter(order => 
          protectedStatuses.includes(order.status)
        );

        if (protectedOrders.length > 0) {
          return NextResponse.json(
            { 
              error: "Cannot delete some orders", 
              message: `${protectedOrders.length} orders cannot be deleted due to their status. Please cancel them first.`,
              protectedOrderIds: protectedOrders.map(o => o.id)
            },
            { status: 400 }
          );
        }

        // Use transaction to delete all orders and their related data
        await prisma.$transaction(async (tx) => {
          // Delete order status history for all orders (must be first due to foreign key)
          await tx.orderStatusHistory.deleteMany({
            where: { orderId: { in: orderIds } },
          });

          // Delete reports for all orders
          await tx.report.deleteMany({
            where: { orderId: { in: orderIds } },
          });

          // Delete home visits for all orders
          await tx.homeVisit.deleteMany({
            where: { orderId: { in: orderIds } },
          });

          // Delete order items for all orders
          await tx.orderItem.deleteMany({
            where: { orderId: { in: orderIds } },
          });

          // Delete the orders
          await tx.order.deleteMany({
            where: { id: { in: orderIds } },
          });
        });

        return NextResponse.json({
          success: true,
          message: `Successfully deleted ${orderIds.length} orders`,
          deletedCount: orderIds.length,
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