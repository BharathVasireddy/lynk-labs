import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

/**
 * Specialized Rate Limiters for Authentication Endpoints
 * More restrictive than general API rate limiting to prevent brute force attacks
 */

// Strict rate limiter for login attempts - 5 attempts per 15 minutes per IP
export const loginRateLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '15 m'),
  analytics: true,
  prefix: '@upstash/ratelimit/auth/login',
});

// Moderate rate limiter for registration - 3 registrations per hour per IP
export const registrationRateLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, '1 h'),
  analytics: true,
  prefix: '@upstash/ratelimit/auth/register',
});

// Rate limiter for auth checks - 30 per minute per IP
export const authCheckRateLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(30, '1 m'),
  analytics: true,
  prefix: '@upstash/ratelimit/auth/check',
});

// Rate limiter for password reset/sensitive operations - 2 per hour per IP
export const sensitiveAuthRateLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(2, '1 h'),
  analytics: true,
  prefix: '@upstash/ratelimit/auth/sensitive',
});

/**
 * Check rate limit for login attempts
 */
export async function checkLoginRateLimit(identifier: string) {
  try {
    const { success, limit, reset, remaining } = await loginRateLimiter.limit(identifier);
    
    return {
      success,
      limit,
      reset,
      remaining,
      headers: {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': reset.toString(),
        'X-RateLimit-Type': 'auth-login'
      }
    };
  } catch (error) {
    console.error('Login rate limit check failed:', error);
    // On error, allow the request to proceed (fail open for availability)
    return {
      success: true,
      limit: 5,
      reset: Date.now() + 15 * 60 * 1000, // 15 minutes
      remaining: 4,
      headers: {
        'X-RateLimit-Limit': '5',
        'X-RateLimit-Remaining': '4',
        'X-RateLimit-Reset': (Date.now() + 15 * 60 * 1000).toString(),
        'X-RateLimit-Type': 'auth-login'
      }
    };
  }
}

/**
 * Check rate limit for registration attempts  
 */
export async function checkRegistrationRateLimit(identifier: string) {
  try {
    const { success, limit, reset, remaining } = await registrationRateLimiter.limit(identifier);
    
    return {
      success,
      limit,
      reset,
      remaining,
      headers: {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': reset.toString(),
        'X-RateLimit-Type': 'auth-register'
      }
    };
  } catch (error) {
    console.error('Registration rate limit check failed:', error);
    return {
      success: true,
      limit: 3,
      reset: Date.now() + 60 * 60 * 1000, // 1 hour  
      remaining: 2,
      headers: {
        'X-RateLimit-Limit': '3',
        'X-RateLimit-Remaining': '2',
        'X-RateLimit-Reset': (Date.now() + 60 * 60 * 1000).toString(),
        'X-RateLimit-Type': 'auth-register'
      }
    };
  }
}

/**
 * Check rate limit for authentication checks (me, profile, etc.)
 */
export async function checkAuthCheckRateLimit(identifier: string) {
  try {
    const { success, limit, reset, remaining } = await authCheckRateLimiter.limit(identifier);
    
    return {
      success,
      limit,
      reset,
      remaining,
      headers: {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': reset.toString(),
        'X-RateLimit-Type': 'auth-check'
      }
    };
  } catch (error) {
    console.error('Auth check rate limit failed:', error);
    return {
      success: true,
      limit: 30,
      reset: Date.now() + 60 * 1000, // 1 minute
      remaining: 29,
      headers: {
        'X-RateLimit-Limit': '30',
        'X-RateLimit-Remaining': '29', 
        'X-RateLimit-Reset': (Date.now() + 60 * 1000).toString(),
        'X-RateLimit-Type': 'auth-check'
      }
    };
  }
}

/**
 * Check rate limit for sensitive auth operations
 */
export async function checkSensitiveAuthRateLimit(identifier: string) {
  try {
    const { success, limit, reset, remaining } = await sensitiveAuthRateLimiter.limit(identifier);
    
    return {
      success,
      limit,
      reset,
      remaining,
      headers: {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': reset.toString(),
        'X-RateLimit-Type': 'auth-sensitive'
      }
    };
  } catch (error) {
    console.error('Sensitive auth rate limit check failed:', error);
    return {
      success: true,
      limit: 2,
      reset: Date.now() + 60 * 60 * 1000, // 1 hour
      remaining: 1,
      headers: {
        'X-RateLimit-Limit': '2',
        'X-RateLimit-Remaining': '1',
        'X-RateLimit-Reset': (Date.now() + 60 * 60 * 1000).toString(),
        'X-RateLimit-Type': 'auth-sensitive'
      }
    };
  }
} 