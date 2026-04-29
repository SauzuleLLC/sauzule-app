import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'

export async function PATCH(req: NextRequest, { params }: { params: { planId: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { priceMonthly } = await req.json()

  const plan = await prisma.pricingPlan.findFirst({
    where: { id: params.planId, coachId: session.user.id },
  })
  if (!plan) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Create new Stripe price (you can't edit prices in Stripe, must create new)
  const stripePrice = await stripe.prices.create({
    currency: 'usd',
    unit_amount: priceMonthly,
    recurring: { interval: 'month' },
    product_data: { name: `Sauzule ${plan.name}` },
  })

  const updated = await prisma.pricingPlan.update({
    where: { id: params.planId },
    data: { priceMonthly, stripePriceId: stripePrice.id },
  })

  return NextResponse.json(updated)
}
