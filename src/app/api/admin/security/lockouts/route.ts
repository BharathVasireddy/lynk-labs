import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth-utils";
import { getAccountSecurityStats, unlockAccount } from "@/lib/account-security";
import { prisma } from "@/lib/db";

// GET /api/admin/security/lockouts - Get security statistics and current lockouts
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const timeRange = parseInt(searchParams.get("timeRange") || "24");

    // Get security statistics
    const stats = await getAccountSecurityStats(timeRange);

    // Get current active lockouts
    const activeLockouts = await prisma.accountLockout.findMany({
      where: {
        expiresAt: { gt: new Date() }
      },
      orderBy: { lockedAt: 'desc' },
      take: 50
    });

    // Get recent failed attempts
    const since = new Date(Date.now() - (timeRange * 60 * 60 * 1000));
    const recentFailedAttempts = await prisma.loginAttempt.findMany({
      where: {
        attemptedAt: { gte: since },
        success: false
      },
      orderBy: { attemptedAt: 'desc' },
      take: 100
    });

    return NextResponse.json({
      success: true,
      stats,
      activeLockouts: activeLockouts.map(lockout => ({
        id: lockout.id,
        identifier: lockout.identifier,
        clientIP: lockout.clientIP,
        lockedAt: lockout.lockedAt,
        expiresAt: lockout.expiresAt,
        reason: lockout.reason,
        attemptCount: lockout.attemptCount,
        minutesRemaining: Math.ceil((lockout.expiresAt.getTime() - Date.now()) / (1000 * 60))
      })),
      recentFailedAttempts: recentFailedAttempts.map(attempt => ({
        id: attempt.id,
        identifier: attempt.identifier,
        clientIP: attempt.clientIP,
        attemptedAt: attempt.attemptedAt,
        userAgent: attempt.userAgent
      }))
    });

  } catch (error) {
    console.error("Error fetching security data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/admin/security/lockouts - Manually unlock an account
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const { action, identifier, reason } = await request.json();

    if (action !== "unlock" || !identifier) {
      return NextResponse.json(
        { error: "Invalid action or missing identifier" },
        { status: 400 }
      );
    }

    // Unlock the account
    const success = await unlockAccount(identifier, user.id);

    if (success) {
      // Log the admin action
      await prisma.accountLockout.create({
        data: {
          identifier,
          clientIP: 'admin_action',
          lockedAt: new Date(),
          expiresAt: new Date(), // Immediately expired
          reason: `admin_unlock: ${reason || 'No reason provided'}`,
          attemptCount: 0,
          unlockedBy: user.id
        }
      });

      return NextResponse.json({
        success: true,
        message: `Account ${identifier} has been unlocked`,
        unlockedBy: user.name,
        unlockedAt: new Date()
      });
    } else {
      return NextResponse.json(
        { error: "Failed to unlock account" },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Error unlocking account:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 