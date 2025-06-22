import { prisma } from './db';
import { redis } from './redis';

// Safe transaction wrapper with Redis locking
export async function safeTransaction<T>(
  key: string,
  operation: () => Promise<T>,
  lockTimeout = 30 // seconds
): Promise<T> {
  const lockKey = `lock:${key}`;
  const lock = await redis.set(lockKey, '1', 'NX', 'EX', lockTimeout);

  if (!lock) {
    throw new Error('Operation in progress');
  }

  try {
    // Execute operation in transaction
    const result = await prisma.$transaction(async (tx) => {
      return await operation();
    }, {
      timeout: 10000, // 10 seconds
      isolation: 'SERIALIZABLE'
    });

    return result;
  } catch (error) {
    // Log error and store failed operation
    await redis.lpush('failed_operations', JSON.stringify({
      key,
      error: error.message,
      timestamp: new Date()
    }));
    throw error;
  } finally {
    // Always release the lock
    await redis.del(lockKey);
  }
}

// Safe order creation with protection
export async function createProtectedOrder(orderData: any) {
  return safeTransaction(`order:${orderData.userId}`, async () => {
    const order = await prisma.order.create({
      data: {
        ...orderData,
        status: 'PENDING'
      }
    });

    // Create order items
    if (orderData.items?.length) {
      await prisma.orderItem.createMany({
        data: orderData.items.map((item: any) => ({
          orderId: order.id,
          testId: item.testId,
          price: item.price
        }))
      });
    }

    // Create home visit if needed
    if (orderData.address) {
      await prisma.homeVisit.create({
        data: {
          orderId: order.id,
          status: 'SCHEDULED',
          address: orderData.address
        }
      });
    }

    return order;
  });
}

// Verify order integrity
export async function verifyOrderIntegrity(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      orderItems: true,
      homeVisit: true
    }
  });

  if (!order) return false;

  // Check if order has items
  const hasItems = order.orderItems.length > 0;
  
  // Check if home visit exists when needed
  const needsHomeVisit = order.status !== 'CANCELLED';
  const hasHomeVisit = !!order.homeVisit;

  return hasItems && (!needsHomeVisit || hasHomeVisit);
} 