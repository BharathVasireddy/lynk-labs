import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { z } from "zod";

export async function POST(request: NextRequest) {
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

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const orderId = formData.get("orderId") as string;
    const notes = formData.get("notes") as string;

    if (!file || !orderId) {
      return NextResponse.json(
        { error: "File and order ID are required" },
        { status: 400 }
      );
    }

    // Validate file type and size
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF, JPG, and PNG files are allowed." },
        { status: 400 }
      );
    }

    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size too large. Maximum size is 10MB." },
        { status: 400 }
      );
    }

    // Check if order exists and is eligible for report upload
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        reports: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Check if order already has a report
    if (order.reports.length > 0) {
      return NextResponse.json(
        { error: "Order already has a report uploaded" },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads", "reports");
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `report_${orderId}_${timestamp}.${fileExtension}`;
    const filePath = join(uploadsDir, fileName);

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Create report record in database
    const report = await prisma.report.create({
      data: {
        orderId,
        fileName: file.name,
        fileUrl: `/uploads/reports/${fileName}`,
        fileSize: file.size,
        uploadedBy: session.user.id,
        uploadedAt: new Date(),
        isDelivered: false,
      },
      include: {
        order: {
          include: {
            user: {
              select: {
                name: true,
                phone: true,
              },
            },
            orderItems: {
              include: {
                test: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        uploader: {
          select: {
            name: true,
          },
        },
      },
    });

    // Update order status to indicate report is ready
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "REPORT_READY" },
    });

    // Add to order status history
    await prisma.orderStatusHistory.create({
      data: {
        orderId,
        status: "REPORT_READY",
        notes: notes || "Report uploaded by admin",
        createdBy: session.user.id,
      },
    });

    // TODO: Send notification to customer about report availability

    return NextResponse.json({
      success: true,
      message: "Report uploaded successfully",
      report,
    });
  } catch (error) {
    console.error("Error uploading report:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 