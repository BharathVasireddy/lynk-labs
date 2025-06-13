import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAuth } from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get analytics data
    const [
      totalOrders,
      totalRevenue,
      totalUsers,
      totalTests,
      recentOrders,
      ordersByStatus,
      revenueByMonth,
    ] = await Promise.all([
      // Total orders
      prisma.order.count(),
      
      // Total revenue (completed orders only)
      prisma.order.aggregate({
        where: { status: "COMPLETED" },
        _sum: { finalAmount: true },
      }),
      
      // Total users
      prisma.user.count({
        where: { role: "CUSTOMER" },
      }),
      
      // Total tests
      prisma.test.count({
        where: { isActive: true },
      }),
      
      // Recent orders (last 10)
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { name: true, phone: true },
          },
          orderItems: {
            include: {
              test: {
                select: { name: true },
              },
            },
          },
        },
      }),
      
      // Orders by status
      prisma.order.groupBy({
        by: ["status"],
        _count: { status: true },
      }),
      
      // Revenue by month (last 6 months)
      prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', "createdAt") as month,
          SUM("finalAmount") as revenue,
          COUNT(*) as orders
        FROM "orders" 
        WHERE "status" = 'COMPLETED' 
          AND "createdAt" >= NOW() - INTERVAL '6 months'
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY month DESC
      `,
    ]);

    return NextResponse.json({
      success: true,
      analytics: {
        overview: {
          totalOrders,
          totalRevenue: totalRevenue._sum.finalAmount || 0,
          totalUsers,
          totalTests,
        },
        recentOrders,
        ordersByStatus,
        revenueByMonth,
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 