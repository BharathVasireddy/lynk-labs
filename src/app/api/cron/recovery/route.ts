import { NextResponse } from 'next/server';
import { RecoverySystem } from '@/lib/data-protection';
import { verifyAuth } from '@/lib/auth-utils';

export async function POST(request: Request) {
  try {
    // Verify it's an authorized cron job - only admins can trigger recovery
    const user = await verifyAuth(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    // Process failed operations
    await RecoverySystem.processFailedOperations();

    return NextResponse.json({
      success: true,
      message: 'Recovery job completed'
    });
  } catch (error) {
    console.error('Recovery job failed:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 