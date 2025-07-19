import { NextRequest, NextResponse } from "next/server";
import { cleanupExpiredRefreshTokens } from "@/lib/refresh-token";
import { verifyAuth } from "@/lib/auth-utils";

/**
 * Cleanup expired tokens cron job
 * Removes expired refresh tokens and blacklisted tokens to keep database clean
 * Should be called periodically (daily/weekly)
 */
export async function POST(request: NextRequest) {
  try {
    // Verify this is an authorized cron request
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    // Check for admin user or cron secret
    let isAuthorized = false;
    
    if (cronSecret && authHeader === `Bearer ${cronSecret}`) {
      isAuthorized = true;
    } else {
      // Allow admin users to trigger manual cleanup
      const user = await verifyAuth(request);
      if (user?.role === 'ADMIN') {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Cleanup expired refresh tokens
    const refreshTokensResult = await cleanupExpiredRefreshTokens();
    
    // Cleanup expired blacklisted tokens
    let blacklistedTokensResult = { deleted: 0 };
    try {
      const { PrismaClient } = await import("@prisma/client");
      const prisma = new PrismaClient();
      
      const result = await prisma.blacklistedToken.deleteMany({
        where: {
          expiresAt: { lt: new Date() }
        }
      });
      
      blacklistedTokensResult = { deleted: result.count };
      await prisma.$disconnect();
    } catch (error) {
      console.warn("Blacklisted token cleanup failed:", error);
    }

    const summary = {
      refreshTokensDeleted: refreshTokensResult.deleted,
      blacklistedTokensDeleted: blacklistedTokensResult.deleted,
      totalDeleted: refreshTokensResult.deleted + blacklistedTokensResult.deleted,
      timestamp: new Date().toISOString()
    };

    console.log("Token cleanup completed:", summary);

    return NextResponse.json({
      success: true,
      message: "Token cleanup completed successfully",
      summary
    });

  } catch (error) {
    console.error("Token cleanup error:", error);
    return NextResponse.json(
      { 
        error: "Token cleanup failed",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/cron/cleanup-tokens - Get cleanup statistics
 */
export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const user = await verifyAuth(request);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // Get statistics without actually cleaning up
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();

    const stats = await Promise.all([
      // Count expired refresh tokens
      prisma.refreshToken.count({
        where: {
          expiresAt: { lt: new Date() }
        }
      }),
      
      // Count revoked refresh tokens older than 7 days
      prisma.refreshToken.count({
        where: {
          isRevoked: true,
          lastUsedAt: { lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }
      }),
      
      // Count expired blacklisted tokens
      prisma.blacklistedToken.count({
        where: {
          expiresAt: { lt: new Date() }
        }
      }).catch(() => 0), // In case the table doesn't exist yet
      
      // Count total active refresh tokens
      prisma.refreshToken.count({
        where: {
          isRevoked: false,
          expiresAt: { gt: new Date() }
        }
      }),
    ]);

    await prisma.$disconnect();

    return NextResponse.json({
      success: true,
      statistics: {
        expiredRefreshTokens: stats[0],
        oldRevokedRefreshTokens: stats[1],
        expiredBlacklistedTokens: stats[2],
        activeRefreshTokens: stats[3],
        totalCleanupCandidates: stats[0] + stats[1] + stats[2],
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error("Token cleanup statistics error:", error);
    return NextResponse.json(
      { error: "Failed to get cleanup statistics" },
      { status: 500 }
    );
  }
} 