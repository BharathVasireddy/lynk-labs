import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";

// Types for better type safety
interface User {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
}

interface Order {
  id: string;
  orderNumber: string;
  finalAmount: number;
  user: User;
  orderItems: Array<{
    test: {
      name: string;
    };
  }>;
}

interface HomeVisit {
  id: string;
  scheduledDate: Date;
  scheduledTime: string;
  status: string;
  order: {
    orderNumber: string;
    user: {
      name: string | null;
      phone: string;
    };
  };
  agent?: {
    name: string | null;
    phone: string;
  } | null;
}

// Notification types
export type NotificationType = "EMAIL";
export type NotificationEvent = 
  | "ORDER_CONFIRMED"
  | "SAMPLE_COLLECTION_SCHEDULED"
  | "SAMPLE_COLLECTED"
  | "REPORT_READY"
  | "ORDER_COMPLETED"
  | "ORDER_CANCELLED"
  | "HOME_VISIT_SCHEDULED"
  | "HOME_VISIT_REMINDER"
  | "PAYMENT_RECEIVED"
  | "PAYMENT_FAILED";

interface NotificationData {
  customerName: string;
  orderNumber: string;
  amount?: number;
  testsCount?: number;
  trackingUrl?: string;
  date?: string;
  time?: string;
  agentName?: string;
  agentPhone?: string;
  reportTime?: string;
  reportUrl?: string;
  ratingUrl?: string;
  supportPhone?: string;
  address?: string;
}

// Notification templates
const templates: Record<string, NotificationTemplate> = {
  orderConfirmed: {
    email: `
      <h2>🎉 Order Confirmed!</h2>
      <p>Hi {{customerName}},</p>
      <p>Your order <strong>{{orderNumber}}</strong> has been confirmed!</p>
      <ul>
        <li><strong>Total:</strong> ₹{{amount}}</li>
        <li><strong>Tests:</strong> {{testsCount}} test(s)</li>
      </ul>
      <p><a href="{{trackingUrl}}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Track Your Order</a></p>
      <p>Thank you for choosing Lynk Labs!</p>
    `
  },
  
  sampleCollectionScheduled: {
    email: `
      <h2>📅 Sample Collection Scheduled</h2>
      <p>Hi {{customerName}},</p>
      <p>Your sample collection has been scheduled:</p>
      <ul>
        <li><strong>Order:</strong> {{orderNumber}}</li>
        <li><strong>Date & Time:</strong> {{date}} at {{time}}</li>
        <li><strong>Agent:</strong> {{agentName}} ({{agentPhone}})</li>
      </ul>
      <p>Please be available at the scheduled time!</p>
    `
  },
  
  sampleCollected: {
    email: `
      <h2>✅ Sample Collected!</h2>
      <p>Hi {{customerName}},</p>
      <p>Your sample for order <strong>{{orderNumber}}</strong> has been collected successfully!</p>
      <p>Reports are expected in: <strong>{{reportTime}}</strong></p>
      <p>We'll notify you once your reports are ready! 📊</p>
    `
  },
  
  reportsReady: {
    email: `
      <h2>📊 Your Reports Are Ready!</h2>
      <p>Hi {{customerName}},</p>
      <p>Your test reports for order <strong>{{orderNumber}}</strong> are now ready!</p>
      <p><a href="{{reportUrl}}" style="background: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Download Reports</a></p>
      <p>Please consult your doctor for any questions about the results.</p>
    `
  },
  
  orderCompleted: {
    email: `
      <h2>✅ Order Completed!</h2>
      <p>Hi {{customerName}},</p>
      <p>Thank you! Your order <strong>{{orderNumber}}</strong> has been completed successfully.</p>
      <p><a href="{{ratingUrl}}" style="background: #ffc107; color: black; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Rate Your Experience</a></p>
      <p>We appreciate your trust in Lynk Labs! 🙏</p>
    `
  },
  
  orderCancelled: {
    email: `
      <h2>❌ Order Cancelled</h2>
      <p>Hi {{customerName}},</p>
      <p>Your order <strong>{{orderNumber}}</strong> has been cancelled.</p>
      <p>Refund will be processed within 3-5 business days.</p>
      <p>For any queries, contact support: {{supportPhone}}</p>
    `
  },
  
  homeVisitScheduled: {
    email: `
      <h2>🏠 Home Visit Scheduled</h2>
      <p>Hi {{customerName}},</p>
      <p>Your home visit has been scheduled:</p>
      <ul>
        <li><strong>Date & Time:</strong> {{date}} at {{time}}</li>
        <li><strong>Agent:</strong> {{agentName}} ({{agentPhone}})</li>
        <li><strong>Address:</strong> {{address}}</li>
      </ul>
    `
  },
  
  homeVisitReminder: {
    email: `
      <h2>⏰ Home Visit Reminder</h2>
      <p>Hi {{customerName}},</p>
      <p>This is a reminder that your home visit is scheduled for today at <strong>{{time}}</strong>.</p>
      <p>Agent: {{agentName}} ({{agentPhone}})</p>
      <p>Please be available!</p>
    `
  },
  
  paymentReceived: {
    email: `
      <h2>💳 Payment Received!</h2>
      <p>Hi {{customerName}},</p>
      <p>We have received your payment of <strong>₹{{amount}}</strong> for order <strong>{{orderNumber}}</strong>.</p>
      <p>Your order is now confirmed! ✅</p>
    `
  },
  
  paymentFailed: {
    email: `
      <h2>❌ Payment Failed</h2>
      <p>Hi {{customerName}},</p>
      <p>Payment for order <strong>{{orderNumber}}</strong> could not be processed.</p>
      <p>Please retry payment or contact support: {{supportPhone}}</p>
    `
  }
};

// Template replacement function
function replaceTemplate(template: string, data: NotificationData): string {
  let result = template;
  Object.entries(data).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    result = result.replace(new RegExp(placeholder, 'g'), String(value || ''));
  });
  return result;
}

// Main notification function
export async function sendNotification(
  type: string,
  user: User,
  data: NotificationData,
  channels: NotificationType[] = ["EMAIL"]
): Promise<{ email?: boolean }> {
  const template = templates[type];
  if (!template) {
    throw new Error(`Unknown notification type: ${type}`);
  }

  const results: { email?: boolean } = {};

  // Send Email
  if (channels.includes("EMAIL") && user.email) {
    const emailContent = replaceTemplate(template.email, data);
    const subject = getEmailSubject(type, data);
    results.email = await sendEmail(user.email, subject, emailContent);
  }

  return results;
}

// Helper function to get email subject
function getEmailSubject(type: string, data: NotificationData): string {
  const subjects: Record<string, string> = {
    orderConfirmed: `Order Confirmed - ${data.orderNumber}`,
    sampleCollectionScheduled: `Sample Collection Scheduled - ${data.orderNumber}`,
    sampleCollected: `Sample Collected - ${data.orderNumber}`,
    reportsReady: `Reports Ready - ${data.orderNumber}`,
    orderCompleted: `Order Completed - ${data.orderNumber}`,
    orderCancelled: `Order Cancelled - ${data.orderNumber}`,
    homeVisitScheduled: `Home Visit Scheduled - ${data.orderNumber}`,
    homeVisitReminder: `Home Visit Reminder - Today`,
    paymentReceived: `Payment Received - ${data.orderNumber}`,
    paymentFailed: `Payment Failed - ${data.orderNumber}`
  };
  
  return subjects[type] || `Lynk Labs Notification`;
}

// Convenience functions for common notifications
export async function notifyOrderConfirmed(order: Order) {
  return sendNotification("orderConfirmed", order.user, {
    customerName: order.user.name || "Customer",
    orderNumber: order.orderNumber,
    amount: order.finalAmount,
    testsCount: 1, // TODO: Calculate actual test count
    trackingUrl: `${process.env.APP_URL}/orders/${order.id}`
  });
}

export async function notifyReportsReady(order: Order, reportUrl: string) {
  return sendNotification("reportsReady", order.user, {
    customerName: order.user.name || "Customer",
    orderNumber: order.orderNumber,
    reportUrl
  });
}

export async function notifyHomeVisitScheduled(homeVisit: HomeVisit) {
  return sendNotification("homeVisitScheduled", homeVisit.order.user, {
    customerName: homeVisit.order.user.name || "Customer",
    orderNumber: homeVisit.order.orderNumber,
    date: homeVisit.scheduledDate.toLocaleDateString(),
    time: homeVisit.scheduledTime,
    agentName: homeVisit.agent?.name || "Agent",
    agentPhone: homeVisit.agent?.phone || "N/A"
  });
}

// SMS Service (using Twilio or similar)
export async function sendSMS(phone: string, message: string): Promise<boolean> {
  try {
    // TODO: Implement actual SMS service integration
    // For now, just log the SMS
    console.log(`SMS to ${phone}: ${message}`);
    
    // In production, integrate with Twilio, AWS SNS, or other SMS service
    /*
    const response = await fetch('https://api.twilio.com/2010-04-01/Accounts/YOUR_ACCOUNT_SID/Messages.json', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${TWILIO_SID}:${TWILIO_TOKEN}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: TWILIO_PHONE_NUMBER,
        To: phone,
        Body: message,
      }),
    });
    */
    
    return true;
  } catch (error) {
    console.error("SMS sending failed:", error);
    return false;
  }
}

// WhatsApp Service (using WhatsApp Business API)
export async function sendWhatsApp(phone: string, message: string): Promise<boolean> {
  try {
    // TODO: Implement actual WhatsApp service integration
    console.log(`WhatsApp to ${phone}: ${message}`);
    
    // In production, integrate with WhatsApp Business API
    /*
    const response = await fetch(`https://graph.facebook.com/v17.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: phone,
        type: 'text',
        text: { body: message },
      }),
    });
    */
    
    return true;
  } catch (error) {
    console.error("WhatsApp sending failed:", error);
    return false;
  }
}

// Helper function to send order-related notifications
export async function sendOrderNotification(
  orderId: string,
  event: NotificationEvent,
  additionalData?: Record<string, any>
): Promise<void> {
  try {
    // Get order details
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        orderItems: {
          include: {
            test: true
          }
        },
        homeVisit: {
          include: {
            agent: true
          }
        }
      }
    });

    if (!order) {
      console.error("Order not found for notification:", orderId);
      return;
    }

    // Prepare template data
    const templateData = {
      customerName: order.user.name || "Customer",
      orderNumber: order.orderNumber,
      amount: order.finalAmount.toString(),
      testsCount: order.orderItems.length.toString(),
      testsList: order.orderItems.map(item => `<li>${item.test.name}</li>`).join(""),
      trackingUrl: `${process.env.NEXTAUTH_URL}/orders/${order.id}`,
      reportUrl: `${process.env.NEXTAUTH_URL}/orders/${order.id}/reports`,
      ratingUrl: `${process.env.NEXTAUTH_URL}/orders/${order.id}/feedback`,
      supportPhone: process.env.SUPPORT_PHONE || "+91-9999999999",
      ...additionalData
    };

    // Get notification preferences (default to all enabled)
    const preferences = {
      sms: true,
      email: !!order.user.email,
      whatsapp: true
    };

    // Send SMS notification
    if (preferences.sms && order.user.phone) {
      const template = templates[event];
      const message = replaceTemplate(template.email, templateData);
      
      await sendNotification(event, order.user, templateData, ["EMAIL"]);
    }

    // Send Email notification
    if (preferences.email && order.user.email) {
      await sendNotification(event, order.user, templateData, ["EMAIL"]);
    }

    // Send WhatsApp notification
    if (preferences.whatsapp && order.user.phone) {
      const template = templates[event];
      const message = replaceTemplate(template.email, templateData);
      
      await sendNotification(event, order.user, templateData, ["EMAIL"]);
    }

  } catch (error) {
    console.error("Error sending order notification:", error);
  }
}

// Helper function to send home visit notifications
export async function sendHomeVisitNotification(
  homeVisitId: string,
  event: NotificationEvent,
  additionalData?: Record<string, any>
): Promise<void> {
  try {
    const homeVisit = await prisma.homeVisit.findUnique({
      where: { id: homeVisitId },
      include: {
        order: {
          include: {
            user: true
          }
        },
        agent: true
      }
    });

    if (!homeVisit) {
      console.error("Home visit not found for notification:", homeVisitId);
      return;
    }

    const templateData = {
      customerName: homeVisit.order.user.name || "Customer",
      orderNumber: homeVisit.order.orderNumber,
      date: homeVisit.scheduledDate.toLocaleDateString('en-IN'),
      time: homeVisit.scheduledDate.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      agentName: homeVisit.agent?.name || "Agent",
      agentPhone: homeVisit.agent?.phone || "",
      ...additionalData
    };

    // Send notifications (SMS, Email, WhatsApp)
    const user = homeVisit.order.user;
    
    if (user.phone) {
      await sendNotification(event, user, templateData, ["EMAIL"]);
    }

    if (user.email) {
      await sendNotification(event, user, templateData, ["EMAIL"]);
    }

  } catch (error) {
    console.error("Error sending home visit notification:", error);
  }
}

export async function sendWhatsAppMessage(to: string, message: string): Promise<boolean> {
  try {
    // TODO: Implement actual WhatsApp API integration
    console.log(`WhatsApp message to ${to}: ${message}`);
    return true;
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    return false;
  }
}

export async function sendOrderConfirmationWhatsApp(order: Order): Promise<boolean> {
  try {
    const message = `Order Confirmed! Your order #${order.orderNumber} for ₹${order.finalAmount} has been confirmed. We'll contact you soon for sample collection.`;
    return await sendWhatsAppMessage(order.user.phone, message);
  } catch (error) {
    console.error("Error sending order confirmation WhatsApp:", error);
    return false;
  }
}

export async function sendHomeVisitScheduledWhatsApp(homeVisit: HomeVisit): Promise<boolean> {
  try {
    const message = `Home Visit Scheduled! Your sample collection for order #${homeVisit.order.orderNumber} is scheduled for ${homeVisit.scheduledDate.toLocaleDateString()} at ${homeVisit.scheduledTime}.`;
    return await sendWhatsAppMessage(homeVisit.order.user.phone, message);
  } catch (error) {
    console.error("Error sending home visit scheduled WhatsApp:", error);
    return false;
  }
}

export async function sendReportReadyWhatsApp(order: Order): Promise<boolean> {
  try {
    const message = `Report Ready! Your test reports for order #${order.orderNumber} are now available. Please check your account to download.`;
    return await sendWhatsAppMessage(order.user.phone, message);
  } catch (error) {
    console.error("Error sending report ready WhatsApp:", error);
    return false;
  }
}