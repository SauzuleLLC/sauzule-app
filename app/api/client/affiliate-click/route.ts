import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const { supplementId, amazonUrl } = await req.json()

  await prisma.affiliateClick.create({
    data: {
      clientId: session?.user?.id || undefined,
      supplementId: supplementId || undefined,
      amazonUrl,
      userAgent: req.headers.get('user-agent') || undefined,
    },
  })

  return NextResponse.json({ ok: true })
}
