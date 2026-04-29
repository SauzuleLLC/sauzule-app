import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'client') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const logs = await prisma.fastFoodLog.findMany({
    where: { clientId: session.user.id },
    orderBy: { loggedAt: 'desc' },
    take: 30,
  })

  return NextResponse.json(logs)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'client') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { restaurant, item, calories, protein, carbs, fat, isHealthy } = await req.json()

  // Get client's daily targets to calculate remaining calories
  const client = await prisma.client.findUnique({
    where: { id: session.user.id },
    select: { targetCalories: true },
  })

  // Sum today's fast food calories
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const todayLogs = await prisma.fastFoodLog.aggregate({
    where: { clientId: session.user.id, loggedAt: { gte: todayStart } },
    _sum: { calories: true },
  })

  const usedCals = (todayLogs._sum.calories || 0) + calories
  const remaining = client?.targetCalories ? client.targetCalories - usedCals : undefined

  const log = await prisma.fastFoodLog.create({
    data: {
      clientId: session.user.id,
      restaurant,
      itemName: item,
      calories,
      protein,
      carbs,
      fat,
      isHealthy: isHealthy || false,
      compensationApplied: true,
      remainingCalories: remaining,
    },
  })

  return NextResponse.json({ log, remainingCalories: remaining })
}
