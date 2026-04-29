import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'client') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const plan = await prisma.mealPlan.findFirst({
    where: {
      clientId: session.user.id,
      status: { in: ['ACTIVE', 'APPROVED'] },
    },
    orderBy: { createdAt: 'desc' },
    include: {
      days: {
        orderBy: { dayOfWeek: 'asc' },
        include: {
          meals: { orderBy: { mealType: 'asc' } },
        },
      },
    },
  })

  if (!plan) return NextResponse.json({ error: 'No active plan' }, { status: 404 })
  return NextResponse.json(plan)
}
