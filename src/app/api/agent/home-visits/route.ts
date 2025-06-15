import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is a home visit agent
    if (user.role !== "HOME_VISIT_AGENT") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get home visits assigned to this agent
    const homeVisits = await prisma.homeVisit.findMany({
      where: {
        agentId: user.id,
      },
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
      },
      orderBy: {
        scheduledDate: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      homeVisits,
    });
  } catch (error) {
    console.error("Error fetching agent home visits:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 