import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAuth } from "@/lib/auth-utils";

// GET /api/admin/tests - List tests with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "all";
    const status = searchParams.get("status") || "all";

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {};

    // Search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { slug: { contains: search } },
      ];
    }

    // Category filter
    if (category !== "all") {
      where.categoryId = category;
    }

    // Status filter
    if (status !== "all") {
      where.isActive = status === "active";
    }

    // Get tests with category and order count
    const [tests, totalCount] = await Promise.all([
      prisma.test.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
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
          createdAt: true,
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          _count: {
            select: {
              orderItems: true,
            },
          },
        },
      }),
      prisma.test.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      tests,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
      },
    });
  } catch (error) {
    console.error("Admin tests list error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 