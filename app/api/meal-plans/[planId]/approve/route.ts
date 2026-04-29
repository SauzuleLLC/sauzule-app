import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest, { params }: { params: { planId: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const plan = await prisma.mealPlan.findFirst({
    where: { id: params.planId, client: { coachId: session.user.id } },
  })
  if (!plan) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Archive any current active plan
  await prisma.mealPlan.updateMany({
    where: { clientId: plan.clientId, status: 'ACTIVE' },
    data: { status: 'ARCHIVED' },
  })

  // Approve this plan
  const updated = await prisma.mealPlan.update({
    where: { id: params.planId },
    data: { status: 'ACTIVE', approvedAt: new Date(), approvedByCoach: true },
  })

  return NextResponse.json({ success: true, plan: updated })
}
