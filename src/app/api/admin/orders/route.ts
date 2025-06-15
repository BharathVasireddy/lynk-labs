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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const paymentMethod = searchParams.get("paymentMethod");
    const hasReport = searchParams.get("hasReport");
    const search = searchParams.get("search");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const minAmount = searchParams.get("minAmount");
    const maxAmount = searchParams.get("maxAmount");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Build where clause
    const where: any = {};

    // Status filter
    if (status && status !== "all") {
      where.status = status;
    }

    // Payment method filter
    if (paymentMethod && paymentMethod !== "all") {
      where.paymentMethod = paymentMethod;
    }

    // Report status filter
    if (hasReport !== null && hasReport !== "all") {
      if (hasReport === "false") {
        where.reports = { none: {} };
      } else if (hasReport === "true") {
        where.reports = { some: {} };
      } else if (hasReport === "delivered") {
        where.reports = { some: { isDelivered: true } };
      }
    }

    // Search filter
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } },
        { user: { phone: { contains: search } } },
        { user: { email: { contains: search, mode: "insensitive" } } },
        { id: { contains: search, mode: "insensitive" } },
      ];
    }

    // Date range filter
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom);
      }
      if (dateTo) {
        where.createdAt.lte = new Date(dateTo);
      }
    }

    // Amount range filter
    if (minAmount || maxAmount) {
      where.finalAmount = {};
      if (minAmount) {
        where.finalAmount.gte = parseFloat(minAmount);
      }
      if (maxAmount) {
        where.finalAmount.lte = parseFloat(maxAmount);
      }
    }

    // Get orders with pagination
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
            },
          },
          orderItems: {
            include: {
              test: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
          homeVisit: {
            include: {
              agent: {
                select: {
                  id: true,
                  name: true,
                  phone: true,
                },
              },
            },
          },
          reports: {
            select: {
              id: true,
              fileName: true,
              isDelivered: true,
              deliveredAt: true,
            },
          },
          address: {
            select: {
              id: true,
              line1: true,
              line2: true,
              city: true,
              state: true,
              pincode: true,
              landmark: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 