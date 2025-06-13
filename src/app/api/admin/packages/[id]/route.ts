import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { verifyAuth } from "@/lib/auth-utils";

const updatePackageSchema = z.object({
  name: z.string().min(1, "Package name is required").optional(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive").optional(),
  originalPrice: z.number().positive("Original price must be positive").optional(),
  reportTime: z.string().optional(),
  idealFor: z.string().optional(),
  features: z.array(z.string()).optional(),
  testIds: z.array(z.string()).optional(),
  isPopular: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

const packageActionSchema = z.object({
  action: z.enum(["activate", "deactivate", "toggle-popular"]),
});

// GET /api/admin/packages/[id] - Get package details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const packageData = await prisma.package.findUnique({
      where: { id: params.id },
      include: {
        packageTests: {
          include: {
            test: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                discountPrice: true,
                category: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            orderItems: true,
          },
        },
        orderItems: {
          take: 5,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            quantity: true,
            price: true,
            createdAt: true,
            order: {
              select: {
                id: true,
                orderNumber: true,
                status: true,
                user: {
                  select: {
                    name: true,
                    phone: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!packageData) {
      return NextResponse.json(
        { error: "Package not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      package: packageData,
    });
  } catch (error) {
    console.error("Admin package details error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/packages/[id] - Update package
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = updatePackageSchema.parse(body);

    // Check if package exists
    const existingPackage = await prisma.package.findUnique({
      where: { id: params.id },
    });

    if (!existingPackage) {
      return NextResponse.json(
        { error: "Package not found" },
        { status: 404 }
      );
    }

    // Generate new slug if name is being updated
    let slug = existingPackage.slug;
    if (validatedData.name && validatedData.name !== existingPackage.name) {
      slug = validatedData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      // Check if new slug already exists
      const slugExists = await prisma.package.findFirst({
        where: {
          slug,
          id: { not: params.id },
        },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "Package with this name already exists" },
          { status: 400 }
        );
      }
    }

    // Verify test IDs if provided
    if (validatedData.testIds) {
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

    // Update package with tests in a transaction
    const updatedPackage = await prisma.$transaction(async (tx) => {
      // Update the package
      const pkg = await tx.package.update({
        where: { id: params.id },
        data: {
          ...(validatedData.name && { name: validatedData.name, slug }),
          ...(validatedData.subtitle !== undefined && { subtitle: validatedData.subtitle }),
          ...(validatedData.description !== undefined && { description: validatedData.description }),
          ...(validatedData.price && { price: validatedData.price }),
          ...(validatedData.originalPrice !== undefined && { originalPrice: validatedData.originalPrice }),
          ...(validatedData.reportTime !== undefined && { reportTime: validatedData.reportTime }),
          ...(validatedData.idealFor !== undefined && { idealFor: validatedData.idealFor }),
          ...(validatedData.features && { features: validatedData.features }),
          ...(validatedData.isPopular !== undefined && { isPopular: validatedData.isPopular }),
          ...(validatedData.isActive !== undefined && { isActive: validatedData.isActive }),
          ...(validatedData.testIds && { testCount: validatedData.testIds.length }),
        },
      });

      // Update package tests if testIds provided
      if (validatedData.testIds) {
        // Remove existing package tests
        await tx.packageTest.deleteMany({
          where: { packageId: params.id },
        });

        // Add new package tests
        if (validatedData.testIds.length > 0) {
          await tx.packageTest.createMany({
            data: validatedData.testIds.map((testId) => ({
              packageId: params.id,
              testId,
            })),
          });
        }
      }

      return pkg;
    });

    return NextResponse.json({
      success: true,
      message: "Package updated successfully",
      package: updatedPackage,
    });
  } catch (error) {
    console.error("Admin package update error:", error);

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

// PATCH /api/admin/packages/[id] - Perform package actions
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action } = packageActionSchema.parse(body);

    // Check if package exists
    const packageData = await prisma.package.findUnique({
      where: { id: params.id },
    });

    if (!packageData) {
      return NextResponse.json(
        { error: "Package not found" },
        { status: 404 }
      );
    }

    const updateData: { isActive?: boolean; isPopular?: boolean } = {};
    let message = "";

    switch (action) {
      case "activate":
        updateData.isActive = true;
        message = "Package activated successfully";
        break;
      case "deactivate":
        updateData.isActive = false;
        message = "Package deactivated successfully";
        break;
      case "toggle-popular":
        updateData.isPopular = !packageData.isPopular;
        message = `Package ${updateData.isPopular ? "marked as" : "removed from"} popular`;
        break;
    }

    // Update the package
    const updatedPackage = await prisma.package.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        slug: true,
        isActive: true,
        isPopular: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message,
      package: updatedPackage,
    });
  } catch (error) {
    console.error("Admin package action error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid action", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/packages/[id] - Delete package
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    // Check if package exists
    const packageData = await prisma.package.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            orderItems: true,
          },
        },
      },
    });

    if (!packageData) {
      return NextResponse.json(
        { error: "Package not found" },
        { status: 404 }
      );
    }

    // Check if package has orders
    if (packageData._count.orderItems > 0) {
      return NextResponse.json(
        { error: "Cannot delete package with existing orders. Deactivate instead." },
        { status: 400 }
      );
    }

    // Delete the package (cascade will handle package tests)
    await prisma.package.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: "Package deleted successfully",
    });
  } catch (error) {
    console.error("Admin package delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 