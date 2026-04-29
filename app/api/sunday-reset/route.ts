import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { adjustPlanFromSundayCheckIn } from '@/lib/ai-plan-engine'

// Called by client submitting Sunday check-in
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { clientId, adherenceRating, energyRating, trainingSessions, foodSwapRequest, weightChange } = body

  const client = await prisma.client.findUnique({ where: { id: clientId } })
  if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 })

  const checkIn = await prisma.sundayCheckIn.create({
    data: {
      clientId,
      weekDate: new Date(),
      adherenceRating,
      energyRating,
      trainingSessions,
      foodSwapRequest,
      weightChange,
    },
  })

  // Generate new plan asynchronously
  try {
    const planJson = await adjustPlanFromSundayCheckIn(clientId, {
      adherenceRating, energyRating, trainingSessions, foodSwapRequest, weightChange,
    })
    const planData = JSON.parse(planJson)

    const monday = new Date()
    monday.setDate(monday.getDate() + 1) // next Monday (since this runs Sunday)
    monday.setHours(0, 0, 0, 0)

    const mealPlan = await prisma.mealPlan.create({
      data: {
        clientId,
        weekStartDate: monday,
        status: 'PENDING_APPROVAL',
        generatedByAI: true,
        aiModel: 'claude-haiku-4-5-20251001',
        avgCalories: planData.totalAvgCalories,
        avgProtein: planData.totalAvgProtein,
        avgCarbs: planData.totalAvgCarbs,
        avgFat: planData.totalAvgFat,
        days: {
          create: planData.days.map((day: any, idx: number) => ({
            dayOfWeek: idx,
            date: new Date(monday.getTime() + idx * 24 * 60 * 60 * 1000),
            meals: {
              create: day.meals.map((meal: any) => ({
                mealType: meal.type,
                name: meal.name,
                calories: meal.calories,
                protein: meal.protein,
                carbs: meal.carbs,
                fat: meal.fat,
                ingredients: meal.ingredients,
                prepTime: meal.prepTime,
              })),
            },
          })),
        },
      },
    })

    await prisma.sundayCheckIn.update({
      where: { id: checkIn.id },
      data: { newPlanId: mealPlan.id },
    })

    return NextResponse.json({ success: true, checkInId: checkIn.id, planId: mealPlan.id })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// CRON: Auto-renew plans for non-responders (called by Vercel Cron at 12pm Sunday)
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const today = new Date()
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

  // Find clients who haven't submitted a check-in this week
  const allClients = await prisma.client.findMany({
    where: { subscription: { status: 'ACTIVE' } },
    include: {
      sundayCheckIns: { where: { weekDate: { gte: weekAgo } }, take: 1 },
      mealPlans: { where: { status: 'ACTIVE' }, take: 1, orderBy: { createdAt: 'desc' } },
    },
  })

  const nonResponders = allClients.filter(c => c.sundayCheckIns.length === 0)
  let autoRenewedCount = 0

  for (const client of nonResponders) {
    const currentPlan = client.mealPlans[0]
    if (!currentPlan) continue

    // Create auto-renewed check-in record
    await prisma.sundayCheckIn.create({
      data: {
        clientId: client.id,
        weekDate: new Date(),
        adherenceRating: 3, energyRating: 3, trainingSessions: 3,
        autoRenewed: true,
        aiAdjustment: 'No check-in received — previous plan auto-renewed.',
      },
    })

    // Clone the current plan for next week
    const nextMonday = new Date()
    nextMonday.setDate(today.getDate() + 1)
    nextMonday.setHours(0, 0, 0, 0)

    await prisma.mealPlan.updateMany({
      where: { clientId: client.id, status: 'ACTIVE' },
      data: { status: 'ARCHIVED' },
    })

    await prisma.mealPlan.create({
      data: {
        clientId: client.id,
        weekStartDate: nextMonday,
        status: 'ACTIVE',
        generatedByAI: false,
        avgCalories: currentPlan.avgCalories,
        avgProtein: currentPlan.avgProtein,
        avgCarbs: currentPlan.avgCarbs,
        avgFat: currentPlan.avgFat,
        approvedAt: new Date(),
        approvedByCoach: true,
        notes: 'Auto-renewed: client did not submit Sunday check-in.',
      },
    })

    autoRenewedCount++
  }

  return NextResponse.json({
    success: true,
    processed: allClients.length,
    responded: allClients.length - nonResponders.length,
    autoRenewed: autoRenewedCount,
  })
}
