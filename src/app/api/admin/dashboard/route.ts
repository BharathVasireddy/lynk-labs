import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAuth } from "@/lib/auth-utils";

// GET /api/admin/dashboard - Get comprehensive dashboard statistics
export async function GET(request: NextRequest) {
  try {
    // CRITICAL: Enforce admin authentication
    const user = await verifyAuth(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    // Date calculations
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // Get comprehensive statistics
    const [
      totalUsers,
      totalTests,
      totalPackages,
      totalOrders,
      totalHomeVisits,
      activeTests,
      activePackages,
      pendingHomeVisits,
      completedOrders,
      pendingOrders,
      cancelledOrders,
      todayOrders,
      monthlyOrders,
      lastMonthOrders,
      todayRevenue,
      monthlyRevenue,
      lastMonthRevenue,
      totalRevenue,
      lastMonthUsers,
      recentOrders,
      recentUsers,
      topTests,
      topPackages
    ] = await Promise.all([
      // Basic counts
      prisma.user.count(),
      prisma.test.count(),
      prisma.package.count(),
      prisma.order.count(),
      prisma.homeVisit.count(),
      
      // Active counts
      prisma.test.count({ where: { isActive: true } }),
      prisma.package.count({ where: { isActive: true } }),
      
      // Status-specific counts
      prisma.homeVisit.count({ where: { status: "SCHEDULED" } }),
      prisma.order.count({ where: { status: "COMPLETED" } }),
      prisma.order.count({ where: { status: { in: ["PENDING", "CONFIRMED", "PROCESSING"] } } }),
      prisma.order.count({ where: { status: "CANCELLED" } }),
      
      // Time-based order counts
      prisma.order.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.order.count({ where: { createdAt: { gte: monthStart } } }),
      prisma.order.count({ 
        where: { 
          createdAt: { 
            gte: lastMonthStart,
            lte: lastMonthEnd
          } 
        } 
      }),
      
      // Revenue calculations
      prisma.order.aggregate({
        where: { 
          createdAt: { gte: todayStart },
          status: { not: "CANCELLED" }
        },
        _sum: { finalAmount: true }
      }).then(result => result._sum.finalAmount || 0),
      
      prisma.order.aggregate({
        where: { 
          createdAt: { gte: monthStart },
          status: { not: "CANCELLED" }
        },
        _sum: { finalAmount: true }
      }).then(result => result._sum.finalAmount || 0),
      
      prisma.order.aggregate({
        where: { 
          createdAt: { 
            gte: lastMonthStart,
            lte: lastMonthEnd
          },
          status: { not: "CANCELLED" }
        },
        _sum: { finalAmount: true }
      }).then(result => result._sum.finalAmount || 0),
      
      prisma.order.aggregate({
        where: { status: { not: "CANCELLED" } },
        _sum: { finalAmount: true }
      }).then(result => result._sum.finalAmount || 0),
      
      // User growth
      prisma.user.count({ 
        where: { 
          createdAt: { 
            gte: lastMonthStart,
            lte: lastMonthEnd
          } 
        } 
      }),
      
      // Recent data
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          orderNumber: true,
          status: true,
          finalAmount: true,
          createdAt: true,
          user: {
            select: { 
              name: true, 
              email: true,
              phone: true
            }
          }
        }
      }),
      
      prisma.user.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          createdAt: true,
          role: true
        }
      }),
      
      // Top performing tests (this month)
      prisma.orderItem.groupBy({
        by: ['testId'],
        where: {
          testId: { not: null },
          order: {
            createdAt: { gte: monthStart },
            status: { not: "CANCELLED" }
          }
        },
        _count: { testId: true },
        _sum: { price: true },
        orderBy: { _count: { testId: 'desc' } },
        take: 10
      }).then(async (results) => {
        const testIds = results.map(r => r.testId).filter(Boolean) as string[];
        if (testIds.length === 0) return [];
        
        const tests = await prisma.test.findMany({
          where: { id: { in: testIds } },
          select: { id: true, name: true }
        });
        
        return results.map(result => {
          const test = tests.find(t => t.id === result.testId);
          return {
            id: result.testId || '',
            name: test?.name || 'Unknown Test',
            orderCount: result._count.testId,
            revenue: result._sum.price || 0
          };
        });
      }),
      
      // Top performing packages (this month)
      prisma.orderItem.groupBy({
        by: ['packageId'],
        where: {
          packageId: { not: null },
          order: {
            createdAt: { gte: monthStart },
            status: { not: "CANCELLED" }
          }
        },
        _count: { packageId: true },
        _sum: { price: true },
        orderBy: { _count: { packageId: 'desc' } },
        take: 10
      }).then(async (results) => {
        const packageIds = results.map(r => r.packageId).filter(Boolean) as string[];
        if (packageIds.length === 0) return [];
        
        const packages = await prisma.package.findMany({
          where: { id: { in: packageIds } },
          select: { id: true, name: true }
        });
        
        return results.map(result => {
          const pkg = packages.find(p => p.id === result.packageId);
          return {
            id: result.packageId || '',
            name: pkg?.name || 'Unknown Package',
            orderCount: result._count.packageId,
            revenue: result._sum.price || 0
          };
        });
      })
    ]);

    // Calculate growth percentages
    const revenueGrowth = lastMonthRevenue > 0 
      ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
      : 0;
    
    const ordersGrowth = lastMonthOrders > 0 
      ? ((monthlyOrders - lastMonthOrders) / lastMonthOrders) * 100 
      : 0;
    
    const currentMonthUsers = await prisma.user.count({ 
      where: { createdAt: { gte: monthStart } } 
    });
    
    const usersGrowth = lastMonthUsers > 0 
      ? ((currentMonthUsers - lastMonthUsers) / lastMonthUsers) * 100 
      : 0;

    return NextResponse.json({
      // Basic metrics
      totalUsers,
      totalTests,
      totalPackages,
      totalOrders,
      totalHomeVisits,
      pendingHomeVisits,
      
      // Revenue metrics
      todayRevenue,
      monthlyRevenue,
      totalRevenue,
      
      // Order metrics
      todayOrders,
      monthlyOrders,
      
      // Active counts
      activeTests,
      activePackages,
      
      // Order status breakdown
      completedOrders,
      pendingOrders,
      cancelledOrders,
      
      // Growth metrics
      revenueGrowth,
      ordersGrowth,
      usersGrowth,
      
      // Recent data
      recentOrders,
      recentUsers,
      
      // Top performers
      topTests,
      topPackages
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 