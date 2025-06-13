import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Cache for frequently accessed data
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCacheKey(params: Record<string, any>): string {
  return JSON.stringify(params);
}

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
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50) // Cap at 50
    const search = searchParams.get("search") || ""
    const categoryId = searchParams.get("categoryId")
    const sortBy = searchParams.get("sortBy") || "name"
    
    // Create cache key
    const cacheKey = getCacheKey({ page, limit, search, categoryId, sortBy });
    
    // Check cache first
    const cachedResult = getFromCache(cacheKey);
    if (cachedResult) {
      return NextResponse.json(cachedResult);
    }
    
    const skip = (page - 1) * limit

    // Optimized where clause
    const where = {
      isActive: true,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } }
        ]
      }),
      ...(categoryId && { categoryId })
    }

    // Optimized orderBy clause
    let orderBy: any = { name: "asc" }
    
    switch (sortBy) {
      case "price-low":
        orderBy = { price: "asc" }
        break
      case "price-high":
        orderBy = { price: "desc" }
        break
      case "popular":
        // Order by order count (requires aggregation)
        orderBy = [
          { orderItems: { _count: "desc" } },
          { createdAt: "desc" }
        ]
        break
      case "newest":
        orderBy = { createdAt: "desc" }
        break
      default:
        orderBy = { name: "asc" }
    }

    // Use Promise.all for parallel queries - much faster
    const [tests, total] = await Promise.all([
      prisma.test.findMany({
        where,
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          price: true,
          discountPrice: true,
          preparationInstructions: true,
          reportTime: true,
          isActive: true,
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          // Only include order count for popular sorting
          ...(sortBy === "popular" && {
            _count: {
              select: {
                orderItems: true
              }
            }
          })
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.test.count({ where })
    ])

    const result = {
      tests: tests || [],
      pagination: {
        page,
        limit,
        total: total || 0,
        pages: Math.ceil((total || 0) / limit)
      }
    };

    // Cache the result
    setCache(cacheKey, result);

    return NextResponse.json(result);
    
  } catch (error) {
    console.error("Error fetching tests:", error)
    
    // Return empty data structure on error to prevent frontend crashes
    return NextResponse.json({
      tests: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        pages: 0
      },
      error: "Unable to fetch tests at this time"
    }, { status: 200 }) // Return 200 to prevent frontend errors
  }
}

// Endpoint for getting popular tests (cached heavily)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type } = body;

    if (type === "popular") {
      const cacheKey = "popular-tests";
      const cached = getFromCache(cacheKey);
      
      if (cached) {
        return NextResponse.json(cached);
      }

      // Get most ordered tests
      const popularTests = await prisma.test.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          discountPrice: true,
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          _count: {
            select: {
              orderItems: true
            }
          }
        },
        orderBy: {
          orderItems: {
            _count: "desc"
          }
        },
        take: 6
      });

      const result = { tests: popularTests };
      setCache(cacheKey, result);
      
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Invalid request type" }, { status: 400 });
    
  } catch (error) {
    console.error("Error in POST /api/tests:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 