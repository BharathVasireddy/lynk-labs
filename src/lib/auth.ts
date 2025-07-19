import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"

import { prisma } from "@/lib/db"
import { timingSafeAuthenticate } from "@/lib/timing-safe-auth"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email or Phone", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Use timing-safe authentication to prevent timing attacks
        const authResult = await timingSafeAuthenticate(
          credentials.email, 
          credentials.password
        );

        if (!authResult.success || !authResult.user) {
          return null
        }

        const user = authResult.user;
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role || 'CUSTOMER'
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as { id: string; role: string }).id = token.sub!
        ;(session.user as { id: string; role: string }).role = token.role as string
      }
      return session
    }
  },
  pages: {
    signIn: "/auth/login",
  }
} 