import { NextResponse } from 'next/server';
import { HealthCheck } from '@/lib/health-check';

export async function GET() {
  const health = await HealthCheck.checkAll();
  
  return NextResponse.json(health, {
    status: health.status === 'healthy' ? 200 : 503
  });
} 