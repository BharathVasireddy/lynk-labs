import Razorpay from "razorpay";

// Initialize Razorpay only if credentials are available
let razorpay: Razorpay | null = null;

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

export { razorpay };

export function isRazorpayConfigured(): boolean {
  return !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

export interface CreateOrderOptions {
  amount: number; // in paise
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}

export async function createRazorpayOrder(options: CreateOrderOptions) {
  try {
    const order = await razorpay!.orders.create({
      amount: options.amount,
      currency: options.currency || "INR",
      receipt: options.receipt,
      notes: options.notes,
    });

    return {
      success: true,
      order,
    };
  } catch (error) {
    console.error("Razorpay order creation failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export function getRazorpayConfig() {
  return {
    key: process.env.RAZORPAY_KEY_ID,
    name: "Lynk Labs",
    description: "Diagnostic Test Booking",
    image: "/images/logo.png",
    theme: {
      color: "#3B82F6",
    },
  };
} 