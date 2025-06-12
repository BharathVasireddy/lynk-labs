import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
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

    return NextResponse.json({ categories })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 