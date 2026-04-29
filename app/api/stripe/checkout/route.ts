import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { clientId, planId } = await req.json()

  const [client, plan] = await Promise.all([
    prisma.client.findUnique({ where: { id: clientId } }),
    prisma.pricingPlan.findUnique({ where: { id: planId } }),
  ])

  if (!client || !plan) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (!plan.stripePriceId) return NextResponse.json({ error: 'No Stripe price set' }, { status: 400 })

  // Create or retrieve Stripe customer
  let stripeCustomerId = client.stripeCustomerId
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: client.email,
      name: client.name,
      metadata: { clientId: client.id },
    })
    stripeCustomerId = customer.id
    await prisma.client.update({ where: { id: clientId }, data: { stripeCustomerId } })
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: plan.stripePriceId, quantity: 1 }],
    success_url: `${process.env.NEXTAUTH_URL}/clients/${clientId}?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/clients/${clientId}`,
    metadata: { clientId, planId },
  })

  return NextResponse.json({ url: checkoutSession.url })
}
