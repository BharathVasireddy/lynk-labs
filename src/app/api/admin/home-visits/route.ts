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
    const date = searchParams.get("date");
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

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      
      where.scheduledDate = {
        gte: startDate,
        lt: endDate,
      };
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