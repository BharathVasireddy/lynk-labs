import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { CacheManager, withCache } from "@/lib/cache";

export async function GET(request: NextRequest) {
  try {
    const result = await withCache(
      'fast-categories',
      async () => {
        const categories = await prisma.category.findMany({
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            slug: true,
            _count: {
              select: {
                tests: {
                  where: { isActive: true }
                }
              }
            }
          },
          orderBy: { name: "asc" },
        });

        return { categories };
      },
      CacheManager.getTTL().LONG // 30 minutes cache for categories
    );

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=900',
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error("Fast categories API error:", error);
    return NextResponse.json(
      { categories: [] },
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