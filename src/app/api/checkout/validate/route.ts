import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { verifyAuth } from "@/lib/auth-utils";

const validateCheckoutSchema = z.object({
  items: z.array(z.object({
    testId: z.string().optional(),
    packageId: z.string().optional(),
    quantity: z.number().min(1).default(1),
    price: z.number().min(0),
  })).min(1, "At least one item is required"),
  addressId: z.string().min(1, "Address is required"),
  scheduledDate: z.string().min(1, "Scheduled date is required"),
  scheduledTime: z.string().min(1, "Scheduled time is required"),
  totalAmount: z.number().min(0),
  finalAmount: z.number().min(0),
});

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Quick auth check
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        { 
          valid: false, 
          error: "Authentication required",
          responseTime: Date.now() - startTime
        },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    
    try {
      const validatedData = validateCheckoutSchema.parse(body);
      
      // Quick validation checks
      const validationPromises = [];
      
      // 1. Check if address belongs to user
      validationPromises.push(
        prisma.address.findFirst({
          where: {
            id: validatedData.addressId,
            userId: user.id
          },
          select: { id: true }
        })
      );

      // 2. Check if tests exist and are active (if any)
      const testIds = validatedData.items.filter(item => item.testId).map(item => item.testId);
      if (testIds.length > 0) {
        validationPromises.push(
          prisma.test.count({
            where: {
              id: { in: testIds },
              isActive: true
            }
          })
        );
      } else {
        validationPromises.push(Promise.resolve(0));
      }

      // 3. Check if packages exist and are active (if any)
      const packageIds = validatedData.items.filter(item => item.packageId).map(item => item.packageId);
      if (packageIds.length > 0) {
        validationPromises.push(
          prisma.package.count({
            where: {
              id: { in: packageIds },
              isActive: true
            }
          })
        );
      } else {
        validationPromises.push(Promise.resolve(0));
      }

      const [address, testCount, packageCount] = await Promise.all(validationPromises);

      // Validation results
      const errors: string[] = [];
      
      if (!address) {
        errors.push("Invalid or unauthorized address");
      }
      
      if (testIds.length > 0 && testCount !== testIds.length) {
        errors.push("Some selected tests are not available");
      }
      
      if (packageIds.length > 0 && packageCount !== packageIds.length) {
        errors.push("Some selected packages are not available");
      }

      // Check if scheduled date is not in the past
      const scheduledDate = new Date(validatedData.scheduledDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (scheduledDate < today) {
        errors.push("Scheduled date cannot be in the past");
      }

      const responseTime = Date.now() - startTime;

      if (errors.length > 0) {
        return NextResponse.json({
          valid: false,
          errors,
          responseTime
        }, { 
          status: 400,
          headers: {
            'Cache-Control': 'no-cache',
            'X-Response-Time': `${responseTime}ms`,
          }
        });
      }

      return NextResponse.json({
        valid: true,
        message: "Checkout data is valid",
        responseTime
      }, {
        headers: {
          'Cache-Control': 'no-cache',
          'X-Response-Time': `${responseTime}ms`,
        }
      });

    } catch (validationError) {
      const responseTime = Date.now() - startTime;
      
      if (validationError instanceof z.ZodError) {
        return NextResponse.json({
          valid: false,
          errors: validationError.errors.map(err => `${err.path.join('.')}: ${err.message}`),
          responseTime
        }, { 
          status: 400,
          headers: {
            'Cache-Control': 'no-cache',
            'X-Response-Time': `${responseTime}ms`,
          }
        });
      }
      
      throw validationError;
    }

  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error("Checkout validation error:", error);
    
    return NextResponse.json({
      valid: false,
      error: "Validation service temporarily unavailable",
      responseTime
    }, { 
      status: 500,
      headers: {
        'Cache-Control': 'no-cache',
        'X-Response-Time': `${responseTime}ms`,
      }
    });
  }
}