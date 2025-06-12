import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { otpStore } from "@/lib/otp-store";

const sendOTPSchema = z.object({
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
});

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
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

    // In production, integrate with WhatsApp Business API
    // For now, we'll simulate sending OTP
    console.log(`OTP for ${phoneNumber}: ${otp}`);

    // Simulate WhatsApp Business API call
    if (process.env.NODE_ENV === "production") {
      // TODO: Implement actual WhatsApp Business API integration
      // const whatsappResponse = await sendWhatsAppMessage(phoneNumber, otp);
    }

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully via WhatsApp",
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

// Helper function for WhatsApp Business API (to be implemented)
async function sendWhatsAppMessage(phoneNumber: string, otp: string) {
  // WhatsApp Business API integration
  const message = `Your Lynk Labs verification code is: ${otp}. This code will expire in 5 minutes. Do not share this code with anyone.`;
  
  // TODO: Implement actual WhatsApp Business API call
  // Example using WhatsApp Business API
  /*
  const response = await fetch(`https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: phoneNumber,
      type: 'text',
      text: { body: message }
    })
  });
  
  return response.json();
  */
  
  return { success: true };
}

 