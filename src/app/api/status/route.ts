import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Simple health check
    const result = await prisma.$queryRaw`SELECT 1 as status`;
    const dbTime = Date.now() - startTime;

    return NextResponse.json({
      status: "healthy",
      database: "connected",
      responseTime: `${dbTime}ms`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Status check failed:", error);
    return NextResponse.json(
      {
        status: "unhealthy",
        database: "disconnected",
        responseTime: `${Date.now() - startTime}ms`,
        timestamp: new Date().toISOString(),
        error: error.message,
      },
      { status: 500 }
    );
  }
}