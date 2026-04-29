import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'client') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const client = await prisma.client.findUnique({
    where: { id: session.user.id },
    select: {
      id: true, name: true, email: true, goal: true, activityLevel: true,
      dietType: true, currentWeight: true, targetWeight: true,
      targetCalories: true, targetProtein: true, targetCarbs: true, targetFat: true,
      tdee: true, sex: true, age: true, heightInches: true,
    },
  })

  if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 })
  return NextResponse.json(client)
}
