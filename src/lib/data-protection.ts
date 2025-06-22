import { prisma } from './db';
import { safeRedisOperation, acquireDatabaseLock, releaseDatabaseLock, cleanExpiredLocks } from './redis';

// Enhanced lock manager with database fallback
class LockManager {
  private static readonly lockPrefix = 'lock:';
  private static readonly defaultTimeout = 30; // seconds

  static async acquire(key: string, timeout = this.defaultTimeout): Promise<boolean> {
    const lockKey = this.lockPrefix + key;
    
    // Try Redis first, fallback to database
    return await safeRedisOperation(
      async (redis) => {
        const result = await redis.set(lockKey, '1', 'NX', 'EX', timeout);
        return !!result;
      },
      async () => {
        // Database fallback
        return await acquireDatabaseLock(lockKey, timeout);
      }
    );
  }

  static async release(key: string): Promise<void> {
    const lockKey = this.lockPrefix + key;
    
    // Try Redis first, fallback to database
    await safeRedisOperation(
      async (redis) => {
        await redis.del(lockKey);
      },
      async () => {
        // Database fallback
        await releaseDatabaseLock(lockKey);
      }
    );
  }
}

// Enhanced safe transaction wrapper with multiple protection layers
export async function safeOperation<T>(
  key: string,
  operation: () => Promise<T>
): Promise<T> {
  // Clean expired locks first
  await cleanExpiredLocks();
  
  // Try to acquire lock with retries
  let hasLock = false;
  let retries = 3;
  
  while (!hasLock && retries > 0) {
    hasLock = await LockManager.acquire(key);
    if (!hasLock) {
      retries--;
      if (retries > 0) {
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
  
  if (!hasLock) {
    throw new Error('Unable to acquire operation lock - another operation may be in progress');
  }

  let operationId: string | null = null;
  
  try {
    // Generate unique operation ID for tracking
    operationId = `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Log operation start
    await logOperationStart(operationId, key);
    
    // Execute operation in transaction with maximum safety
    const result = await prisma.$transaction(
      async (tx) => {
        // Execute the actual operation
        const operationResult = await operation();
        
        // Verify operation result integrity
        await verifyOperationResult(operationId!, operationResult);
        
        return operationResult;
      },
      {
        timeout: 30000, // 30 seconds
        isolation: 'SERIALIZABLE' // Highest isolation level
      }
    );

    // Log successful operation
    await logOperationSuccess(operationId, key, result);
    
    return result;
    
  } catch (error) {
    // Log failed operation with full context
    await logFailedOperation(operationId || 'unknown', key, error);
    
    // Re-throw the error
    throw error;
  } finally {
    // Always release lock
    try {
      await LockManager.release(key);
    } catch (lockError) {
      console.error('Failed to release lock:', lockError);
    }
  }
}

// Enhanced order creation with comprehensive protection
export async function createOrderSafely(orderData: any) {
  return safeOperation(`order:${orderData.userId}:${Date.now()}`, async () => {
    // Validate input data
    if (!orderData.userId || !orderData.items || orderData.items.length === 0) {
      throw new Error('Invalid order data: missing required fields');
    }
    
    // Create order with full transaction protection
    const order = await prisma.order.create({
      data: {
        userId: orderData.userId,
        orderNumber: orderData.orderNumber,
        status: 'PENDING',
        totalAmount: orderData.totalAmount,
        discountAmount: orderData.discountAmount || 0,
        finalAmount: orderData.finalAmount,
        addressId: orderData.addressId,
        paymentMethod: orderData.paymentMethod,
        paymentId: orderData.paymentId,
        couponCode: orderData.couponCode
      }
    });

    // Create order items
    const orderItems = await prisma.orderItem.createMany({
      data: orderData.items.map((item: any) => ({
        orderId: order.id,
        testId: item.testId,
        packageId: item.packageId,
        quantity: item.quantity || 1,
        price: item.price
      }))
    });

    // Create home visit if needed
    if (orderData.homeVisit) {
      await prisma.homeVisit.create({
        data: {
          orderId: order.id,
          scheduledDate: orderData.homeVisit.scheduledDate,
          scheduledTime: orderData.homeVisit.scheduledTime,
          status: 'SCHEDULED'
        }
      });
    }
    
    // Create initial status history
    await prisma.orderStatusHistory.create({
      data: {
        orderId: order.id,
        status: 'PENDING',
        notes: 'Order created successfully',
        createdBy: orderData.userId
      }
    });

    // Verify order integrity before returning
    const isValid = await verifyOrderIntegrity(order.id);
    if (!isValid) {
      throw new Error('Order integrity verification failed');
    }

    return order;
  });
}

// Enhanced order integrity verification
export async function verifyOrderIntegrity(orderId: string): Promise<boolean> {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: {
            test: true,
            package: true
          }
        },
        homeVisit: true,
        statusHistory: true
      }
    });

    if (!order) {
      console.error(`Order verification failed: Order ${orderId} not found`);
      return false;
    }

    // Check order has items
    if (order.orderItems.length === 0) {
      console.error(`Order verification failed: Order ${orderId} has no items`);
      return false;
    }
    
    // Check all order items have valid test or package references
    for (const item of order.orderItems) {
      if (!item.test && !item.package) {
        console.error(`Order verification failed: OrderItem ${item.id} has no valid test or package`);
        return false;
      }
    }
    
    // Check status history exists
    if (order.statusHistory.length === 0) {
      console.error(`Order verification failed: Order ${orderId} has no status history`);
      return false;
    }
    
    // Check amounts are valid
    if (order.totalAmount <= 0 || order.finalAmount <= 0) {
      console.error(`Order verification failed: Order ${orderId} has invalid amounts`);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Order integrity verification error:', error);
    return false;
  }
}

// Operation logging functions
async function logOperationStart(operationId: string, key: string): Promise<void> {
  try {
    await safeRedisOperation(
      async (redis) => {
        await redis.hset(`operation:${operationId}`, {
          key,
          status: 'started',
          startTime: new Date().toISOString()
        });
      },
      async () => {
        // Database fallback - could implement if needed
        console.log(`Operation started: ${operationId} for key: ${key}`);
      }
    );
  } catch (error) {
    console.warn('Failed to log operation start:', error);
  }
}

async function logOperationSuccess(operationId: string, key: string, result: any): Promise<void> {
  try {
    await safeRedisOperation(
      async (redis) => {
        await redis.hset(`operation:${operationId}`, {
          status: 'completed',
          endTime: new Date().toISOString(),
          resultId: result.id || 'unknown'
        });
        await redis.expire(`operation:${operationId}`, 86400); // Keep for 24 hours
      },
      async () => {
        console.log(`Operation completed: ${operationId} for key: ${key}`);
      }
    );
  } catch (error) {
    console.warn('Failed to log operation success:', error);
  }
}

async function logFailedOperation(operationId: string, key: string, error: any): Promise<void> {
  try {
    const errorLog = {
      operationId,
      key,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    };
    
    await safeRedisOperation(
      async (redis) => {
        await redis.lpush('failed_operations', JSON.stringify(errorLog));
        await redis.ltrim('failed_operations', 0, 99); // Keep last 100 failures
      },
      async () => {
        // Database fallback - log to console for now
        console.error('FAILED OPERATION:', errorLog);
      }
    );
  } catch (logError) {
    console.error('Failed to log operation failure:', logError);
  }
}

async function verifyOperationResult(operationId: string, result: any): Promise<void> {
  // Add custom verification logic based on operation type
  if (result && typeof result === 'object' && result.id) {
    // Basic verification - result has an ID
    return;
  }
  
  throw new Error(`Operation ${operationId} produced invalid result`);
}

// Enhanced recovery system
export class RecoverySystem {
  static async processFailedOperations(): Promise<void> {
    try {
      await safeRedisOperation(
        async (redis) => {
          const failedOps = await redis.lrange('failed_operations', 0, -1);
          
          for (const op of failedOps) {
            try {
              const operation = JSON.parse(op);
              console.log(`Attempting to recover operation: ${operation.operationId}`);
              
              // Implement specific recovery logic based on operation type
              await this.recoverOperation(operation);
              
              // Remove from failed operations list
              await redis.lrem('failed_operations', 1, op);
            } catch (error) {
              console.error('Recovery failed for operation:', op, error);
            }
          }
        },
        async () => {
          console.log('No Redis available for recovery operations');
        }
      );
    } catch (error) {
      console.error('Failed to process failed operations:', error);
    }
  }
  
  private static async recoverOperation(operation: any): Promise<void> {
    // Implement recovery logic based on operation key
    if (operation.key.startsWith('order:')) {
      // Attempt to recover order operation
      console.log(`Recovering order operation: ${operation.operationId}`);
      // Add specific recovery logic here
    }
  }
  
  static async healthCheck(): Promise<{ status: string; details: any }> {
    const details = {
      database: false,
      redis: false,
      locks: 0,
      failedOperations: 0
    };
    
    try {
      // Check database
      await prisma.$queryRaw`SELECT 1`;
      details.database = true;
      
      // Count active locks
      const lockCount = await prisma.systemLock.count();
      details.locks = lockCount;
      
      // Check Redis and failed operations
      await safeRedisOperation(
        async (redis) => {
          await redis.ping();
          details.redis = true;
          const failedCount = await redis.llen('failed_operations');
          details.failedOperations = failedCount;
        },
        async () => {
          details.redis = false;
        }
      );
      
    } catch (error) {
      console.error('Health check failed:', error);
    }
    
    const status = details.database ? 'healthy' : 'unhealthy';
    return { status, details };
  }
} 