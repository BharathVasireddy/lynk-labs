import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { z } from "zod";

const updateStatusSchema = z.object({
  status: z.enum(["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
  notes: z.string().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is a home visit agent
    if (user.role !== "HOME_VISIT_AGENT") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = updateStatusSchema.parse(body);

    // Check if home visit exists and is assigned to this agent
    const homeVisit = await prisma.homeVisit.findUnique({
      where: { id: params.id },
      include: {
        order: true,
      },
    });

    if (!homeVisit) {
      return NextResponse.json(
        { error: "Home visit not found" },
        { status: 404 }
      );
    }

    if (homeVisit.agentId !== user.id) {
      return NextResponse.json(
        { error: "You are not assigned to this home visit" },
        { status: 403 }
      );
    }

    // Update home visit status
    const updatedHomeVisit = await prisma.homeVisit.update({
      where: { id: params.id },
      data: {
        status: validatedData.status,
        notes: validatedData.notes,
        collectionTime: validatedData.status === "COMPLETED" ? new Date() : undefined,
        updatedAt: new Date(),
      },
    });

    // Update order status based on home visit status
    if (validatedData.status === "COMPLETED") {
      await prisma.order.update({
        where: { id: homeVisit.order.id },
        data: { status: "SAMPLE_COLLECTED" },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Status updated successfully",
      homeVisit: updatedHomeVisit,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating home visit status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 