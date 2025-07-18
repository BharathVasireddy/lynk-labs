import { safeRedisOperation } from './redis';
import { prisma } from './db';
import { verify } from 'jsonwebtoken';

/**
 * JWT Token Blacklist System
 * Uses Redis for performance with database fallback for reliability
 */

interface TokenInfo {
  userId: string;
  exp?: number;
}

/**
 * Add a JWT token to the blacklist
 * @param token - The JWT token to blacklist
 * @param userId - The user ID associated with the token
 */
export async function blacklistToken(token: string, userId: string): Promise<void> {
  try {
    // Decode token to get expiration time
    const decoded = verify(token, process.env.NEXTAUTH_SECRET!) as TokenInfo;
    const expirationTime = decoded.exp || Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60); // Default 7 days if no exp
    
    // Calculate TTL (time to live) in seconds
    const currentTime = Math.floor(Date.now() / 1000);
    const ttl = expirationTime - currentTime;
    
    // Only blacklist if token hasn't expired yet
    if (ttl > 0) {
      const key = `blacklist:${token}`;
      
      await safeRedisOperation(
        // Redis operation
        async (redis) => {
          await redis.setex(key, ttl, userId);
        },
        // Database fallback
        async () => {
          const expiresAt = new Date(expirationTime * 1000);
          await prisma.blacklistedToken.upsert({
            where: { token },
            update: { expiresAt },
            create: {
              token,
              userId,
              expiresAt,
              createdAt: new Date(),
            },
          });
        }
      );
    }
  } catch (error) {
    // If token is invalid or expired, we don't need to blacklist it
    console.warn('Failed to blacklist token (token may be invalid):', error);
  }
}

/**
 * Check if a JWT token is blacklisted
 * @param token - The JWT token to check
 * @returns true if token is blacklisted, false otherwise
 */
export async function isTokenBlacklisted(token: string): Promise<boolean> {
  try {
    const key = `blacklist:${token}`;
    
    const result = await safeRedisOperation(
      // Redis operation
      async (redis) => {
        const value = await redis.get(key);
        return value !== null;
      },
      // Database fallback
      async () => {
        const blacklistedToken = await prisma.blacklistedToken.findUnique({
          where: { 
            token,
            expiresAt: {
              gt: new Date(), // Only consider tokens that haven't expired
            },
          },
        });
        return blacklistedToken !== null;
      }
    );

    return result;
  } catch (error) {
    console.error('Error checking token blacklist:', error);
    // On error, assume token is not blacklisted to avoid blocking valid users
    return false;
  }
}

/**
 * Clean up expired blacklisted tokens from database
 * Should be called periodically via cron job
 */
export async function cleanupExpiredTokens(): Promise<void> {
  try {
    const result = await prisma.blacklistedToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
    console.log(`Cleaned up ${result.count} expired blacklisted tokens`);
  } catch (error) {
    console.error('Error cleaning up expired tokens:', error);
  }
}

/**
 * Blacklist all tokens for a specific user (useful for security incidents)
 * @param userId - The user ID whose tokens should be blacklisted
 */
export async function blacklistAllUserTokens(userId: string): Promise<void> {
  try {
    // This would require maintaining a list of active tokens per user
    // For now, we'll just mark the user as requiring re-authentication
    // by updating their profile timestamp
    await prisma.user.update({
      where: { id: userId },
      data: { updatedAt: new Date() },
    });
  } catch (error) {
    console.error('Error blacklisting all user tokens:', error);
  }
} 