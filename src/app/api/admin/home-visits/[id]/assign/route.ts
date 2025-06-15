import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth-utils";
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
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if (user.role !== "ADMIN") {
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

    // Update home visit with agent assignment and auto-update order status
    const updatedHomeVisit = await prisma.$transaction(async (tx) => {
      // Update home visit with agent assignment
      const visit = await tx.homeVisit.update({
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
      });

      // Auto-update order status to SAMPLE_COLLECTION_SCHEDULED when agent is assigned
      if (visit.order.status === "CONFIRMED") {
        await tx.order.update({
          where: { id: visit.order.id },
          data: { status: "SAMPLE_COLLECTION_SCHEDULED" },
        });

        // Add to order status history
        await tx.orderStatusHistory.create({
          data: {
            orderId: visit.order.id,
            status: "SAMPLE_COLLECTION_SCHEDULED",
            notes: `Agent ${agent.name} assigned to home visit`,
            createdBy: user.id,
          },
        });
      }

      return visit;
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