import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'client') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { mealId, swappedFood } = await req.json()
  if (!mealId || !swappedFood) {
    return NextResponse.json({ error: 'Missing mealId or swappedFood' }, { status: 400 })
  }

  // Get the meal to find original food name
  const meal = await prisma.meal.findUnique({ where: { id: mealId } })
  if (!meal) return NextResponse.json({ error: 'Meal not found' }, { status: 404 })

  // Check if this food has been swapped before (swap count)
  const existing = await prisma.foodSwap.findFirst({
    where: { clientId: session.user.id, originalFood: meal.name },
  })

  let swap
  if (existing) {
    const newCount = existing.swapCount + 1
    swap = await prisma.foodSwap.update({
      where: { id: existing.id },
      data: {
        swappedFood,
        swapCount: newCount,
        isPermanent: newCount >= 3,  // after 3 swaps, make it permanent
      },
    })
  } else {
    swap = await prisma.foodSwap.create({
      data: {
        clientId: session.user.id,
        mealId,
        originalFood: meal.name,
        swappedFood,
        reason: 'client_preference',
      },
    })
  }

  // Update the meal name to reflect the swap
  await prisma.meal.update({
    where: { id: mealId },
    data: { name: swappedFood },
  })

  return NextResponse.json({
    swap,
    isPermanent: swap.isPermanent,
    message: swap.isPermanent
      ? `${meal.name} will be permanently replaced with ${swappedFood} in future plans.`
      : `Swapped for this week. (${swap.swapCount}/3 swaps — permanent after 3)`,
  })
}
