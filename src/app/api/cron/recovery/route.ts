import { NextResponse } from 'next/server';
import { RecoverySystem } from '@/lib/data-protection';
import { verifyAuth } from '@/lib/auth-utils';

export async function POST(request: Request) {
  try {
    // Verify it's an authorized cron job
    const user = await verifyAuth(request);
    if (!user?.isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
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