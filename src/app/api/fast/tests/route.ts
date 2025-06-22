import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { CacheManager, withCache } from "@/lib/cache";

// Ultra-fast tests endpoint with aggressive caching
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 20);
    const search = searchParams.get("search") || "";
    const categoryId = searchParams.get("categoryId");

    const cacheKey = `fast-tests:${search}:${categoryId}:${limit}`;

    const result = await withCache(
      cacheKey,
      async () => {
        const where = {
          isActive: true,
          ...(search && {
            OR: [
              { name: { contains: search, mode: 'insensitive' as const } },
              { description: { contains: search, mode: 'insensitive' as const } }
            ]
          }),
          ...(categoryId && { categoryId })
        };

        // Optimized query with minimal data
        const tests = await prisma.test.findMany({
          where,
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            discountPrice: true,
            reportTime: true,
            category: {
              select: {
                name: true,
              }
            },
          },
          orderBy: { name: "asc" },
          take: limit,
        });

        return { tests, count: tests.length };
      },
      CacheManager.getTTL().SHORT // 30 seconds cache
    );

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=15',
        'Content-Type': 'application/json',
        'X-Cache': 'HIT',
      }
    });
  } catch (error) {
    console.error("Fast tests API error:", error);
    return NextResponse.json(
      { tests: [], count: 0 },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=10',
          'Content-Type': 'application/json',
        }
      }
    );
  }
}