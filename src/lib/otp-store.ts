// Shared OTP store for WhatsApp authentication
// In production, this should be replaced with Redis or a database solution

interface OTPData {
  otp: string;
  expiresAt: number;
}

class OTPStore {
  private store = new Map<string, OTPData>();

  set(phoneNumber: string, otp: string, expiresAt: number): void {
    this.store.set(phoneNumber, { otp, expiresAt });
  }

  get(phoneNumber: string): OTPData | undefined {
    const data = this.store.get(phoneNumber);
    
    // Clean up expired OTPs
    if (data && Date.now() > data.expiresAt) {
      this.store.delete(phoneNumber);
      return undefined;
    }
    
    return data;
  }

  delete(phoneNumber: string): boolean {
    return this.store.delete(phoneNumber);
  }

  // Clean up expired OTPs periodically
  cleanup(): void {
    const now = Date.now();
    const entries = Array.from(this.store.entries());
    for (const [phoneNumber, data] of entries) {
      if (now > data.expiresAt) {
        this.store.delete(phoneNumber);
      }
    }
  }
}

// Create a singleton instance using global to ensure it persists across hot reloads
const globalForOTP = globalThis as unknown as {
  otpStore: OTPStore | undefined;
};

export const otpStore = globalForOTP.otpStore ?? new OTPStore();

if (typeof window === 'undefined') { // Only run on server
  globalForOTP.otpStore = otpStore;
  
  // Clean up expired OTPs every 5 minutes
  setInterval(() => {
    otpStore.cleanup();
  }, 5 * 60 * 1000);
} 