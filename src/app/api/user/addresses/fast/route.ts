import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAuth } from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        { 
          addresses: [],
          error: "Unauthorized",
          responseTime: Date.now() - startTime
        },
        { status: 401 }
      );
    }

    const addresses = await prisma.address.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        line1: true,
        line2: true,
        city: true,
        state: true,
        pincode: true,
        type: true,
        isDefault: true,
      },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ],
    });

    const responseTime = Date.now() - startTime;

    return NextResponse.json({
      addresses,
      responseTime
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
        'Content-Type': 'application/json',
        'X-Response-Time': `${responseTime}ms`,
      }
    });

  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error("Error fetching addresses:", error);
    
    return NextResponse.json({
      addresses: [],
      error: "Failed to fetch addresses",
      responseTime
    }, { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'X-Response-Time': `${responseTime}ms`,
      }
    });
  }
}