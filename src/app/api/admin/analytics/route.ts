import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAuth } from "@/lib/auth-utils";

// Force dynamic rendering for admin routes
export const dynamic = 'force-dynamic';

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

    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "30d";

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (range) {
      case "7d":
        startDate.setDate(now.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(now.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(now.getDate() - 90);
        break;
      case "1y":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
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
      homeVisitStats,
      topTests,
      userGrowth,
      orderGrowth,
      revenueGrowth,
    ] = await Promise.all([
      // Total orders
      prisma.order.count({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
      }),
      
      // Total revenue (completed orders only)
      prisma.order.aggregate({
        where: { 
          status: "COMPLETED",
          createdAt: {
            gte: startDate,
          },
        },
        _sum: { finalAmount: true },
      }),
      
      // Total users
      prisma.user.count({
        where: { 
          role: "CUSTOMER",
          createdAt: {
            gte: startDate,
          },
        },
      }),
      
      // Total tests
      prisma.test.count({
        where: { isActive: true },
      }),
      
      // Recent orders (last 15)
      prisma.order.findMany({
        take: 15,
        orderBy: { createdAt: "desc" },
        where: {
          createdAt: {
            gte: startDate,
          },
        },
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
        where: {
          createdAt: {
            gte: startDate,
          },
        },
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

      // Home visit stats
      prisma.homeVisit.groupBy({
        by: ["status"],
        _count: { status: true },
        where: {
          createdAt: {
            gte: startDate,
          },
        },
      }),

      // Top performing tests
      prisma.$queryRaw`
        SELECT 
          t.name,
          COUNT(oi.id) as order_count,
          SUM(oi.price * oi.quantity) as revenue
        FROM "tests" t
        JOIN "order_items" oi ON t.id = oi."testId"
        JOIN "orders" o ON oi."orderId" = o.id
        WHERE o."createdAt" >= ${startDate}
          AND o.status = 'COMPLETED'
        GROUP BY t.id, t.name
        ORDER BY revenue DESC
        LIMIT 10
      `,

      // User growth (previous period comparison)
      prisma.user.count({
        where: {
          role: "CUSTOMER",
          createdAt: {
            gte: new Date(startDate.getTime() - (now.getTime() - startDate.getTime())),
            lt: startDate,
          },
        },
      }),

      // Order growth (previous period comparison)
      prisma.order.count({
        where: {
          createdAt: {
            gte: new Date(startDate.getTime() - (now.getTime() - startDate.getTime())),
            lt: startDate,
          },
        },
      }),

      // Revenue growth (previous period comparison)
      prisma.order.aggregate({
        where: {
          status: "COMPLETED",
          createdAt: {
            gte: new Date(startDate.getTime() - (now.getTime() - startDate.getTime())),
            lt: startDate,
          },
        },
        _sum: { finalAmount: true },
      }),
    ]);

    // Convert BigInt values to numbers for JSON serialization
    const processedRevenueByMonth = revenueByMonth.map((item: any) => ({
      month: item.month,
      revenue: Number(item.revenue) || 0,
      orders: Number(item.orders) || 0,
    }));

    const processedTopTests = topTests.map((item: any) => ({
      name: item.name,
      orderCount: Number(item.order_count) || 0,
      revenue: Number(item.revenue) || 0,
    }));

    // Calculate growth percentages
    const currentRevenue = Number(totalRevenue._sum.finalAmount) || 0;
    const previousRevenue = Number(revenueGrowth._sum.finalAmount) || 0;
    const revenueGrowthPercent = previousRevenue > 0 
      ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 
      : 0;

    const orderGrowthPercent = orderGrowth > 0 
      ? ((totalOrders - orderGrowth) / orderGrowth) * 100 
      : 0;

    const userGrowthPercent = userGrowth > 0 
      ? ((totalUsers - userGrowth) / userGrowth) * 100 
      : 0;

    // Process home visit stats
    const homeVisitCounts = homeVisitStats.reduce((acc: any, item: any) => {
      acc[item.status] = item._count.status;
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      analytics: {
        overview: {
          totalOrders,
          totalRevenue: currentRevenue,
          totalUsers,
          totalTests,
          avgOrderValue: totalOrders > 0 ? currentRevenue / totalOrders : 0,
          revenueGrowth: revenueGrowthPercent,
          orderGrowth: orderGrowthPercent,
          userGrowth: userGrowthPercent,
        },
        recentOrders,
        ordersByStatus,
        revenueByMonth: processedRevenueByMonth,
        topTests: processedTopTests,
        homeVisitStats: {
          total: homeVisitStats.reduce((sum, item) => sum + item._count.status, 0),
          completed: homeVisitCounts.COMPLETED || 0,
          pending: homeVisitCounts.PENDING || 0,
          scheduled: homeVisitCounts.SCHEDULED || 0,
          inProgress: homeVisitCounts.IN_PROGRESS || 0,
        },
        dateRange: {
          start: startDate.toISOString(),
          end: now.toISOString(),
          range,
        },
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