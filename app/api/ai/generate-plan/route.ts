import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateMealPlan, calculateTDEE, adjustCaloriesForGoal } from '@/lib/ai-plan-engine'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let clientId: string

  if (session.user.role === 'client') {
    // Client generating their own plan
    clientId = session.user.id
  } else {
    // Coach generating plan for a client
    const body = await req.json().catch(() => ({}))
    clientId = body.clientId
    if (!clientId) return NextResponse.json({ error: 'clientId required' }, { status: 400 })

    // Verify coach owns this client
    const clientCheck = await prisma.client.findFirst({
      where: { id: clientId, coachId: session.user.id },
    })
    if (!clientCheck) return NextResponse.json({ error: 'Client not found' }, { status: 404 })
  }

  const clientData = await prisma.client.findUnique({ where: { id: clientId } })
  if (!clientData) return NextResponse.json({ error: 'Client not found' }, { status: 404 })

  // Calculate TDEE if not set
  if (!clientData.tdee && clientData.currentWeight && clientData.heightInches && clientData.age) {
    const tdee = calculateTDEE({
      weightLbs: clientData.currentWeight,
      heightInches: clientData.heightInches,
      age: clientData.age,
      sex: clientData.sex,
      activityLevel: clientData.activityLevel,
    })
    const macros = adjustCaloriesForGoal(tdee, clientData.goal)
    await prisma.client.update({
      where: { id: clientId },
      data: { tdee, targetCalories: macros.calories, targetProtein: macros.protein, targetCarbs: macros.carbs, targetFat: macros.fat },
    })
  }

  try {
    const planJson = await generateMealPlan(clientId)
    const planData = JSON.parse(planJson)

    // Get Monday of current week
    const today = new Date()
    const monday = new Date(today)
    monday.setDate(today.getDate() - today.getDay() + 1)
    monday.setHours(0, 0, 0, 0)

    // Archive any existing ACTIVE plans
    await prisma.mealPlan.updateMany({
      where: { clientId, status: { in: ['ACTIVE', 'APPROVED'] } },
      data: { status: 'ARCHIVED' },
    })

    const mealPlan = await prisma.mealPlan.create({
      data: {
        clientId,
        weekStartDate: monday,
        status: session.user.role === 'client' ? 'ACTIVE' : 'PENDING_APPROVAL',
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
                description: meal.description,
                calories: meal.calories,
                protein: meal.protein,
                carbs: meal.carbs,
                fat: meal.fat,
                ingredients: meal.ingredients || [],
                prepTime: meal.prepTime,
                isSwappable: true,
              })),
            },
          })),
        },
      },
      include: { days: { include: { meals: true } } },
    })

    return NextResponse.json({ success: true, planId: mealPlan.id })
  } catch (err: any) {
    console.error('Plan generation error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
