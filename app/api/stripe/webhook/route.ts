import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as any
      const clientId = session.metadata?.clientId
      const planId = session.metadata?.planId
      if (clientId && planId) {
        await prisma.clientSubscription.upsert({
          where: { clientId },
          create: {
            clientId,
            planId,
            stripeSubscriptionId: session.subscription,
            status: 'ACTIVE',
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
          update: {
            status: 'ACTIVE',
            stripeSubscriptionId: session.subscription,
          },
        })
      }
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as any
      const sub = await prisma.clientSubscription.findFirst({
        where: { stripeSubscriptionId: invoice.subscription },
      })
      if (sub) {
        await prisma.clientSubscription.update({
          where: { id: sub.id },
          data: { status: 'PAST_DUE' },
        })
      }
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as any
      const dbSub = await prisma.clientSubscription.findFirst({
        where: { stripeSubscriptionId: sub.id },
      })
      if (dbSub) {
        await prisma.clientSubscription.update({
          where: { id: dbSub.id },
          data: { status: 'CANCELED' },
        })
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
