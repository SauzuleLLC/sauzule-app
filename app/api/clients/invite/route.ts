import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'coach') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { name, email, planId } = await req.json()
  if (!name || !email) {
    return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
  }

  // Check plan exists and belongs to coach
  if (planId) {
    const plan = await prisma.pricingPlan.findFirst({
      where: { id: planId, coachId: session.user.id },
    })
    if (!plan) return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
  }

  const inviteToken = crypto.randomBytes(32).toString('hex')

  const client = await prisma.client.create({
    data: {
      coachId: session.user.id,
      name,
      email,
      inviteToken,
      inviteAccepted: false,
    },
  })

  // If plan specified, create trial subscription
  if (planId) {
    await prisma.clientSubscription.create({
      data: {
        clientId: client.id,
        planId,
        status: 'TRIAL',
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),  // 14-day trial
      },
    })
  }

  const inviteUrl = `${process.env.NEXTAUTH_URL}/invite/${inviteToken}`

  return NextResponse.json({
    client,
    inviteUrl,
    message: `Invite link generated for ${name}. Share this link: ${inviteUrl}`,
  })
}
