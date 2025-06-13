import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";
    const date = searchParams.get("date") || "all";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Build where clause
    const where: {
      OR?: any[];
      isDelivered?: boolean;
      uploadedAt?: {
        gte?: Date;
        lte?: Date;
      };
    } = {};

    // Search filter
    if (search) {
      where.OR = [
        {
          order: {
            orderNumber: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          order: {
            user: {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        },
        {
          order: {
            user: {
              phone: {
                contains: search,
              },
            },
          },
        },
        {
          fileName: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    // Status filter
    if (status !== "all") {
      switch (status) {
        case "pending":
          where.isDelivered = false;
          break;
        case "delivered":
          where.isDelivered = true;
          break;
      }
    }

    // Date filter
    if (date !== "all") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      switch (date) {
        case "today":
          const endOfToday = new Date(today);
          endOfToday.setHours(23, 59, 59, 999);
          where.uploadedAt = {
            gte: today,
            lte: endOfToday,
          };
          break;
        case "yesterday":
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          const endOfYesterday = new Date(yesterday);
          endOfYesterday.setHours(23, 59, 59, 999);
          where.uploadedAt = {
            gte: yesterday,
            lte: endOfYesterday,
          };
          break;
        case "this_week":
          const startOfWeek = new Date(today);
          startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
          where.uploadedAt = {
            gte: startOfWeek,
          };
          break;
        case "last_week":
          const startOfLastWeek = new Date(today);
          startOfLastWeek.setDate(startOfLastWeek.getDate() - startOfLastWeek.getDay() - 7);
          const endOfLastWeek = new Date(startOfLastWeek);
          endOfLastWeek.setDate(endOfLastWeek.getDate() + 6);
          endOfLastWeek.setHours(23, 59, 59, 999);
          where.uploadedAt = {
            gte: startOfLastWeek,
            lte: endOfLastWeek,
          };
          break;
      }
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
          uploader: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          uploadedAt: "desc",
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