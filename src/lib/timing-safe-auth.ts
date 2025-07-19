import * as bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Timing-Safe Authentication Utilities
 * Prevents timing attacks by ensuring consistent response times
 * regardless of whether users exist or authentication succeeds/fails
 */

// Dummy hash for timing consistency when user doesn't exist
const DUMMY_HASH = "$2a$12$dummy.hash.for.timing.consistency.dummy.hash.for.timing.consistency";

/**
 * Constant-time user lookup with consistent query patterns
 * Always performs the same database operations regardless of input type
 */
export async function timingSafeUserLookup(identifier: string): Promise<{
  id: string;
  email: string | null;
  phone: string | null;
  name: string | null;
  password: string | null;
  role: string;
  isActive: boolean;
} | null> {
  try {
    // Always use the same query pattern to prevent timing differences
    // Query by both email and phone regardless of input format
    const normalizedIdentifier = identifier.toLowerCase().trim();
    
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: normalizedIdentifier },
          { phone: identifier.trim() } // Don't lowercase phone numbers
        ],
        isActive: true
      },
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        password: true,
        role: true,
        isActive: true
      }
    });

    return user;
  } catch (error) {
    console.error("Error in timing-safe user lookup:", error);
    return null;
  }
}

/**
 * Constant-time password verification
 * Always performs bcrypt comparison even if user doesn't exist
 * to prevent timing attacks through password hashing time differences
 */
export async function timingSafePasswordVerify(
  password: string,
  userHash: string | null
): Promise<boolean> {
  try {
    // Always perform bcrypt comparison to maintain consistent timing
    // Use dummy hash if user doesn't exist or has no password
    const hashToCompare = userHash || DUMMY_HASH;
    
    const isValid = await bcrypt.compare(password, hashToCompare);
    
    // Only return true if user actually exists AND password is valid
    return userHash !== null && isValid;
  } catch (error) {
    console.error("Error in timing-safe password verification:", error);
    return false;
  }
}

/**
 * Artificial delay to mask natural timing variations
 * Adds consistent base delay to normalize response times
 */
export async function addTimingJitter(baseDelayMs: number = 50): Promise<void> {
  // Add small random jitter (±25ms) to prevent timing pattern analysis
  const jitter = Math.random() * 50 - 25;
  const totalDelay = Math.max(10, baseDelayMs + jitter);
  
  await new Promise(resolve => setTimeout(resolve, totalDelay));
}

/**
 * Complete timing-safe authentication check
 * Combines user lookup, password verification, and timing normalization
 */
export async function timingSafeAuthenticate(
  identifier: string, 
  password: string
): Promise<{
  success: boolean;
  user?: {
    id: string;
    email: string | null;
    phone: string | null;
    name: string | null;
    role: string;
    isActive: boolean;
  };
}> {
  const startTime = Date.now();
  
  try {
    // Step 1: Timing-safe user lookup
    const user = await timingSafeUserLookup(identifier);
    
    // Step 2: Always verify password (even if user doesn't exist)
    const isPasswordValid = await timingSafePasswordVerify(password, user?.password || null);
    
    // Step 3: Determine authentication result
    const isAuthenticated = user !== null && isPasswordValid && user.isActive;
    
    // Step 4: Add timing jitter to mask execution time variations
    const elapsed = Date.now() - startTime;
    const minResponseTime = 150; // Minimum response time in ms
    if (elapsed < minResponseTime) {
      await addTimingJitter(minResponseTime - elapsed);
    }
    
    if (isAuthenticated && user) {
      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          name: user.name,
          role: user.role,
          isActive: user.isActive
        }
      };
    }
    
    return { success: false };
    
  } catch (error) {
    console.error("Error in timing-safe authentication:", error);
    
    // Even on error, maintain consistent timing
    const elapsed = Date.now() - startTime;
    if (elapsed < 150) {
      await addTimingJitter(150 - elapsed);
    }
    
    return { success: false };
  }
}

/**
 * Check if an identifier (email/phone) exists in the system
 * Returns consistent timing regardless of whether user exists
 */
export async function timingSafeUserExists(identifier: string): Promise<boolean> {
  const startTime = Date.now();
  
  try {
    const user = await timingSafeUserLookup(identifier);
    
    // Always add consistent delay
    const elapsed = Date.now() - startTime;
    const minResponseTime = 100;
    if (elapsed < minResponseTime) {
      await addTimingJitter(minResponseTime - elapsed);
    }
    
    return user !== null;
  } catch (error) {
    console.error("Error checking user existence:", error);
    
    // Maintain timing even on error
    const elapsed = Date.now() - startTime;
    if (elapsed < 100) {
      await addTimingJitter(100 - elapsed);
    }
    
    return false;
  }
} 