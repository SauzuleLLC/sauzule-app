import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { adjustPlanFromSundayCheckIn } from '@/lib/ai-plan-engine'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'client') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if already checked in this week
  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())  // Sunday
  weekStart.setHours(0, 0, 0, 0)

  const thisWeek = await prisma.sundayCheckIn.findFirst({
    where: { clientId: session.user.id, weekDate: { gte: weekStart } },
  })

  const history = await prisma.sundayCheckIn.findMany({
    where: { clientId: session.user.id },
    orderBy: { weekDate: 'desc' },
    take: 8,
  })

  return NextResponse.json({
    completedThisWeek: !!thisWeek,
    history,
  })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'client') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const {
    adherenceRating,
    energyRating,
    trainingSessions,
    weightChange,
    foodSwapRequest,
  } = await req.json()

  if (!adherenceRating || !energyRating || trainingSessions === undefined) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const now = new Date()
  const weekDate = new Date(now)
  weekDate.setDate(weekDate.getDate() - weekDate.getDay())  // this Sunday

  // Create check-in record
  const checkIn = await prisma.sundayCheckIn.create({
    data: {
      clientId: session.user.id,
      weekDate,
      adherenceRating,
      energyRating,
      trainingSessions,
      weightChange: weightChange ?? undefined,
      foodSwapRequest: foodSwapRequest || undefined,
    },
  })

  // Generate new AI plan based on check-in
  let aiAdjustment = ''
  try {
    aiAdjustment = await adjustPlanFromSundayCheckIn(session.user.id, {
      adherenceRating,
      energyRating,
      trainingSessions,
      weightChange,
      foodSwapRequest,
    })

    // Update weight if provided
    if (weightChange !== undefined) {
      const client = await prisma.client.findUnique({
        where: { id: session.user.id },
        select: { currentWeight: true },
      })
      if (client?.currentWeight) {
        await prisma.client.update({
          where: { id: session.user.id },
          data: { currentWeight: client.currentWeight + weightChange },
        })
      }
    }

    // Update check-in with AI note
    await prisma.sundayCheckIn.update({
      where: { id: checkIn.id },
      data: { aiAdjustment },
    })
  } catch (err) {
    console.error('AI plan generation failed:', err)
  }

  return NextResponse.json({ success: true, aiAdjustment })
}
