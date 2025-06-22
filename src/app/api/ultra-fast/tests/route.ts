import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Ultra-fast tests endpoint - minimal processing, maximum speed
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "8"), 12);
    const search = searchParams.get("search") || "";

    // Super optimized query - only essential fields
    const testsPromise = prisma.test.findMany({
      where: {
        isActive: true,
        ...(search && {
          name: { contains: search, mode: 'insensitive' as const }
        }),
      },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        discountPrice: true,
        category: {
          select: {
            name: true,
          }
        },
      },
      orderBy: { name: "asc" },
      take: limit,
    });

    const tests = await testsPromise;
    const endTime = Date.now();

    return NextResponse.json(
      { 
        tests, 
        count: tests.length,
        responseTime: endTime - startTime 
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
          'Content-Type': 'application/json',
          'X-Response-Time': `${endTime - startTime}ms`,
        }
      }
    );
  } catch (error) {
    const endTime = Date.now();
    console.error("Ultra-fast tests API error:", error);
    
    return NextResponse.json(
      { 
        tests: [], 
        count: 0,
        error: "Failed to fetch tests",
        responseTime: endTime - startTime 
      },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=10',
          'Content-Type': 'application/json',
          'X-Response-Time': `${endTime - startTime}ms`,
        }
      }
    );
  }
}