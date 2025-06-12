import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Test database connection first
    await prisma.$connect()
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const search = searchParams.get("search") || ""
    const categoryId = searchParams.get("categoryId")
    const sortBy = searchParams.get("sortBy") || "name"
    
    const skip = (page - 1) * limit

    const where = {
      isActive: true,
      ...(search && {
        OR: [
          { name: { contains: search } },
          { description: { contains: search } }
        ]
      }),
      ...(categoryId && { categoryId })
    }

    // Build orderBy clause
    let orderBy: { [key: string]: string } = { name: "asc" }
    
    switch (sortBy) {
      case "price-low":
        orderBy = { price: "asc" }
        break
      case "price-high":
        orderBy = { price: "desc" }
        break
      case "popular":
        // For now, order by creation date (newest first)
        // In a real app, this would be based on popularity metrics
        orderBy = { createdAt: "desc" }
        break
      default:
        orderBy = { name: "asc" }
    }

    const [tests, total] = await Promise.all([
      prisma.test.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          }
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.test.count({ where })
    ])

    // If no tests found, return empty array instead of undefined
    return NextResponse.json({
      tests: tests || [],
      pagination: {
        page,
        limit,
        total: total || 0,
        pages: Math.ceil((total || 0) / limit)
      }
    })
  } catch (error) {
    console.error("Error fetching tests:", error)
    
    // Return empty data structure on error to prevent frontend crashes
    return NextResponse.json({
      tests: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        pages: 0
      },
      error: "Unable to fetch tests at this time"
    }, { status: 200 }) // Return 200 to prevent frontend errors
  } finally {
    await prisma.$disconnect()
  }
} 