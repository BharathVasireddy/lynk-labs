import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAuth } from "@/lib/auth-utils";

export async function POST(
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

    const { id: orderId } = params;
    const { content, isInternal } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "Note content is required" },
        { status: 400 }
      );
    }

    // Check if order exists
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true, orderNumber: true },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // For now, we'll store notes in a simple format
    // In a production app, you would have a dedicated notes table
    // This is a placeholder that returns the note data as if it was saved

    const newNote = {
      id: `note_${Date.now()}`,
      content: content.trim(),
      isInternal: isInternal !== false, // Default to internal
      createdAt: new Date().toISOString(),
      author: {
        name: user.name || "Admin User",
        role: user.role,
      },
    };

    // TODO: Implement actual note storage when you add notes table to schema
    // const savedNote = await prisma.orderNote.create({
    //   data: {
    //     orderId: orderId,
    //     content: content.trim(),
    //     isInternal: isInternal !== false,
    //     authorId: user.id,
    //   },
    //   include: {
    //     author: {
    //       select: {
    //         name: true,
    //         role: true,
    //       },
    //     },
    //   },
    // });

    // Add timeline entry for note addition
    // await prisma.timeline.create({
    //   data: {
    //     orderId: orderId,
    //     action: "Note Added",
    //     description: `${isInternal ? "Internal" : "Customer"} note added: ${content.substring(0, 50)}${content.length > 50 ? "..." : ""}`,
    //     timestamp: new Date(),
    //     actorId: user.id,
    //   },
    // });

    // Send notification to customer if note is not internal
    if (!isInternal) {
      // TODO: Implement customer notification
      // await sendCustomerNotification(order.orderNumber, content);
    }

    return NextResponse.json({
      success: true,
      note: newNote,
      message: "Note added successfully",
    });

  } catch (error) {
    console.error("Error adding note:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(
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

    const { id: orderId } = params;

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Check if order exists
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // TODO: Implement actual note retrieval when you add notes table to schema
    // const notes = await prisma.orderNote.findMany({
    //   where: { orderId: orderId },
    //   include: {
    //     author: {
    //       select: {
    //         name: true,
    //         role: true,
    //       },
    //     },
    //   },
    //   orderBy: {
    //     createdAt: 'desc',
    //   },
    // });

    // For now, return mock notes
    const mockNotes = [
      {
        id: "note1",
        content: "Customer requested early morning collection between 7-9 AM",
        isInternal: false,
        createdAt: new Date().toISOString(),
        author: {
          name: "Customer Service",
          role: "ADMIN",
        },
      },
      {
        id: "note2",
        content: "Payment verified successfully via Razorpay",
        isInternal: true,
        createdAt: new Date().toISOString(),
        author: {
          name: "System",
          role: "SYSTEM",
        },
      },
    ];

    return NextResponse.json({
      success: true,
      notes: mockNotes,
    });

  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 