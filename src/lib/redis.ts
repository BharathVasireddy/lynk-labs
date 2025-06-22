import { Redis } from '@upstash/redis';
import { prisma } from './db';

let redis: Redis | null = null;

// Initialize Redis with proper error handling
function initializeRedis() {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      redis = Redis.fromEnv();
      console.log('✅ Upstash Redis initialized successfully');
    } catch (error) {
      console.warn('Upstash Redis initialization failed:', error);
      redis = null;
    }
  } else {
    console.log('No Upstash Redis credentials provided, using database-based locking');
  }
}

// Initialize on import
initializeRedis();

// Safe Redis operations with database fallbacks
export const safeRedisOperation = async <T>(
  operation: (redis: Redis) => Promise<T>,
  fallback: () => Promise<T>
): Promise<T> => {
  if (!redis) {
    return await fallback();
  }
  
  try {
    return await operation(redis);
  } catch (error) {
    console.warn('Redis operation failed, using database fallback:', error);
    return await fallback();
  }
};

// Database-based locking as fallback
export async function acquireDatabaseLock(key: string, timeout: number = 30): Promise<boolean> {
  try {
    const expiresAt = new Date(Date.now() + timeout * 1000);
    
    // Try to create lock record
    await prisma.systemLock.create({
      data: {
        lockKey: key,
        expiresAt,
        createdAt: new Date()
      }
    });
    
    return true;
  } catch (error) {
    // Lock already exists or other error
    return false;
  }
}

export async function releaseDatabaseLock(key: string): Promise<void> {
  try {
    await prisma.systemLock.deleteMany({
      where: { lockKey: key }
    });
  } catch (error) {
    console.warn('Failed to release database lock:', error);
  }
}

// Clean expired locks
export async function cleanExpiredLocks(): Promise<void> {
  try {
    await prisma.systemLock.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });
  } catch (error) {
    console.warn('Failed to clean expired locks:', error);
  }
}

export { redis };

// Health check function
export async function checkRedisConnection(): Promise<boolean> {
  if (!redis) return false;
  
  try {
    const result = await redis.ping();
    console.log('Redis ping successful:', result);
    return true;
  } catch (error) {
    console.error('Redis ping failed:', error);
    return false;
  }
} 