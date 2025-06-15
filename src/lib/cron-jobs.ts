/**
 * Cron Jobs for Lynk Labs
 * Handles scheduled tasks like automatic order completion
 */

import { prisma } from "@/lib/db";

/**
 * Auto-complete orders after 24 hours of report delivery
 * This should be run every hour via a cron job
 */
export async function autoCompleteOrders() {
  try {
    console.log('🕐 Running auto-completion job...');
    
    // Calculate cutoff time (24 hours ago)
    const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    // Find orders that have been in REPORT_READY status for more than 24 hours
    // and have delivered reports
    const ordersToComplete = await prisma.order.findMany({
      where: {
        status: "REPORT_READY",
        reports: {
          some: {
            isDelivered: true,
            deliveredAt: {
              lt: cutoffTime
            }
          }
        }
      },
      include: {
        reports: {
          where: {
            isDelivered: true
          }
        },
        user: {
          select: {
            name: true,
            phone: true,
            email: true
          }
        }
      }
    });

    console.log(`📋 Found ${ordersToComplete.length} orders to auto-complete`);

    if (ordersToComplete.length === 0) {
      console.log('✅ No orders to auto-complete');
      return { success: true, completedCount: 0 };
    }

    // Process each order
    const results = await Promise.allSettled(
      ordersToComplete.map(async (order) => {
        return await prisma.$transaction(async (tx) => {
          // Update order status to COMPLETED
          await tx.order.update({
            where: { id: order.id },
            data: { 
              status: "COMPLETED",
              updatedAt: new Date()
            }
          });

          // Add to order status history
          await tx.orderStatusHistory.create({
            data: {
              orderId: order.id,
              status: "COMPLETED",
              notes: "Auto-completed after 24 hours of report delivery",
              createdBy: null, // System action
            }
          });

          console.log(`✅ Auto-completed order: ${order.orderNumber}`);
          return order.orderNumber;
        });
      })
    );

    // Count successful completions
    const successfulCompletions = results.filter(result => result.status === 'fulfilled').length;
    const failedCompletions = results.filter(result => result.status === 'rejected');

    if (failedCompletions.length > 0) {
      console.error('❌ Some orders failed to auto-complete:', failedCompletions);
    }

    console.log(`🎉 Auto-completion job completed: ${successfulCompletions}/${ordersToComplete.length} orders processed`);

    // TODO: Send notifications to customers about order completion
    // This could include:
    // - Thank you SMS/WhatsApp
    // - Feedback request email
    // - Satisfaction survey link

    return {
      success: true,
      completedCount: successfulCompletions,
      failedCount: failedCompletions.length,
      totalProcessed: ordersToComplete.length
    };

  } catch (error) {
    console.error('❌ Auto-completion job failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      completedCount: 0
    };
  }
}

/**
 * Send reminder notifications for pending orders
 * This should be run daily
 */
export async function sendOrderReminders() {
  try {
    console.log('📢 Running order reminder job...');
    
    // Find orders that are pending for more than 2 hours
    const reminderCutoff = new Date(Date.now() - 2 * 60 * 60 * 1000);
    
    const pendingOrders = await prisma.order.findMany({
      where: {
        status: "PENDING",
        createdAt: {
          lt: reminderCutoff
        }
      },
      include: {
        user: {
          select: {
            name: true,
            phone: true,
            email: true
          }
        }
      }
    });

    console.log(`📋 Found ${pendingOrders.length} pending orders for reminders`);

    // TODO: Implement reminder notifications
    // - Admin notifications for pending orders
    // - Customer follow-up for incomplete orders

    return {
      success: true,
      remindersSent: pendingOrders.length
    };

  } catch (error) {
    console.error('❌ Order reminder job failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Clean up old temporary data
 * This should be run weekly
 */
export async function cleanupOldData() {
  try {
    console.log('🧹 Running data cleanup job...');
    
    // Clean up old order status history (keep last 6 months)
    const cleanupCutoff = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000);
    
    const deletedHistoryCount = await prisma.orderStatusHistory.deleteMany({
      where: {
        createdAt: {
          lt: cleanupCutoff
        }
      }
    });

    console.log(`🗑️ Cleaned up ${deletedHistoryCount.count} old status history records`);

    // TODO: Add more cleanup tasks as needed
    // - Old notification records
    // - Expired session data
    // - Temporary files

    return {
      success: true,
      cleanedRecords: deletedHistoryCount.count
    };

  } catch (error) {
    console.error('❌ Data cleanup job failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Generate daily analytics and reports
 * This should be run daily at midnight
 */
export async function generateDailyReports() {
  try {
    console.log('📊 Running daily reports job...');
    
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

    // Get daily statistics
    const [
      totalOrders,
      completedOrders,
      totalRevenue,
      newCustomers
    ] = await Promise.all([
      prisma.order.count({
        where: {
          createdAt: {
            gte: startOfDay,
            lt: endOfDay
          }
        }
      }),
      prisma.order.count({
        where: {
          status: "COMPLETED",
          updatedAt: {
            gte: startOfDay,
            lt: endOfDay
          }
        }
      }),
      prisma.order.aggregate({
        where: {
          status: "COMPLETED",
          updatedAt: {
            gte: startOfDay,
            lt: endOfDay
          }
        },
        _sum: {
          finalAmount: true
        }
      }),
      prisma.user.count({
        where: {
          role: "CUSTOMER",
          createdAt: {
            gte: startOfDay,
            lt: endOfDay
          }
        }
      })
    ]);

    const dailyStats = {
      date: startOfDay.toISOString().split('T')[0],
      totalOrders,
      completedOrders,
      totalRevenue: totalRevenue._sum.finalAmount || 0,
      newCustomers,
      completionRate: totalOrders > 0 ? (completedOrders / totalOrders * 100).toFixed(2) : 0
    };

    console.log('📈 Daily stats:', dailyStats);

    // TODO: Store daily stats in database or send to analytics service
    // TODO: Send daily report email to admin

    return {
      success: true,
      stats: dailyStats
    };

  } catch (error) {
    console.error('❌ Daily reports job failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Main cron job runner
 * This function can be called by different cron schedules
 */
export async function runCronJobs(jobType: 'hourly' | 'daily' | 'weekly') {
  console.log(`🚀 Running ${jobType} cron jobs...`);
  
  const results: any = {};

  try {
    switch (jobType) {
      case 'hourly':
        results.autoComplete = await autoCompleteOrders();
        break;
        
      case 'daily':
        results.reminders = await sendOrderReminders();
        results.reports = await generateDailyReports();
        break;
        
      case 'weekly':
        results.cleanup = await cleanupOldData();
        break;
        
      default:
        throw new Error(`Unknown job type: ${jobType}`);
    }

    console.log(`✅ ${jobType} cron jobs completed successfully`);
    return {
      success: true,
      jobType,
      results,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error(`❌ ${jobType} cron jobs failed:`, error);
    return {
      success: false,
      jobType,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    };
  }
} 