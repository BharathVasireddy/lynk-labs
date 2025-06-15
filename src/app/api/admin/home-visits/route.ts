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
    const agentId = searchParams.get("agentId");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Build where clause
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (agentId) {
      where.agentId = agentId;
    }

    // Date range filter
    if (dateFrom || dateTo) {
      where.scheduledDate = {};
      if (dateFrom) {
        where.scheduledDate.gte = new Date(dateFrom);
      }
      if (dateTo) {
        where.scheduledDate.lte = new Date(dateTo);
      }
    }

    // Search filter
    if (search) {
      where.OR = [
        { order: { orderNumber: { contains: search, mode: "insensitive" } } },
        { order: { user: { name: { contains: search, mode: "insensitive" } } } },
        { order: { user: { phone: { contains: search } } } },
        { notes: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get home visits with pagination
    const [homeVisits, total] = await Promise.all([
      prisma.homeVisit.findMany({
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
              address: true,
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
          agent: {
            select: {
              name: true,
              phone: true,
            },
          },
        },
        orderBy: {
          scheduledDate: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.homeVisit.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      homeVisits,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching home visits:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 