import { NextRequest } from "next/server";
import { verify } from "jsonwebtoken";
import { prisma } from "@/lib/db";

export interface AuthUser {
  id: string;
  phone: string;
  name: string | null;
  role: string;
}

export async function verifyAuth(request: NextRequest): Promise<AuthUser | null> {
  try {
    const token = request.cookies.get("auth-token")?.value;
    
    if (!token) {
      return null;
    }

    const decoded = verify(token, process.env.NEXTAUTH_SECRET!) as { userId: string };
    
    if (!decoded.userId) {
      return null;
    }

    // Verify user still exists in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        phone: true,
        name: true,
        role: true,
        isActive: true,
      }
    });

    if (!user || !user.isActive) {
      return null;
    }

    return {
      id: user.id,
      phone: user.phone!,
      name: user.name,
      role: user.role,
    };
  } catch (error) {
    console.error("Auth verification error:", error);
    return null;
  }
}

export async function requireAuth(request: NextRequest): Promise<AuthUser> {
  const user = await verifyAuth(request);
  
  if (!user) {
    throw new Error("Authentication required");
  }
  
  return user;
}

export async function requireRole(request: NextRequest, allowedRoles: string[]): Promise<AuthUser> {
  const user = await requireAuth(request);
  
  if (!allowedRoles.includes(user.role)) {
    throw new Error("Insufficient permissions");
  }
  
  return user;
} 