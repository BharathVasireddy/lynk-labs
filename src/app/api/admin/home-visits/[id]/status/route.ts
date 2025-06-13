import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const updateStatusSchema = z.object({
  status: z.enum(["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
  notes: z.string().optional(),
  otp: z.string().optional(),
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

    // Check if user is admin or agent
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!user || !["ADMIN", "HOME_VISIT_AGENT"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = updateStatusSchema.parse(body);

    // Check if home visit exists
    const homeVisit = await prisma.homeVisit.findUnique({
      where: { id: params.id },
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            status: true,
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

    // If user is agent, check if they are assigned to this visit
    if (user.role === "HOME_VISIT_AGENT" && homeVisit.agentId !== session.user.id) {
      return NextResponse.json(
        { error: "You are not assigned to this home visit" },
        { status: 403 }
      );
    }

    // Prepare update data
    const updateData: {
      status: string;
      updatedAt: Date;
      notes?: string;
      otp?: string;
      collectionTime?: Date;
    } = {
      status: validatedData.status,
      updatedAt: new Date(),
    };

    if (validatedData.notes) {
      updateData.notes = validatedData.notes;
    }

    if (validatedData.otp) {
      updateData.otp = validatedData.otp;
    }

    // Set collection time when status changes to COMPLETED
    if (validatedData.status === "COMPLETED") {
      updateData.collectionTime = new Date();
    }

    // Update home visit status
    const updatedHomeVisit = await prisma.$transaction(async (tx) => {
      // Update home visit
      const visit = await tx.homeVisit.update({
        where: { id: params.id },
        data: updateData,
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
            },
          },
        },
      });

      // Update order status based on home visit status
      let newOrderStatus = homeVisit.order.status;
      
      switch (validatedData.status) {
        case "IN_PROGRESS":
          newOrderStatus = "SAMPLE_COLLECTION_SCHEDULED";
          break;
        case "COMPLETED":
          newOrderStatus = "SAMPLE_COLLECTED";
          break;
        case "CANCELLED":
          newOrderStatus = "CANCELLED";
          break;
      }

      // Update order status if it changed
      if (newOrderStatus !== homeVisit.order.status) {
        await tx.order.update({
          where: { id: homeVisit.order.id },
          data: { status: newOrderStatus },
        });

        // Add to order status history
        await tx.orderStatusHistory.create({
          data: {
            orderId: homeVisit.order.id,
            status: newOrderStatus,
            notes: `Home visit status changed to ${validatedData.status}`,
            createdBy: session.user.id,
          },
        });
      }

      return visit;
    });

    // TODO: Send notifications based on status change
    // - Notify customer about status updates
    // - Notify admin about completion
    // - Send SMS/WhatsApp updates

    return NextResponse.json({
      success: true,
      message: "Home visit status updated successfully",
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