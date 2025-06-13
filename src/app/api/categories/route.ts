import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Cache for categories (they don't change often)
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes for categories

function getFromCache(key: string): any | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

function setCache(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeTestCount = searchParams.get("includeTestCount") === "true";
    const limit = searchParams.get("limit");
    
    const cacheKey = `categories-${includeTestCount}-${limit}`;
    
    // Check cache first
    const cachedResult = getFromCache(cacheKey);
    if (cachedResult) {
      return NextResponse.json(cachedResult);
    }

    // Optimized query with selective fields
    const categories = await prisma.category.findMany({
      where: {
        isActive: true
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        icon: true,
        ...(includeTestCount && {
          _count: {
            select: {
              tests: {
                where: {
                  isActive: true
                }
              }
            }
          }
        })
      },
      orderBy: {
        name: "asc"
      },
      ...(limit && { take: parseInt(limit) })
    });

    const result = {
      categories: categories || []
    };

    // Cache the result
    setCache(cacheKey, result);

    return NextResponse.json(result);
    
  } catch (error) {
    console.error("Error fetching categories:", error);
    
    return NextResponse.json({
      categories: [],
      error: "Unable to fetch categories at this time"
    }, { status: 200 });
  }
} 