import { redis } from './redis';

// In-memory cache as fallback
const memoryCache = new Map<string, { data: any; timestamp: number; ttl: number }>();

export class CacheManager {
  private static TTL = {
    SHORT: 30, // 30 seconds
    MEDIUM: 300, // 5 minutes  
    LONG: 1800, // 30 minutes
  };

  static async get<T>(key: string): Promise<T | null> {
    try {
      // Try Redis first
      if (redis) {
        const cached = await redis.get(key);
        if (cached) {
          return JSON.parse(cached);
        }
      }
      
      // Fallback to memory cache
      const memoryCached = memoryCache.get(key);
      if (memoryCached && Date.now() - memoryCached.timestamp < memoryCached.ttl * 1000) {
        return memoryCached.data;
      }
      
      return null;
    } catch (error) {
      console.warn('Cache get failed:', error);
      return null;
    }
  }

  static async set(key: string, data: any, ttl: number = CacheManager.TTL.MEDIUM): Promise<void> {
    try {
      const serialized = JSON.stringify(data);
      
      // Set in Redis
      if (redis) {
        await redis.setex(key, ttl, serialized);
      }
      
      // Set in memory cache as backup
      memoryCache.set(key, {
        data,
        timestamp: Date.now(),
        ttl
      });
      
      // Clean old memory cache entries
      if (memoryCache.size > 1000) {
        const now = Date.now();
        for (const [k, v] of memoryCache.entries()) {
          if (now - v.timestamp > v.ttl * 1000) {
            memoryCache.delete(k);
          }
        }
      }
    } catch (error) {
      console.warn('Cache set failed:', error);
    }
  }

  static async invalidate(pattern: string): Promise<void> {
    try {
      // Clear from memory cache
      for (const key of memoryCache.keys()) {
        if (key.includes(pattern)) {
          memoryCache.delete(key);
        }
      }
      
      // Clear from Redis (if available)
      if (redis) {
        // Note: This is basic pattern matching, Redis SCAN would be better for production
        const keys = await redis.keys(`*${pattern}*`);
        if (keys.length > 0) {
          await redis.del(...keys);
        }
      }
    } catch (error) {
      console.warn('Cache invalidation failed:', error);
    }
  }

  static getTTL() {
    return CacheManager.TTL;
  }
}

// Helper functions for common cache patterns
export const withCache = async <T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = CacheManager.TTL.MEDIUM
): Promise<T> => {
  // Try cache first
  const cached = await CacheManager.get<T>(key);
  if (cached !== null) {
    return cached;
  }
  
  // Fetch and cache
  const data = await fetcher();
  await CacheManager.set(key, data, ttl);
  return data;
};