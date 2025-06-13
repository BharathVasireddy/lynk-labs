import { NextRequest, NextResponse } from "next/server";

const WEBHOOK_VERIFY_TOKEN = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;

// Webhook verification (GET request from Meta)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
    console.log("WhatsApp webhook verified successfully");
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse("Forbidden", { status: 403 });
}

// Webhook events (POST request from Meta)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Log incoming webhook for debugging
    console.log("WhatsApp Webhook received:", JSON.stringify(body, null, 2));

    // Process webhook events
    if (body.object === "whatsapp_business_account") {
      for (const entry of body.entry || []) {
        for (const change of entry.changes || []) {
          if (change.field === "messages") {
            await processMessageEvent(change.value);
          }
        }
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("WhatsApp webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}

async function processMessageEvent(messageData: any) {
  try {
    // Handle message status updates
    if (messageData.statuses) {
      for (const status of messageData.statuses) {
        console.log(`Message ${status.id} status: ${status.status}`);
        
        // You can store message delivery status in database here
        // await updateMessageStatus(status.id, status.status);
      }
    }

    // Handle incoming messages (for customer support)
    if (messageData.messages) {
      for (const message of messageData.messages) {
        console.log(`Incoming message from ${message.from}: ${message.text?.body}`);
        
        // Handle customer replies
        await handleIncomingMessage(message);
      }
    }
  } catch (error) {
    console.error("Error processing message event:", error);
  }
}

async function handleIncomingMessage(message: any) {
  const from = message.from;
  const text = message.text?.body?.toLowerCase();

  // Handle common customer queries
  if (text?.includes("help")) {
    await sendHelpMessage(from);
  } else if (text?.includes("status")) {
    await sendOrderStatusInfo(from);
  } else if (text?.includes("cancel")) {
    await sendCancellationInfo(from);
  }
  // Add more automated responses as needed
}

async function sendHelpMessage(phoneNumber: string) {
  const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
  const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) return;

  const helpMessage = `🆘 *Lynk Labs Help*

How can we assist you?

📋 *Common Commands:*
• Reply "STATUS" - Check your order status
• Reply "CANCEL" - Cancellation information
• Reply "SUPPORT" - Talk to our team

📞 *Contact Us:*
• Call: +91-XXXX-XXXX
• Email: support@lynklabs.com

🕒 *Support Hours:*
Monday - Saturday: 9 AM - 6 PM`;

  try {
    await fetch(`https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: phoneNumber,
        type: 'text',
        text: { body: helpMessage }
      })
    });
  } catch (error) {
    console.error("Error sending help message:", error);
  }
}

async function sendOrderStatusInfo(phoneNumber: string) {
  // Implementation for order status lookup
  // You would query the database for orders by phone number
  console.log(`Order status requested by ${phoneNumber}`);
}

async function sendCancellationInfo(phoneNumber: string) {
  const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
  const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) return;

  const cancelMessage = `❌ *Order Cancellation*

To cancel your order:

1️⃣ Visit: lynklabs.com/orders
2️⃣ Login with your phone number
3️⃣ Click "Cancel Order"

⏰ *Cancellation Policy:*
• Free cancellation up to 2 hours before sample collection
• Refund processed within 3-5 business days

Need immediate help? Call +91-XXXX-XXXX`;

  try {
    await fetch(`https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: phoneNumber,
        type: 'text',
        text: { body: cancelMessage }
      })
    });
  } catch (error) {
    console.error("Error sending cancellation info:", error);
  }
} 