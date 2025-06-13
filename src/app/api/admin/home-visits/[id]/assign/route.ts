import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const assignAgentSchema = z.object({
  agentId: z.string().min(1, "Agent ID is required"),
  notes: z.string().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = assignAgentSchema.parse(body);

    // Check if home visit exists
    const homeVisit = await prisma.homeVisit.findUnique({
      where: { id: params.id },
      include: {
        order: {
          select: {
            orderNumber: true,
            user: {
              select: {
                name: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    if (!homeVisit) {
      return NextResponse.json(
        { error: "Home visit not found" },
        { status: 404 }
      );
    }

    // Check if agent exists and has the right role
    const agent = await prisma.user.findUnique({
      where: { 
        id: validatedData.agentId,
        role: "HOME_VISIT_AGENT",
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        phone: true,
      },
    });

    if (!agent) {
      return NextResponse.json(
        { error: "Agent not found or not active" },
        { status: 404 }
      );
    }

    // Update home visit with agent assignment
    const updatedHomeVisit = await prisma.homeVisit.update({
      where: { id: params.id },
      data: {
        agentId: validatedData.agentId,
        notes: validatedData.notes,
        updatedAt: new Date(),
      },
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        order: {
          select: {
            orderNumber: true,
            user: {
              select: {
                name: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    // TODO: Send notification to agent about the assignment
    // This could be implemented with SMS/WhatsApp/Email notification

    return NextResponse.json({
      success: true,
      message: "Agent assigned successfully",
      homeVisit: updatedHomeVisit,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error assigning agent:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 