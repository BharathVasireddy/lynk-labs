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
    const isDelivered = searchParams.get("isDelivered");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Build where clause
    const where: any = {};

    if (status) {
      where.order = {
        status: status,
      };
    }

    if (isDelivered !== null) {
      where.isDelivered = isDelivered === "true";
    }

    // Date range filter
    if (dateFrom || dateTo) {
      where.uploadedAt = {};
      if (dateFrom) {
        where.uploadedAt.gte = new Date(dateFrom);
      }
      if (dateTo) {
        where.uploadedAt.lte = new Date(dateTo);
      }
    }

    // Search filter
    if (search) {
      where.OR = [
        { fileName: { contains: search, mode: "insensitive" } },
        { order: { orderNumber: { contains: search, mode: "insensitive" } } },
        { order: { user: { name: { contains: search, mode: "insensitive" } } } },
        { order: { user: { phone: { contains: search } } } },
      ];
    }

    // Get reports with pagination
    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        include: {
          order: {
            include: {
              user: {
                select: {
                  name: true,
                  phone: true,
                },
              },
              orderItems: {
                include: {
                  test: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.report.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      reports,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 