import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { verifyAuth } from "@/lib/auth-utils";

const createTestSchema = z.object({
  name: z.string().min(1, "Test name is required"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  discountPrice: z.number().positive("Discount price must be positive").optional(),
  preparationInstructions: z.string().optional(),
  reportTime: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  isActive: z.boolean().default(true),
});

// POST /api/admin/tests/new - Create new test
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
    const validatedData = createTestSchema.parse(body);

    // Generate slug from name
    const slug = validatedData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Check if slug already exists
    const existingTest = await prisma.test.findUnique({
      where: { slug },
    });

    if (existingTest) {
      return NextResponse.json(
        { error: "Test with this name already exists" },
        { status: 400 }
      );
    }

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: validatedData.categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 400 }
      );
    }

    // Validate discount price
    if (validatedData.discountPrice && validatedData.discountPrice >= validatedData.price) {
      return NextResponse.json(
        { error: "Discount price must be less than regular price" },
        { status: 400 }
      );
    }

    // Create the test
    const newTest = await prisma.test.create({
      data: {
        name: validatedData.name,
        slug,
        description: validatedData.description,
        price: validatedData.price,
        discountPrice: validatedData.discountPrice,
        preparationInstructions: validatedData.preparationInstructions,
        reportTime: validatedData.reportTime,
        categoryId: validatedData.categoryId,
        isActive: validatedData.isActive,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Test created successfully",
      test: newTest,
    });
  } catch (error) {
    console.error("Admin test creation error:", error);

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