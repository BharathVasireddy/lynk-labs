import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAuth } from "@/lib/auth-utils";

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

    // Get order details
    const order = await prisma.order.findUnique({
      where: { id: orderId },
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
              },
            },
          },
        },
        address: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Generate receipt HTML
    const receiptHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt - ${order.orderNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .order-info { margin-bottom: 20px; }
          .items { margin-bottom: 20px; }
          .total { font-weight: bold; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Lynk Labs</h1>
          <h2>Payment Receipt</h2>
        </div>
        
        <div class="order-info">
          <p><strong>Order Number:</strong> ${order.orderNumber}</p>
          <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
          <p><strong>Customer:</strong> ${order.user.name || 'N/A'}</p>
          <p><strong>Phone:</strong> ${order.user.phone}</p>
          <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
          ${order.paymentId ? `<p><strong>Payment ID:</strong> ${order.paymentId}</p>` : ''}
        </div>

        <div class="items">
          <h3>Tests Ordered</h3>
          <table>
            <thead>
              <tr>
                <th>Test Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.orderItems.map(item => `
                <tr>
                  <td>${item.test?.name || 'N/A'}</td>
                  <td>${item.quantity}</td>
                  <td>₹${item.price}</td>
                  <td>₹${item.quantity * item.price}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="total">
          <p>Subtotal: ₹${order.totalAmount}</p>
          ${order.discountAmount > 0 ? `<p>Discount: -₹${order.discountAmount}</p>` : ''}
          <p><strong>Total Paid: ₹${order.finalAmount}</strong></p>
        </div>

        <div style="margin-top: 30px; text-align: center; color: #666;">
          <p>Thank you for choosing Lynk Labs!</p>
        </div>
      </body>
      </html>
    `;

    return new NextResponse(receiptHtml, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="receipt-${order.orderNumber}.html"`,
      },
    });

  } catch (error) {
    console.error("Error generating receipt:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 