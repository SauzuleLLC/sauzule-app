import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: 'coach' | 'client'
      coachId?: string  // for clients: their coach's id
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: 'coach' | 'client'
    coachId?: string
  }
}

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  pages: { signIn: '/' },
  providers: [
    CredentialsProvider({
      id: 'coach-login',
      name: 'Coach',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const coach = await prisma.coach.findUnique({
          where: { email: credentials.email },
        })
        if (!coach) return null
        const valid = await bcrypt.compare(credentials.password, coach.passwordHash)
        if (!valid) return null
        return { id: coach.id, email: coach.email, name: coach.name, role: 'coach' } as any
      },
    }),
    CredentialsProvider({
      id: 'client-login',
      name: 'Client',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const client = await prisma.client.findFirst({
          where: { email: credentials.email, inviteAccepted: true },
        })
        if (!client || !client.passwordHash) return null
        const valid = await bcrypt.compare(credentials.password, client.passwordHash)
        if (!valid) return null
        return {
          id: client.id,
          email: client.email,
          name: client.name,
          role: 'client',
          coachId: client.coachId,
        } as any
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role ?? 'coach'
        token.coachId = (user as any).coachId
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.coachId = token.coachId
      }
      return session
    },
  },
}
