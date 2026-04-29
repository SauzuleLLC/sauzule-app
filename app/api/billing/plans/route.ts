import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const plans = await prisma.pricingPlan.findMany({
    where: { coachId: session.user.id, isActive: true },
    orderBy: { priceMonthly: 'asc' },
  })

  // Seed default plans if none exist
  if (plans.length === 0) {
    const defaultPlans = [
      { name: 'Starter', priceMonthly: 3900, features: ['AI meal plan', 'Food preference setup', 'Basic food logging'] },
      { name: 'Standard', priceMonthly: 5900, features: ['Everything in Starter', 'Fast food logging (40+ chains)', 'Sunday weekly reset', 'Food swapping'] },
      { name: 'Elite', priceMonthly: 9900, features: ['Everything in Standard', 'Supplement stack', 'Amazon affiliate links', 'Priority coach access'] },
    ]
    const created = await Promise.all(
      defaultPlans.map(p => prisma.pricingPlan.create({ data: { ...p, coachId: session.user.id } }))
    )
    return NextResponse.json(created)
  }

  return NextResponse.json(plans)
}
