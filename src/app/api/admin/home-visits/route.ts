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
    const where: any = {};

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
      ];
    }

    // Status filter
    if (status !== "all") {
      where.status = status;
    }

    // Date filter
    if (date !== "all") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      switch (date) {
        case "today":
          const endOfToday = new Date(today);
          endOfToday.setHours(23, 59, 59, 999);
          where.scheduledDate = {
            gte: today,
            lte: endOfToday,
          };
          break;
        case "tomorrow":
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          const endOfTomorrow = new Date(tomorrow);
          endOfTomorrow.setHours(23, 59, 59, 999);
          where.scheduledDate = {
            gte: tomorrow,
            lte: endOfTomorrow,
          };
          break;
        case "this_week":
          const endOfWeek = new Date(today);
          endOfWeek.setDate(endOfWeek.getDate() + (7 - endOfWeek.getDay()));
          endOfWeek.setHours(23, 59, 59, 999);
          where.scheduledDate = {
            gte: today,
            lte: endOfWeek,
          };
          break;
        case "next_week":
          const startOfNextWeek = new Date(today);
          startOfNextWeek.setDate(startOfNextWeek.getDate() + (7 - startOfNextWeek.getDay() + 1));
          const endOfNextWeek = new Date(startOfNextWeek);
          endOfNextWeek.setDate(endOfNextWeek.getDate() + 6);
          endOfNextWeek.setHours(23, 59, 59, 999);
          where.scheduledDate = {
            gte: startOfNextWeek,
            lte: endOfNextWeek,
          };
          break;
      }
    }

    // Get home visits with pagination
    const [homeVisits, total] = await Promise.all([
      prisma.homeVisit.findMany({
        where,
        include: {
          order: {
            include: {
              user: true,
              orderItems: {
                include: {
                  test: true
                }
              }
            }
          },
          agent: true
        },
        orderBy: { scheduledDate: 'desc' },
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