import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'anonymous';
    const rateLimit = await checkRateLimit(clientIP);
    
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: rateLimit.headers }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);

    const skip = (page - 1) * limit;

    // Build where clause
    const where = {
      isActive: true,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
          { subtitle: { contains: search, mode: 'insensitive' as const } },
          { idealFor: { contains: search, mode: 'insensitive' as const } },
        ]
      }),
    };

    // Get packages with pagination
    const [packages, total] = await Promise.all([
      prisma.package.findMany({
        where,
        select: {
          id: true,
          name: true,
          slug: true,
          subtitle: true,
          description: true,
          price: true,
          originalPrice: true,
          testCount: true,
          reportTime: true,
          idealFor: true,
          features: true,
          isPopular: true,
          isActive: true,
        },
        orderBy: [
          { isPopular: "desc" },
          { createdAt: "desc" }
        ],
        skip,
        take: limit,
      }),
      prisma.package.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    return NextResponse.json({
      success: true,
      packages,
      pagination: {
        page,
        limit,
        total,
        pages: totalPages,
        hasMore,
      },
    }, {
      headers: rateLimit.headers
    });
  } catch (error) {
    console.error("Error fetching packages:", error);
    
    // Return empty data structure on error to prevent frontend crashes
    return NextResponse.json({
      packages: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        pages: 0,
        hasMore: false,
      },
      error: "Unable to fetch packages at this time"
    }, { status: 200 });
  }
}