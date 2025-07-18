import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

import { prisma } from "@/lib/db"

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
          console.log('❌ Missing credentials');
          return null
        }

        // Check if it's an email or phone number
        const isEmail = credentials.email.includes('@');
        const isPhone = credentials.email.startsWith('+');

        let user;
        if (isEmail) {
          user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });
        } else if (isPhone) {
          user = await prisma.user.findUnique({
            where: { phone: credentials.email }
          });
        } else {
          // Try both email and phone
          user = await prisma.user.findFirst({
            where: {
              OR: [
                { email: credentials.email },
                { phone: credentials.email }
              ]
            }
          });
        }

        if (!user || !user.password) {
          console.log('❌ No user or no password');
          return null
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
        
        if (!isPasswordValid) {
          return null
        }
        
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