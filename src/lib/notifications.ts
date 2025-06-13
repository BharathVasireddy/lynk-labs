import { prisma } from "@/lib/db";

// Notification types
export type NotificationType = "SMS" | "EMAIL" | "WHATSAPP";
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
  userId: string;
  orderId?: string;
  homeVisitId?: string;
  type: NotificationType;
  event: NotificationEvent;
  recipient: string; // phone/email
  message: string;
  metadata?: Record<string, any>;
}

interface NotificationTemplate {
  sms: string;
  email: {
    subject: string;
    html: string;
  };
  whatsapp: string;
}

// Notification templates
const NOTIFICATION_TEMPLATES: Record<NotificationEvent, NotificationTemplate> = {
  ORDER_CONFIRMED: {
    sms: "Hi {{customerName}}, your order {{orderNumber}} has been confirmed! Total: ₹{{amount}}. Track your order at {{trackingUrl}}",
    email: {
      subject: "Order Confirmed - {{orderNumber}}",
      html: `
        <h2>Order Confirmed!</h2>
        <p>Hi {{customerName}},</p>
        <p>Your order <strong>{{orderNumber}}</strong> has been confirmed.</p>
        <p><strong>Total Amount:</strong> ₹{{amount}}</p>
        <p><strong>Tests Ordered:</strong></p>
        <ul>{{testsList}}</ul>
        <p>Track your order: <a href="{{trackingUrl}}">{{trackingUrl}}</a></p>
        <p>Thank you for choosing Lynk Labs!</p>
      `
    },
    whatsapp: "🎉 Order Confirmed!\n\nHi {{customerName}}, your order {{orderNumber}} has been confirmed!\n\nTotal: ₹{{amount}}\nTests: {{testsCount}} test(s)\n\nTrack: {{trackingUrl}}"
  },
  
  SAMPLE_COLLECTION_SCHEDULED: {
    sms: "Hi {{customerName}}, sample collection for order {{orderNumber}} is scheduled for {{date}} at {{time}}. Agent: {{agentName}} ({{agentPhone}})",
    email: {
      subject: "Sample Collection Scheduled - {{orderNumber}}",
      html: `
        <h2>Sample Collection Scheduled</h2>
        <p>Hi {{customerName}},</p>
        <p>Sample collection for your order <strong>{{orderNumber}}</strong> has been scheduled.</p>
        <p><strong>Date & Time:</strong> {{date}} at {{time}}</p>
        <p><strong>Agent:</strong> {{agentName}} ({{agentPhone}})</p>
        <p><strong>Address:</strong> {{address}}</p>
        <p>Please ensure you're available at the scheduled time.</p>
      `
    },
    whatsapp: "📅 Sample Collection Scheduled\n\nOrder: {{orderNumber}}\nDate: {{date}} at {{time}}\nAgent: {{agentName}} ({{agentPhone}})\n\nPlease be available!"
  },

  SAMPLE_COLLECTED: {
    sms: "Sample collected successfully for order {{orderNumber}}! Your reports will be ready in {{reportTime}}. We'll notify you once ready.",
    email: {
      subject: "Sample Collected - {{orderNumber}}",
      html: `
        <h2>Sample Collected Successfully!</h2>
        <p>Hi {{customerName}},</p>
        <p>Sample for order <strong>{{orderNumber}}</strong> has been collected successfully.</p>
        <p><strong>Expected Report Time:</strong> {{reportTime}}</p>
        <p>We'll notify you as soon as your reports are ready.</p>
      `
    },
    whatsapp: "✅ Sample Collected!\n\nOrder: {{orderNumber}}\nReports expected in: {{reportTime}}\n\nWe'll notify you once ready! 📊"
  },

  REPORT_READY: {
    sms: "🎉 Your test reports are ready! Order {{orderNumber}}. Download: {{reportUrl}} or visit our app to view your results.",
    email: {
      subject: "Test Reports Ready - {{orderNumber}}",
      html: `
        <h2>Your Test Reports Are Ready! 🎉</h2>
        <p>Hi {{customerName}},</p>
        <p>Your test reports for order <strong>{{orderNumber}}</strong> are now available.</p>
        <p><strong>Download Reports:</strong> <a href="{{reportUrl}}">Click here to download</a></p>
        <p>You can also view your reports in our mobile app or website.</p>
        <p>If you have any questions about your results, please consult with your healthcare provider.</p>
      `
    },
    whatsapp: "📊 Reports Ready!\n\nYour test reports for order {{orderNumber}} are ready!\n\nDownload: {{reportUrl}}\n\nConsult your doctor for any questions about results."
  },

  ORDER_COMPLETED: {
    sms: "Order {{orderNumber}} completed successfully! Thank you for choosing Lynk Labs. Rate your experience: {{ratingUrl}}",
    email: {
      subject: "Order Completed - {{orderNumber}}",
      html: `
        <h2>Order Completed Successfully! ✅</h2>
        <p>Hi {{customerName}},</p>
        <p>Your order <strong>{{orderNumber}}</strong> has been completed successfully.</p>
        <p>Thank you for choosing Lynk Labs for your diagnostic needs.</p>
        <p><strong>Rate your experience:</strong> <a href="{{ratingUrl}}">Share your feedback</a></p>
        <p>We look forward to serving you again!</p>
      `
    },
    whatsapp: "✅ Order Completed!\n\nThank you {{customerName}}! Order {{orderNumber}} is complete.\n\nRate us: {{ratingUrl}}\n\nWe appreciate your trust in Lynk Labs! 🙏"
  },

  ORDER_CANCELLED: {
    sms: "Order {{orderNumber}} has been cancelled. Refund will be processed within 3-5 business days. Contact support: {{supportPhone}}",
    email: {
      subject: "Order Cancelled - {{orderNumber}}",
      html: `
        <h2>Order Cancelled</h2>
        <p>Hi {{customerName}},</p>
        <p>Your order <strong>{{orderNumber}}</strong> has been cancelled.</p>
        <p><strong>Refund:</strong> Will be processed within 3-5 business days</p>
        <p>If you have any questions, please contact our support team at {{supportPhone}}</p>
      `
    },
    whatsapp: "❌ Order Cancelled\n\nOrder {{orderNumber}} cancelled.\nRefund: 3-5 business days\n\nSupport: {{supportPhone}}"
  },

  HOME_VISIT_SCHEDULED: {
    sms: "Home visit scheduled for {{date}} at {{time}}. Agent {{agentName}} will visit {{address}}. Contact: {{agentPhone}}",
    email: {
      subject: "Home Visit Scheduled",
      html: `
        <h2>Home Visit Scheduled</h2>
        <p>Hi {{customerName}},</p>
        <p>Your home visit has been scheduled for <strong>{{date}} at {{time}}</strong></p>
        <p><strong>Agent:</strong> {{agentName}} ({{agentPhone}})</p>
        <p><strong>Address:</strong> {{address}}</p>
      `
    },
    whatsapp: "🏠 Home Visit Scheduled\n\nDate: {{date}} at {{time}}\nAgent: {{agentName}} ({{agentPhone}})\nAddress: {{address}}"
  },

  HOME_VISIT_REMINDER: {
    sms: "Reminder: Home visit today at {{time}}. Agent {{agentName}} will arrive soon. Contact: {{agentPhone}}",
    email: {
      subject: "Home Visit Reminder - Today",
      html: `
        <h2>Home Visit Reminder</h2>
        <p>Hi {{customerName}},</p>
        <p>This is a reminder that your home visit is scheduled for today at <strong>{{time}}</strong></p>
        <p><strong>Agent:</strong> {{agentName}} ({{agentPhone}})</p>
      `
    },
    whatsapp: "⏰ Reminder: Home visit today at {{time}}\nAgent: {{agentName}} ({{agentPhone}})\nPlease be available!"
  },

  PAYMENT_RECEIVED: {
    sms: "Payment of ₹{{amount}} received for order {{orderNumber}}. Thank you! Your order is now confirmed.",
    email: {
      subject: "Payment Received - {{orderNumber}}",
      html: `
        <h2>Payment Received ✅</h2>
        <p>Hi {{customerName}},</p>
        <p>We have received your payment of <strong>₹{{amount}}</strong> for order {{orderNumber}}.</p>
        <p>Your order is now confirmed and will be processed shortly.</p>
      `
    },
    whatsapp: "💳 Payment Received!\n\n₹{{amount}} for order {{orderNumber}}\nYour order is now confirmed! ✅"
  },

  PAYMENT_FAILED: {
    sms: "Payment failed for order {{orderNumber}}. Please retry payment or contact support: {{supportPhone}}",
    email: {
      subject: "Payment Failed - {{orderNumber}}",
      html: `
        <h2>Payment Failed ❌</h2>
        <p>Hi {{customerName}},</p>
        <p>Payment for order <strong>{{orderNumber}}</strong> could not be processed.</p>
        <p>Please retry payment or contact our support team at {{supportPhone}}</p>
      `
    },
    whatsapp: "❌ Payment Failed\n\nOrder: {{orderNumber}}\nPlease retry payment or contact support: {{supportPhone}}"
  }
};

// Template rendering function
function renderTemplate(template: string, data: Record<string, any>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return data[key] || match;
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

// Email Service (using Resend, SendGrid, or similar)
export async function sendEmail(
  email: string, 
  subject: string, 
  html: string
): Promise<boolean> {
  try {
    // TODO: Implement actual email service integration
    console.log(`Email to ${email}: ${subject}`);
    console.log(`HTML: ${html}`);
    
    // In production, integrate with Resend, SendGrid, or other email service
    /*
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Lynk Labs <noreply@lynklabs.com>',
        to: [email],
        subject: subject,
        html: html,
      }),
    });
    */
    
    return true;
  } catch (error) {
    console.error("Email sending failed:", error);
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

// Main notification sending function
export async function sendNotification(data: NotificationData): Promise<boolean> {
  try {
    // Store notification in database
    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        orderId: data.orderId,
        homeVisitId: data.homeVisitId,
        type: data.type,
        event: data.event,
        recipient: data.recipient,
        message: data.message,
        metadata: data.metadata || {},
        status: "PENDING",
      }
    });

    let success = false;

    // Send notification based on type
    switch (data.type) {
      case "SMS":
        success = await sendSMS(data.recipient, data.message);
        break;
      case "EMAIL":
        const template = NOTIFICATION_TEMPLATES[data.event];
        success = await sendEmail(
          data.recipient,
          renderTemplate(template.email.subject, data.metadata || {}),
          renderTemplate(template.email.html, data.metadata || {})
        );
        break;
      case "WHATSAPP":
        success = await sendWhatsApp(data.recipient, data.message);
        break;
    }

    // Update notification status
    await prisma.notification.update({
      where: { id: notification.id },
      data: {
        status: success ? "SENT" : "FAILED",
        sentAt: success ? new Date() : null,
      }
    });

    return success;
  } catch (error) {
    console.error("Notification sending failed:", error);
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
      const template = NOTIFICATION_TEMPLATES[event];
      const message = renderTemplate(template.sms, templateData);
      
      await sendNotification({
        userId: order.user.id,
        orderId: order.id,
        type: "SMS",
        event,
        recipient: order.user.phone,
        message,
        metadata: templateData
      });
    }

    // Send Email notification
    if (preferences.email && order.user.email) {
      await sendNotification({
        userId: order.user.id,
        orderId: order.id,
        type: "EMAIL",
        event,
        recipient: order.user.email,
        message: "", // Email content is handled in the email service
        metadata: templateData
      });
    }

    // Send WhatsApp notification
    if (preferences.whatsapp && order.user.phone) {
      const template = NOTIFICATION_TEMPLATES[event];
      const message = renderTemplate(template.whatsapp, templateData);
      
      await sendNotification({
        userId: order.user.id,
        orderId: order.id,
        type: "WHATSAPP",
        event,
        recipient: order.user.phone,
        message,
        metadata: templateData
      });
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
        agent: true,
        address: true
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
      address: `${homeVisit.address.street}, ${homeVisit.address.city}, ${homeVisit.address.state} ${homeVisit.address.pincode}`,
      ...additionalData
    };

    // Send notifications (SMS, Email, WhatsApp)
    const user = homeVisit.order.user;
    
    if (user.phone) {
      const template = NOTIFICATION_TEMPLATES[event];
      const smsMessage = renderTemplate(template.sms, templateData);
      const whatsappMessage = renderTemplate(template.whatsapp, templateData);
      
      await Promise.all([
        sendNotification({
          userId: user.id,
          homeVisitId: homeVisit.id,
          type: "SMS",
          event,
          recipient: user.phone,
          message: smsMessage,
          metadata: templateData
        }),
        sendNotification({
          userId: user.id,
          homeVisitId: homeVisit.id,
          type: "WHATSAPP",
          event,
          recipient: user.phone,
          message: whatsappMessage,
          metadata: templateData
        })
      ]);
    }

    if (user.email) {
      await sendNotification({
        userId: user.id,
        homeVisitId: homeVisit.id,
        type: "EMAIL",
        event,
        recipient: user.email,
        message: "",
        metadata: templateData
      });
    }

  } catch (error) {
    console.error("Error sending home visit notification:", error);
  }
}

export async function sendWhatsAppMessage(to: string, message: string): Promise<boolean> {
  // Implementation of sendWhatsAppMessage
  return true; // Placeholder return, actual implementation needed
}

export async function sendOrderConfirmationWhatsApp(order: Order): Promise<boolean> {
  // Implementation of sendOrderConfirmationWhatsApp
  return true; // Placeholder return, actual implementation needed
}

export async function sendHomeVisitScheduledWhatsApp(homeVisit: HomeVisit): Promise<boolean> {
  // Implementation of sendHomeVisitScheduledWhatsApp
  return true; // Placeholder return, actual implementation needed
}

export async function sendReportReadyWhatsApp(order: Order): Promise<boolean> {
  // Implementation of sendReportReadyWhatsApp
  return true; // Placeholder return, actual implementation needed
}