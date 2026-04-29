import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const GOAL_LABELS: Record<string, string> = {
  FAT_LOSS: 'Fat Loss',
  MUSCLE_GAIN: 'Muscle Building',
  MAINTENANCE: 'Maintenance',
  ATHLETIC_PERFORMANCE: 'Athletic Performance',
  RECOMPOSITION: 'Body Recomposition',
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'client') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const client = await prisma.client.findUnique({
    where: { id: session.user.id },
    select: { goal: true, coachId: true },
  })

  if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 })

  const supplements = await prisma.supplementStack.findMany({
    where: {
      coachId: client.coachId,
      goal: client.goal,
      isActive: true,
    },
    orderBy: [
      { priority: 'asc' },  // ESSENTIAL first
      { sortOrder: 'asc' },
    ],
  })

  return NextResponse.json({
    supplements,
    goalLabel: GOAL_LABELS[client.goal] || client.goal,
  })
}
