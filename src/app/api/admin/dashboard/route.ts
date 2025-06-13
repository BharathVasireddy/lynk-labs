import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAuth } from "@/lib/auth-utils";

// GET /api/admin/dashboard - Get dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    // Get current date ranges
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Fetch all statistics in parallel
    const [
      totalUsers,
      totalTests,
      totalOrders,
      pendingHomeVisits,
      todayOrders,
      monthlyOrders,
      recentOrders,
      recentUsers,
    ] = await Promise.all([
      // Total users count
      prisma.user.count({
        where: { isActive: true },
      }),

      // Total tests count
      prisma.test.count({
        where: { isActive: true },
      }),

      // Total orders count
      prisma.order.count(),

      // Pending home visits count
      prisma.homeVisit.count({
        where: {
          status: {
            in: ["PENDING", "SCHEDULED"],
          },
        },
      }),

      // Today's orders for revenue calculation
      prisma.order.findMany({
        where: {
          createdAt: {
            gte: startOfToday,
          },
          status: {
            not: "CANCELLED",
          },
        },
        select: {
          finalAmount: true,
        },
      }),

      // Monthly orders for revenue calculation
      prisma.order.findMany({
        where: {
          createdAt: {
            gte: startOfMonth,
          },
          status: {
            not: "CANCELLED",
          },
        },
        select: {
          finalAmount: true,
        },
      }),

      // Recent orders (last 10)
      prisma.order.findMany({
        take: 10,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          orderNumber: true,
          status: true,
          finalAmount: true,
          createdAt: true,
          user: {
            select: {
              name: true,
              phone: true,
            },
          },
        },
      }),

      // Recent users (last 10)
      prisma.user.findMany({
        take: 10,
        orderBy: {
          createdAt: "desc",
        },
        where: {
          isActive: true,
        },
        select: {
          id: true,
          name: true,
          phone: true,
          createdAt: true,
        },
      }),
    ]);

    // Calculate revenue
    const todayRevenue = todayOrders.reduce((sum, order) => sum + order.finalAmount, 0);
    const monthlyRevenue = monthlyOrders.reduce((sum, order) => sum + order.finalAmount, 0);

    const stats = {
      totalUsers,
      totalTests,
      totalOrders,
      pendingHomeVisits,
      todayRevenue,
      monthlyRevenue,
      recentOrders,
      recentUsers,
    };

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 