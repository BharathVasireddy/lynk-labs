import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAuth } from "@/lib/auth-utils";

// GET /api/admin/dashboard - Get dashboard statistics
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

    // Get dashboard statistics
    const [
      totalUsers,
      totalOrders,
      totalTests,
      totalHomeVisits,
      recentOrders,
      recentUsers
    ] = await Promise.all([
      prisma.user.count(),
      prisma.order.count(),
      prisma.test.count(),
      prisma.homeVisit.count(),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { name: true, email: true }
          },
          orderItems: {
            include: {
              test: {
                select: { name: true }
              }
            }
          }
        }
      }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          role: true
        }
      })
    ]);

    // Calculate revenue (assuming orders have a finalAmount field)
    const orders = await prisma.order.findMany({
      select: { finalAmount: true }
    });
    const totalRevenue = orders.reduce((sum, order) => sum + (order.finalAmount || 0), 0);

    return NextResponse.json({
      totalUsers,
      totalOrders,
      totalTests,
      totalHomeVisits,
      pendingHomeVisits: totalHomeVisits, // Alias for compatibility
      todayRevenue: totalRevenue,
      monthlyRevenue: totalRevenue,
      totalRevenue,
      recentOrders,
      recentUsers
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 