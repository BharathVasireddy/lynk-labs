import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAuth } from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "csv";
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    // Build where clause (same as main orders API)
    const where: any = {};

    if (status && status !== "all") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } },
        { user: { phone: { contains: search } } },
        { user: { email: { contains: search, mode: "insensitive" } } },
      ];
    }

    // Get all matching orders
    const orders = await prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            phone: true,
            email: true,
          },
        },
        orderItems: {
          include: {
            test: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
        homeVisit: {
          include: {
            agent: {
              select: {
                name: true,
                phone: true,
              },
            },
          },
        },
        reports: {
          select: {
            fileName: true,
            isDelivered: true,
            deliveredAt: true,
          },
        },
        address: {
          select: {
            street: true,
            city: true,
            state: true,
            pincode: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format data for export
    const exportData = orders.map(order => ({
      orderNumber: order.orderNumber,
      status: order.status,
      customerName: order.user.name || "N/A",
      customerPhone: order.user.phone,
      customerEmail: order.user.email || "N/A",
      tests: order.orderItems.map(item => `${item.test.name} (${item.test.code})`).join(", "),
      testCount: order.orderItems.length,
      totalAmount: order.totalAmount,
      discountAmount: order.discountAmount,
      finalAmount: order.finalAmount,
      paymentMethod: order.paymentMethod,
      paymentId: order.paymentId || "N/A",
      couponCode: order.couponCode || "N/A",
      address: `${order.address?.street}, ${order.address?.city}, ${order.address?.state} - ${order.address?.pincode}`,
      homeVisitStatus: order.homeVisit?.status || "N/A",
      homeVisitDate: order.homeVisit?.scheduledDate || "N/A",
      agentName: order.homeVisit?.agent?.name || "N/A",
      agentPhone: order.homeVisit?.agent?.phone || "N/A",
      reportsCount: order.reports.length,
      reportsDelivered: order.reports.filter(r => r.isDelivered).length,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));

    switch (format.toLowerCase()) {
      case "csv":
        return generateCSV(exportData);
      case "xlsx":
        return generateExcel(exportData);
      case "pdf":
        return generatePDF(exportData);
      case "json":
        return generateJSON(exportData);
      default:
        return NextResponse.json(
          { error: "Unsupported format" },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error("Error exporting orders:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function generateCSV(data: any[]) {
  if (data.length === 0) {
    return NextResponse.json(
      { error: "No data to export" },
      { status: 400 }
    );
  }

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes in CSV
        if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(",")
    )
  ].join("\n");

  return new NextResponse(csvContent, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="orders-export-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  });
}

function generateExcel(data: any[]) {
  // For Excel export, you would typically use a library like 'xlsx'
  // For now, return CSV format with Excel MIME type
  const csv = generateCSV(data);
  
  return new NextResponse(csv.body, {
    headers: {
      "Content-Type": "application/vnd.ms-excel",
      "Content-Disposition": `attachment; filename="orders-export-${new Date().toISOString().split('T')[0]}.xlsx"`,
    },
  });
}

function generatePDF(data: any[]) {
  // For PDF export, you would use a library like 'jspdf' or 'puppeteer'
  // For now, return a simple text format
  const content = `ORDERS EXPORT REPORT\nGenerated: ${new Date().toISOString()}\n\n${
    data.map(order => 
      `Order: ${order.orderNumber}\nCustomer: ${order.customerName}\nPhone: ${order.customerPhone}\nStatus: ${order.status}\nAmount: ₹${order.finalAmount}\n\n`
    ).join("")
  }`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="orders-export-${new Date().toISOString().split('T')[0]}.pdf"`,
    },
  });
}

function generateJSON(data: any[]) {
  return NextResponse.json({
    exportData: data,
    metadata: {
      exportedAt: new Date().toISOString(),
      totalRecords: data.length,
      format: "json",
    },
  }, {
    headers: {
      "Content-Disposition": `attachment; filename="orders-export-${new Date().toISOString().split('T')[0]}.json"`,
    },
  });
} 