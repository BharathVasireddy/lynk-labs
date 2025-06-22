import { prisma } from './db';
import { checkRedisConnection } from './redis';
import { RecoverySystem } from './data-protection';

export class HealthCheck {
  static async checkDatabase() {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }

  static async checkRedis() {
    try {
      return await checkRedisConnection();
    } catch (error) {
      console.error('Redis health check failed:', error);
      return false;
    }
  }

  static async checkAll() {
    const dbHealth = await this.checkDatabase();
    const redisHealth = await this.checkRedis();
    
    // Get detailed health information from recovery system
    const recoveryHealth = await RecoverySystem.healthCheck();

    return {
      database: dbHealth,
      redis: redisHealth,
      locks: recoveryHealth.details.locks,
      failedOperations: recoveryHealth.details.failedOperations,
      status: dbHealth ? 'healthy' : 'unhealthy', // Redis is optional
      dataProtection: dbHealth ? 'active' : 'compromised',
      timestamp: new Date().toISOString()
    };
  }
} 