import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { NextRequest } from "next/server";
import * as jwt from "jsonwebtoken";

const prisma = new PrismaClient();

/**
 * Comprehensive Refresh Token Management System
 * Implements secure token rotation, device tracking, and automatic cleanup
 */

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  refreshExpiresIn: number;
}

export interface RefreshTokenInfo {
  id: string;
  token: string;
  userId: string;
  expiresAt: Date;
  isRevoked: boolean;
  deviceInfo?: string;
  clientIP?: string;
}

/**
 * Security configuration for tokens
 */
export const TOKEN_CONFIG = {
  ACCESS_TOKEN_EXPIRES_IN: '24h',           // 24 hours (reduced from 7 days)
  REFRESH_TOKEN_EXPIRES_IN: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
  MAX_REFRESH_TOKENS_PER_USER: 5,          // Limit active refresh tokens per user
  TOKEN_ROTATION_ENABLED: true,            // Enable automatic token rotation
  DEVICE_TRACKING_ENABLED: true,           // Track devices for security
} as const;

/**
 * Generate a cryptographically secure refresh token
 */
function generateRefreshToken(): string {
  return crypto.randomBytes(64).toString('hex');
}

/**
 * Extract device information from request headers
 */
function extractDeviceInfo(request: NextRequest): string {
  const userAgent = request.headers.get('user-agent') || 'unknown';
  // Parse basic device info (keep minimal for privacy)
  const deviceType = userAgent.includes('Mobile') ? 'mobile' : 'desktop';
  const browser = userAgent.includes('Chrome') ? 'chrome' : 
                  userAgent.includes('Firefox') ? 'firefox' : 
                  userAgent.includes('Safari') ? 'safari' : 'other';
  return `${deviceType}-${browser}`;
}

/**
 * Create a new access token
 */
export function createAccessToken(user: { id: string; email: string | null; phone: string | null; role: string }): string {
  return jwt.sign(
    { 
      userId: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role 
    },
    process.env.NEXTAUTH_SECRET!,
    { expiresIn: TOKEN_CONFIG.ACCESS_TOKEN_EXPIRES_IN }
  );
}

/**
 * Create a new refresh token and store it in the database
 */
export async function createRefreshToken(
  userId: string, 
  request: NextRequest
): Promise<string> {
  const token = generateRefreshToken();
  const expiresAt = new Date(Date.now() + TOKEN_CONFIG.REFRESH_TOKEN_EXPIRES_IN);
  const clientIP = request.ip || request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null;
  const deviceInfo = TOKEN_CONFIG.DEVICE_TRACKING_ENABLED ? extractDeviceInfo(request) : null;

  // Clean up old refresh tokens if user has too many
  await cleanupOldRefreshTokens(userId);

  // Create new refresh token
  await prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt,
      clientIP,
      deviceInfo,
    }
  });

  return token;
}

/**
 * Create a complete token pair (access + refresh)
 */
export async function createTokenPair(
  user: { id: string; email: string | null; phone: string | null; role: string },
  request: NextRequest
): Promise<TokenPair> {
  const accessToken = createAccessToken(user);
  const refreshToken = await createRefreshToken(user.id, request);

  return {
    accessToken,
    refreshToken,
    expiresIn: 24 * 60 * 60, // 24 hours in seconds
    refreshExpiresIn: 30 * 24 * 60 * 60, // 30 days in seconds
  };
}

/**
 * Validate and retrieve refresh token information
 */
export async function validateRefreshToken(token: string): Promise<RefreshTokenInfo | null> {
  try {
    const refreshToken = await prisma.refreshToken.findUnique({
      where: { token },
      select: {
        id: true,
        token: true,
        userId: true,
        expiresAt: true,
        isRevoked: true,
        deviceInfo: true,
        clientIP: true,
      }
    });

    if (!refreshToken) {
      return null;
    }

    // Check if token is expired
    if (refreshToken.expiresAt < new Date()) {
      // Clean up expired token
      await prisma.refreshToken.delete({
        where: { id: refreshToken.id }
      });
      return null;
    }

    // Check if token is revoked
    if (refreshToken.isRevoked) {
      return null;
    }

    return refreshToken;
  } catch (error) {
    console.error('Error validating refresh token:', error);
    return null;
  }
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(
  refreshTokenValue: string,
  request: NextRequest
): Promise<TokenPair | null> {
  try {
    // Validate the refresh token
    const refreshTokenInfo = await validateRefreshToken(refreshTokenValue);
    if (!refreshTokenInfo) {
      return null;
    }

    // Get user information
    const user = await prisma.user.findUnique({
      where: { id: refreshTokenInfo.userId },
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
      }
    });

    if (!user || !user.isActive) {
      // Revoke the refresh token if user is invalid/inactive
      await revokeRefreshToken(refreshTokenInfo.token);
      return null;
    }

    // Update last used timestamp
    await prisma.refreshToken.update({
      where: { id: refreshTokenInfo.id },
      data: { lastUsedAt: new Date() }
    });

    // Create new access token
    const accessToken = createAccessToken(user);

    let newRefreshToken = refreshTokenValue;

    // Token rotation: create new refresh token if enabled
    if (TOKEN_CONFIG.TOKEN_ROTATION_ENABLED) {
      // Revoke old refresh token
      await revokeRefreshToken(refreshTokenValue);
      
      // Create new refresh token
      newRefreshToken = await createRefreshToken(user.id, request);
    }

    return {
      accessToken,
      refreshToken: newRefreshToken,
      expiresIn: 24 * 60 * 60, // 24 hours in seconds
      refreshExpiresIn: 30 * 24 * 60 * 60, // 30 days in seconds
    };

  } catch (error) {
    console.error('Error refreshing access token:', error);
    return null;
  }
}

/**
 * Revoke a specific refresh token
 */
export async function revokeRefreshToken(token: string): Promise<boolean> {
  try {
    await prisma.refreshToken.update({
      where: { token },
      data: { 
        isRevoked: true,
        lastUsedAt: new Date()
      }
    });
    return true;
  } catch (error) {
    console.error('Error revoking refresh token:', error);
    return false;
  }
}

/**
 * Revoke all refresh tokens for a user (logout from all devices)
 */
export async function revokeAllUserRefreshTokens(userId: string): Promise<boolean> {
  try {
    await prisma.refreshToken.updateMany({
      where: { 
        userId,
        isRevoked: false
      },
      data: { 
        isRevoked: true,
        lastUsedAt: new Date()
      }
    });
    return true;
  } catch (error) {
    console.error('Error revoking all user refresh tokens:', error);
    return false;
  }
}

/**
 * Clean up old refresh tokens for a user (keep only the most recent ones)
 */
export async function cleanupOldRefreshTokens(userId: string): Promise<void> {
  try {
    // Get all active refresh tokens for the user
    const activeTokens = await prisma.refreshToken.findMany({
      where: { 
        userId,
        isRevoked: false,
        expiresAt: { gt: new Date() }
      },
      orderBy: { createdAt: 'desc' }
    });

    // If user has too many tokens, revoke the oldest ones
    if (activeTokens.length >= TOKEN_CONFIG.MAX_REFRESH_TOKENS_PER_USER) {
      const tokensToRevoke = activeTokens.slice(TOKEN_CONFIG.MAX_REFRESH_TOKENS_PER_USER - 1);
      
      for (const token of tokensToRevoke) {
        await revokeRefreshToken(token.token);
      }
    }
  } catch (error) {
    console.error('Error cleaning up old refresh tokens:', error);
  }
}

/**
 * Clean up expired and revoked refresh tokens (for scheduled cleanup)
 */
export async function cleanupExpiredRefreshTokens(): Promise<{ deleted: number }> {
  try {
    const result = await prisma.refreshToken.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } }, // Expired tokens
          { 
            isRevoked: true,
            lastUsedAt: { lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Revoked tokens older than 7 days
          }
        ]
      }
    });

    return { deleted: result.count };
  } catch (error) {
    console.error('Error cleaning up expired refresh tokens:', error);
    return { deleted: 0 };
  }
}

/**
 * Get all active refresh tokens for a user (for security dashboard)
 */
export async function getUserRefreshTokens(userId: string): Promise<RefreshTokenInfo[]> {
  try {
    const tokens = await prisma.refreshToken.findMany({
      where: { 
        userId,
        isRevoked: false,
        expiresAt: { gt: new Date() }
      },
      select: {
        id: true,
        token: true,
        userId: true,
        expiresAt: true,
        isRevoked: true,
        deviceInfo: true,
        clientIP: true,
      },
      orderBy: { lastUsedAt: 'desc' }
    });

    return tokens;
  } catch (error) {
    console.error('Error getting user refresh tokens:', error);
    return [];
  }
}

/**
 * Security audit: Check for suspicious refresh token activity
 */
export async function auditRefreshTokenSecurity(userId: string): Promise<{
  totalActiveTokens: number;
  uniqueDevices: number;
  uniqueIPs: number;
  suspiciousActivity: boolean;
  recommendations: string[];
}> {
  try {
    const tokens = await getUserRefreshTokens(userId);
    const uniqueDevices = new Set(tokens.map(t => t.deviceInfo).filter(Boolean)).size;
    const uniqueIPs = new Set(tokens.map(t => t.clientIP).filter(Boolean)).size;
    
    const suspiciousActivity = tokens.length > 10 || uniqueIPs > 5;
    const recommendations: string[] = [];

    if (tokens.length > 5) {
      recommendations.push("Consider revoking unused devices");
    }
    
    if (uniqueIPs > 3) {
      recommendations.push("Multiple IP addresses detected - review for unauthorized access");
    }

    return {
      totalActiveTokens: tokens.length,
      uniqueDevices,
      uniqueIPs,
      suspiciousActivity,
      recommendations
    };
  } catch (error) {
    console.error('Error auditing refresh token security:', error);
    return {
      totalActiveTokens: 0,
      uniqueDevices: 0,
      uniqueIPs: 0,
      suspiciousActivity: false,
      recommendations: []
    };
  }
} 