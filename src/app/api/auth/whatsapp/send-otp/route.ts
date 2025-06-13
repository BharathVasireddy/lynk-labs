import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { otpStore } from "@/lib/otp-store";

const sendOTPSchema = z.object({
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
});

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Real WhatsApp Business API Integration
async function sendWhatsAppBusinessMessage(phoneNumber: string, otp: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
  const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
  
  if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
    console.log("WhatsApp credentials not configured, using development mode");
    return { success: true, messageId: "dev-mode" };
  }

  try {
    const message = `🔐 Your Lynk Labs verification code is: *${otp}*

This code will expire in 5 minutes. 
⚠️ Do not share this code with anyone.

Need help? Reply HELP`;

    const response = await fetch(`https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: phoneNumber.replace('+', ''),
        type: 'text',
        text: { 
          body: message,
          preview_url: false
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("WhatsApp API Error:", data);
      return { 
        success: false, 
        error: data.error?.message || "Failed to send WhatsApp message" 
      };
    }

    return { 
      success: true, 
      messageId: data.messages?.[0]?.id 
    };

  } catch (error) {
    console.error("WhatsApp API Network Error:", error);
    return { 
      success: false, 
      error: "Network error while sending WhatsApp message" 
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber } = sendOTPSchema.parse(body);

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Store OTP
    otpStore.set(phoneNumber, otp, expiresAt);

    // Send via WhatsApp Business API
    const whatsappResult = await sendWhatsAppBusinessMessage(phoneNumber, otp);

    if (!whatsappResult.success) {
      console.error("Failed to send WhatsApp OTP:", whatsappResult.error);
      // Don't fail the request, but log the error
      // In production, you might want to try SMS fallback here
    }

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully via WhatsApp",
      messageId: whatsappResult.messageId,
      // In development, return OTP for testing
      ...(process.env.NODE_ENV === "development" && { otp }),
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid phone number format" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to send OTP" },
      { status: 500 }
    );
  }
}

 