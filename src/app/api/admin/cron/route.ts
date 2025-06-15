import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth-utils";
import { runCronJobs, autoCompleteOrders } from "@/lib/cron-jobs";

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { jobType } = await request.json();

    if (!jobType || !['hourly', 'daily', 'weekly', 'auto-complete'].includes(jobType)) {
      return NextResponse.json(
        { error: "Invalid job type. Must be one of: hourly, daily, weekly, auto-complete" },
        { status: 400 }
      );
    }

    console.log(`🚀 Manual cron job triggered by admin: ${user.name} (${jobType})`);

    let result;

    if (jobType === 'auto-complete') {
      // Run only the auto-completion job
      result = await autoCompleteOrders();
    } else {
      // Run the full cron job suite
      result = await runCronJobs(jobType as 'hourly' | 'daily' | 'weekly');
    }

    return NextResponse.json({
      success: true,
      message: `${jobType} cron job executed successfully`,
      result,
      triggeredBy: {
        userId: user.id,
        userName: user.name,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error("Error running cron job:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      availableJobs: [
        {
          type: "hourly",
          description: "Auto-complete orders after 24 hours",
          schedule: "Every hour"
        },
        {
          type: "daily", 
          description: "Send reminders and generate daily reports",
          schedule: "Daily at midnight"
        },
        {
          type: "weekly",
          description: "Clean up old data",
          schedule: "Weekly on Sunday"
        },
        {
          type: "auto-complete",
          description: "Run only the auto-completion job",
          schedule: "Manual trigger"
        }
      ],
      usage: {
        endpoint: "/api/admin/cron",
        method: "POST",
        body: { jobType: "hourly|daily|weekly|auto-complete" }
      }
    });

  } catch (error) {
    console.error("Error getting cron job info:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 