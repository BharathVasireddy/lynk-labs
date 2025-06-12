import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Test database connection first
    await prisma.$connect()
    
    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
        parentId: null // Only get top-level categories
      },
      include: {
        children: {
          where: {
            isActive: true
          },
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            icon: true
          }
        },
        _count: {
          select: {
            tests: {
              where: {
                isActive: true
              }
            }
          }
        }
      },
      orderBy: {
        name: "asc"
      }
    })

    return NextResponse.json({ 
      categories: categories || []
    })
  } catch (error) {
    console.error("Error fetching categories:", error)
    
    // Return empty array instead of error to prevent frontend crashes
    return NextResponse.json({ 
      categories: [],
      error: "Unable to fetch categories at this time"
    }, { status: 200 })
  } finally {
    await prisma.$disconnect()
  }
} 