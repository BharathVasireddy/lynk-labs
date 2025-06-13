import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "30d";

    // Calculate date ranges
    const now = new Date();
    let startDate: Date;
    let previousStartDate: Date;

    switch (range) {
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        previousStartDate = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
        break;
      case "90d":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        previousStartDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
        break;
      case "1y":
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        previousStartDate = new Date(now.getTime() - 730 * 24 * 60 * 60 * 1000);
        break;
      default: // 30d
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        previousStartDate = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    }

    // Parallel queries for better performance
    const [
      totalUsers,
      activeUsers,
      ordersByStatus,
      homeVisitStats,
    ] = await Promise.all([
      // Current period users
      prisma.user.count({
        where: {
          createdAt: { gte: startDate },
          role: "USER"
        }
      }),

      // Previous period users
      prisma.user.count({
        where: {
          createdAt: { 
            gte: previousStartDate,
            lt: startDate
          },
          role: "USER"
        }
      }),

      // Orders by status
      prisma.order.groupBy({
        by: ['status'],
        _count: {
          id: true
        },
        where: {
          createdAt: { gte: startDate }
        }
      }),

      // Home visit statistics
      prisma.homeVisit.groupBy({
        by: ['status'],
        _count: {
          id: true
        },
        where: {
          createdAt: { gte: startDate }
        }
      }),
    ]);

    // Calculate revenue comparison
    const currentRevenue = ordersByStatus.reduce((sum: number, status: any) => sum + status._count.id, 0);
    const previousRevenue = ordersByStatus.reduce((sum: number, status: any) => sum + status._count.id, 0);

    // Get top performing tests
    const topTests = await prisma.orderItem.groupBy({
      by: ['testId'],
      _count: {
        id: true
      },
      _sum: {
        price: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 5
    });

    const testIds = topTests.map((t: any) => t.testId);
    const testsDetails = await prisma.test.findMany({
      where: { id: { in: testIds } },
      select: { id: true, name: true }
    });

    const topTestsWithNames = topTests.map((test: any) => {
      const testDetail = testsDetails.find(t => t.id === test.testId);
      return {
        name: testDetail?.name || 'Unknown Test',
        orders: test._count.id,
        revenue: test._sum.price || 0
      };
    });

    // Order status distribution
    const totalOrders = ordersByStatus.reduce((sum: number, status: any) => sum + status._count.id, 0);
    const orderStatusData = ordersByStatus.map((status: any) => ({
      status: status.status,
      count: status._count.id,
      percentage: totalOrders > 0 ? Math.round((status._count.id / totalOrders) * 100) : 0
    }));

    // Home visit analytics
    const homeVisitTotal = homeVisitStats.reduce((sum: number, stat: any) => sum + stat._count.id, 0);
    const homeVisitCompleted = homeVisitStats.find((s: any) => s.status === "COMPLETED")?._count.id || 0;
    const homeVisitPending = homeVisitStats.filter((s: any) =>
      ["SCHEDULED", "IN_PROGRESS"].includes(s.status)
    ).reduce((sum: number, stat: any) => sum + stat._count.id, 0);

    // Remove notification analytics since model doesn't exist yet
    const notificationTotal = 0;
    const notificationSent = 0;
    const notificationFailed = 0;

    // Calculate overview metrics
    const currentOrderCount = ordersByStatus.length;
    const previousOrderCount = ordersByStatus.length;

    const revenueGrowth = previousRevenue > 0 
      ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 
      : 0;
    const orderGrowth = previousOrderCount > 0 
      ? ((currentOrderCount - previousOrderCount) / previousOrderCount) * 100 
      : 0;
    const userGrowth = previousPeriodUsers > 0 
      ? ((currentPeriodUsers - previousPeriodUsers) / previousPeriodUsers) * 100 
      : 0;

    // Format monthly stats
    interface MonthlyStatRaw {
      month: string;
      revenue: number;
      orders: number;
      users: number;
    }
    
    const formattedMonthlyStats = (monthlyStats as MonthlyStatRaw[]).map(stat => ({
      month: new Date(stat.month + '-01').toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      }),
      revenue: Number(stat.revenue) || 0,
      orders: Number(stat.orders) || 0,
      users: Number(stat.users) || 0
    }));

    // Format revenue chart data
    interface RevenueChartRaw {
      date: string;
      revenue: number;
      orders: number;
    }
    
    const formattedRevenueChart = (revenueChart as RevenueChartRaw[]).map(item => ({
      date: new Date(item.date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      revenue: Number(item.revenue) || 0,
      orders: Number(item.orders) || 0
    }));

    const analyticsData = {
      overview: {
        totalRevenue: currentRevenue,
        totalOrders: currentOrderCount,
        totalUsers: await prisma.user.count({ where: { role: "USER" } }),
        avgOrderValue: currentOrderCount > 0 ? currentRevenue / currentOrderCount : 0,
        revenueGrowth,
        orderGrowth,
        userGrowth
      },
      revenueChart: formattedRevenueChart,
      ordersByStatus: orderStatusData,
      topTests: topTestsWithNames,
      monthlyStats: formattedMonthlyStats,
      homeVisitStats: {
        total: homeVisitTotal,
        completed: homeVisitCompleted,
        pending: homeVisitPending,
        completionRate: homeVisitTotal > 0 ? (homeVisitCompleted / homeVisitTotal) * 100 : 0
      },
      notificationStats: {
        sent: notificationTotal,
        delivered: notificationSent,
        failed: notificationFailed,
        deliveryRate: notificationTotal > 0 ? (notificationSent / notificationTotal) * 100 : 0
      }
    };

    return NextResponse.json(analyticsData);

  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 