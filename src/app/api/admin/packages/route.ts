import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { verifyAuth } from "@/lib/auth-utils";

const createPackageSchema = z.object({
  name: z.string().min(1, "Package name is required"),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  originalPrice: z.number().positive("Original price must be positive").optional(),
  reportTime: z.string().optional(),
  idealFor: z.string().optional(),
  features: z.array(z.string()).default([]),
  testIds: z.array(z.string()).default([]),
  isPopular: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

// GET /api/admin/packages - List packages with filtering and pagination
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

    // Status filter
    if (status !== "all") {
      where.isActive = status === "active";
    }

    // Get packages with test count and order count
    const [packages, totalCount] = await Promise.all([
      prisma.package.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
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
          createdAt: true,
          _count: {
            select: {
              packageTests: true,
              orderItems: true,
            },
          },
        },
      }),
      prisma.package.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      packages,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
      },
    });
  } catch (error) {
    console.error("Admin packages list error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/admin/packages - Create new package
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = createPackageSchema.parse(body);

    // Generate slug from name
    const slug = validatedData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Check if slug already exists
    const existingPackage = await prisma.package.findUnique({
      where: { slug },
    });

    if (existingPackage) {
      return NextResponse.json(
        { error: "Package with this name already exists" },
        { status: 400 }
      );
    }

    // Verify all test IDs exist
    if (validatedData.testIds.length > 0) {
      const existingTests = await prisma.test.findMany({
        where: {
          id: { in: validatedData.testIds },
          isActive: true,
        },
        select: { id: true },
      });

      if (existingTests.length !== validatedData.testIds.length) {
        return NextResponse.json(
          { error: "Some test IDs are invalid or inactive" },
          { status: 400 }
        );
      }
    }

    // Create package with tests in a transaction
    const newPackage = await prisma.$transaction(async (tx) => {
      // Create the package
      const pkg = await tx.package.create({
        data: {
          name: validatedData.name,
          slug,
          subtitle: validatedData.subtitle,
          description: validatedData.description,
          price: validatedData.price,
          originalPrice: validatedData.originalPrice,
          testCount: validatedData.testIds.length,
          reportTime: validatedData.reportTime,
          idealFor: validatedData.idealFor,
          features: validatedData.features,
          isPopular: validatedData.isPopular,
          isActive: validatedData.isActive,
        },
      });

      // Add tests to package
      if (validatedData.testIds.length > 0) {
        await tx.packageTest.createMany({
          data: validatedData.testIds.map((testId) => ({
            packageId: pkg.id,
            testId,
          })),
        });
      }

      return pkg;
    });

    return NextResponse.json({
      success: true,
      message: "Package created successfully",
      package: newPackage,
    });
  } catch (error) {
    console.error("Admin package creation error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 