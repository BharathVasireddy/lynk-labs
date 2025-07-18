/**
 * Account Security & Lockout System
 * Prevents brute force attacks by temporarily locking accounts after failed attempts
 */

import { prisma } from './db';
import { safeRedisOperation } from './redis';

interface LockoutConfig {
  maxAttempts: number;
  lockoutDurationMinutes: number;
  trackingWindowMinutes: number;
}

interface LoginAttemptResult {
  isLocked: boolean;
  attemptsRemaining: number;
  lockoutExpiresAt?: Date;
  nextAttemptAllowedAt?: Date;
}

/**
 * Different lockout policies for different scenarios
 */
export const LOCKOUT_POLICIES = {
  // Standard user login lockout
  USER_LOGIN: {
    maxAttempts: 5,
    lockoutDurationMinutes: 15,
    trackingWindowMinutes: 60
  } as LockoutConfig,
  
  // Admin login - stricter policy
  ADMIN_LOGIN: {
    maxAttempts: 3,
    lockoutDurationMinutes: 30,
    trackingWindowMinutes: 60
  } as LockoutConfig,
  
  // Password reset attempts
  PASSWORD_RESET: {
    maxAttempts: 3,
    lockoutDurationMinutes: 60,
    trackingWindowMinutes: 120
  } as LockoutConfig,
  
  // Registration attempts from same IP
  REGISTRATION: {
    maxAttempts: 5,
    lockoutDurationMinutes: 120,
    trackingWindowMinutes: 360
  } as LockoutConfig
};

/**
 * Get Redis key for tracking login attempts
 */
function getAttemptKey(identifier: string, type: 'user' | 'ip' = 'user'): string {
  return `login_attempts:${type}:${identifier}`;
}

/**
 * Get Redis key for account lockout
 */
function getLockoutKey(identifier: string, type: 'user' | 'ip' = 'user'): string {
  return `lockout:${type}:${identifier}`;
}

/**
 * Record a failed login attempt
 */
export async function recordFailedAttempt(
  userIdentifier: string, // email or phone
  clientIP: string,
  policy: LockoutConfig = LOCKOUT_POLICIES.USER_LOGIN
): Promise<LoginAttemptResult> {
  const now = new Date();
  const windowStart = new Date(now.getTime() - (policy.trackingWindowMinutes * 60 * 1000));

  try {
    // Use Redis for fast tracking if available, fallback to database
    return await safeRedisOperation(
      async (redis) => {
        // Track attempts for both user and IP
        const userKey = getAttemptKey(userIdentifier, 'user');
        const ipKey = getAttemptKey(clientIP, 'ip');
        const userLockoutKey = getLockoutKey(userIdentifier, 'user');
        const ipLockoutKey = getLockoutKey(clientIP, 'ip');

        // Check if already locked
        const [userLocked, ipLocked] = await Promise.all([
          redis.get(userLockoutKey),
          redis.get(ipLockoutKey)
        ]);

        if (userLocked || ipLocked) {
          const lockoutData = JSON.parse(userLocked || ipLocked || '{}');
          return {
            isLocked: true,
            attemptsRemaining: 0,
            lockoutExpiresAt: new Date(lockoutData.expiresAt),
            nextAttemptAllowedAt: new Date(lockoutData.expiresAt)
          };
        }

        // Increment attempt counters
        const userAttempts = await redis.incr(userKey);
        const ipAttempts = await redis.incr(ipKey);

        // Set expiration for attempt tracking
        if (userAttempts === 1) {
          await redis.expire(userKey, policy.trackingWindowMinutes * 60);
        }
        if (ipAttempts === 1) {
          await redis.expire(ipKey, policy.trackingWindowMinutes * 60);
        }

        // Check if lockout threshold reached
        const shouldLockUser = userAttempts >= policy.maxAttempts;
        const shouldLockIP = ipAttempts >= (policy.maxAttempts * 2); // More lenient for IP

        if (shouldLockUser || shouldLockIP) {
          const lockoutExpires = new Date(now.getTime() + (policy.lockoutDurationMinutes * 60 * 1000));
          const lockoutData = {
            lockedAt: now.toISOString(),
            expiresAt: lockoutExpires.toISOString(),
            attempts: shouldLockUser ? userAttempts : ipAttempts,
            reason: shouldLockUser ? 'user_attempts' : 'ip_attempts'
          };

          if (shouldLockUser) {
            await redis.setex(userLockoutKey, policy.lockoutDurationMinutes * 60, JSON.stringify(lockoutData));
          }
          if (shouldLockIP) {
            await redis.setex(ipLockoutKey, policy.lockoutDurationMinutes * 60, JSON.stringify(lockoutData));
          }

          return {
            isLocked: true,
            attemptsRemaining: 0,
            lockoutExpiresAt: lockoutExpires,
            nextAttemptAllowedAt: lockoutExpires
          };
        }

        return {
          isLocked: false,
          attemptsRemaining: policy.maxAttempts - userAttempts,
          lockoutExpiresAt: undefined,
          nextAttemptAllowedAt: undefined
        };
      },

      // Database fallback
      async () => {
        // Record attempt in database
        await prisma.loginAttempt.create({
          data: {
            identifier: userIdentifier,
            clientIP,
            attemptedAt: now,
            success: false,
          }
        });

        // Count recent failed attempts for user
        const userAttempts = await prisma.loginAttempt.count({
          where: {
            identifier: userIdentifier,
            success: false,
            attemptedAt: { gte: windowStart }
          }
        });

        // Count recent failed attempts for IP
        const ipAttempts = await prisma.loginAttempt.count({
          where: {
            clientIP,
            success: false,
            attemptedAt: { gte: windowStart }
          }
        });

        // Check if lockout threshold reached
        const shouldLockUser = userAttempts >= policy.maxAttempts;
        const shouldLockIP = ipAttempts >= (policy.maxAttempts * 2);

        if (shouldLockUser || shouldLockIP) {
          const lockoutExpires = new Date(now.getTime() + (policy.lockoutDurationMinutes * 60 * 1000));
          
          // Create lockout record
          await prisma.accountLockout.create({
            data: {
              identifier: userIdentifier,
              clientIP,
              lockedAt: now,
              expiresAt: lockoutExpires,
              reason: shouldLockUser ? 'user_attempts' : 'ip_attempts',
              attemptCount: shouldLockUser ? userAttempts : ipAttempts,
            }
          });

          return {
            isLocked: true,
            attemptsRemaining: 0,
            lockoutExpiresAt: lockoutExpires,
            nextAttemptAllowedAt: lockoutExpires
          };
        }

        return {
          isLocked: false,
          attemptsRemaining: policy.maxAttempts - userAttempts,
          lockoutExpiresAt: undefined,
          nextAttemptAllowedAt: undefined
        };
      }
    );

  } catch (error) {
    console.error('Error recording failed attempt:', error);
    // Fail open - don't block legitimate users due to system errors
    return {
      isLocked: false,
      attemptsRemaining: 1,
      lockoutExpiresAt: undefined,
      nextAttemptAllowedAt: undefined
    };
  }
}

/**
 * Check if account/IP is currently locked out
 */
export async function checkLockoutStatus(
  userIdentifier: string,
  clientIP: string
): Promise<LoginAttemptResult> {
  try {
    return await safeRedisOperation(
      async (redis) => {
        const userLockoutKey = getLockoutKey(userIdentifier, 'user');
        const ipLockoutKey = getLockoutKey(clientIP, 'ip');

        const [userLocked, ipLocked] = await Promise.all([
          redis.get(userLockoutKey),
          redis.get(ipLockoutKey)
        ]);

        if (userLocked || ipLocked) {
          const lockoutData = JSON.parse(userLocked || ipLocked || '{}');
          const expiresAt = new Date(lockoutData.expiresAt);
          
          // Check if lockout has expired
          if (expiresAt <= new Date()) {
            // Clean up expired lockout
            if (userLocked) await redis.del(userLockoutKey);
            if (ipLocked) await redis.del(ipLockoutKey);
            
            return {
              isLocked: false,
              attemptsRemaining: LOCKOUT_POLICIES.USER_LOGIN.maxAttempts,
              lockoutExpiresAt: undefined,
              nextAttemptAllowedAt: undefined
            };
          }

          return {
            isLocked: true,
            attemptsRemaining: 0,
            lockoutExpiresAt: expiresAt,
            nextAttemptAllowedAt: expiresAt
          };
        }

        // Check current attempt count
        const userKey = getAttemptKey(userIdentifier, 'user');
        const userAttempts = await redis.get(userKey);
        const attempts = userAttempts ? parseInt(userAttempts) : 0;

        return {
          isLocked: false,
          attemptsRemaining: Math.max(0, LOCKOUT_POLICIES.USER_LOGIN.maxAttempts - attempts),
          lockoutExpiresAt: undefined,
          nextAttemptAllowedAt: undefined
        };
      },

      // Database fallback
      async () => {
        const now = new Date();
        
        // Check for active lockouts
        const lockout = await prisma.accountLockout.findFirst({
          where: {
            OR: [
              { identifier: userIdentifier },
              { clientIP }
            ],
            expiresAt: { gt: now }
          },
          orderBy: { lockedAt: 'desc' }
        });

        if (lockout) {
          return {
            isLocked: true,
            attemptsRemaining: 0,
            lockoutExpiresAt: lockout.expiresAt,
            nextAttemptAllowedAt: lockout.expiresAt
          };
        }

        // Count recent attempts
        const windowStart = new Date(now.getTime() - (LOCKOUT_POLICIES.USER_LOGIN.trackingWindowMinutes * 60 * 1000));
        const attempts = await prisma.loginAttempt.count({
          where: {
            identifier: userIdentifier,
            success: false,
            attemptedAt: { gte: windowStart }
          }
        });

        return {
          isLocked: false,
          attemptsRemaining: Math.max(0, LOCKOUT_POLICIES.USER_LOGIN.maxAttempts - attempts),
          lockoutExpiresAt: undefined,
          nextAttemptAllowedAt: undefined
        };
      }
    );

  } catch (error) {
    console.error('Error checking lockout status:', error);
    // Fail open - don't block legitimate users
    return {
      isLocked: false,
      attemptsRemaining: 1,
      lockoutExpiresAt: undefined,
      nextAttemptAllowedAt: undefined
    };
  }
}

/**
 * Clear login attempts after successful login
 */
export async function clearLoginAttempts(
  userIdentifier: string,
  clientIP: string
): Promise<void> {
  try {
    await safeRedisOperation(
      async (redis) => {
        const userKey = getAttemptKey(userIdentifier, 'user');
        const ipKey = getAttemptKey(clientIP, 'ip');
        await Promise.all([
          redis.del(userKey),
          redis.del(ipKey)
        ]);
      },
      async () => {
        // Record successful login
        await prisma.loginAttempt.create({
          data: {
            identifier: userIdentifier,
            clientIP,
            attemptedAt: new Date(),
            success: true,
          }
        });
      }
    );
  } catch (error) {
    console.error('Error clearing login attempts:', error);
  }
}

/**
 * Manually unlock an account (admin function)
 */
export async function unlockAccount(
  userIdentifier: string,
  adminUserId: string
): Promise<boolean> {
  try {
    await safeRedisOperation(
      async (redis) => {
        const userLockoutKey = getLockoutKey(userIdentifier, 'user');
        const userAttemptKey = getAttemptKey(userIdentifier, 'user');
        await Promise.all([
          redis.del(userLockoutKey),
          redis.del(userAttemptKey)
        ]);
      },
      async () => {
        // Mark lockouts as expired
        await prisma.accountLockout.updateMany({
          where: {
            identifier: userIdentifier,
            expiresAt: { gt: new Date() }
          },
          data: {
            expiresAt: new Date(), // Expire immediately
            unlockedBy: adminUserId
          }
        });
      }
    );

    console.log(`Account ${userIdentifier} manually unlocked by admin ${adminUserId}`);
    return true;
  } catch (error) {
    console.error('Error unlocking account:', error);
    return false;
  }
}

/**
 * Get account security statistics for monitoring
 */
export async function getAccountSecurityStats(timeRangeHours: number = 24): Promise<{
  totalAttempts: number;
  failedAttempts: number;
  successfulLogins: number;
  activeLockouts: number;
  topFailedIdentifiers: Array<{ identifier: string; count: number }>;
  topFailedIPs: Array<{ ip: string; count: number }>;
}> {
  const since = new Date(Date.now() - (timeRangeHours * 60 * 60 * 1000));

  try {
    const [
      totalAttempts,
      failedAttempts, 
      successfulLogins,
      activeLockouts,
      topFailedIdentifiers,
      topFailedIPs
    ] = await Promise.all([
      prisma.loginAttempt.count({
        where: { attemptedAt: { gte: since } }
      }),
      prisma.loginAttempt.count({
        where: { 
          attemptedAt: { gte: since },
          success: false
        }
      }),
      prisma.loginAttempt.count({
        where: { 
          attemptedAt: { gte: since },
          success: true
        }
      }),
      prisma.accountLockout.count({
        where: { 
          expiresAt: { gt: new Date() }
        }
      }),
      prisma.loginAttempt.groupBy({
        by: ['identifier'],
        where: {
          attemptedAt: { gte: since },
          success: false
        },
        _count: { identifier: true },
        orderBy: { _count: { identifier: 'desc' } },
        take: 10
      }),
      prisma.loginAttempt.groupBy({
        by: ['clientIP'],
        where: {
          attemptedAt: { gte: since },
          success: false
        },
        _count: { clientIP: true },
        orderBy: { _count: { clientIP: 'desc' } },
        take: 10
      })
    ]);

    return {
      totalAttempts,
      failedAttempts,
      successfulLogins,
      activeLockouts,
      topFailedIdentifiers: topFailedIdentifiers.map(item => ({
        identifier: item.identifier,
        count: item._count.identifier
      })),
      topFailedIPs: topFailedIPs.map(item => ({
        ip: item.clientIP,
        count: item._count.clientIP
      }))
    };

  } catch (error) {
    console.error('Error getting security stats:', error);
    return {
      totalAttempts: 0,
      failedAttempts: 0,
      successfulLogins: 0,
      activeLockouts: 0,
      topFailedIdentifiers: [],
      topFailedIPs: []
    };
  }
} 