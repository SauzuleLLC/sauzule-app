import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { generateMealPlan, calculateTDEE, adjustCaloriesForGoal } from '@/lib/ai-plan-engine'

// GET — validate invite token, return client name + email
export async function GET(
  _req: NextRequest,
  { params }: { params: { token: string } }
) {
  const client = await prisma.client.findUnique({
    where: { inviteToken: params.token },
  })

  if (!client) {
    return NextResponse.json({ error: 'Invalid or expired invite link.' }, { status: 404 })
  }
  if (client.inviteAccepted) {
    return NextResponse.json({ error: 'This invite has already been used. Please log in.' }, { status: 410 })
  }

  return NextResponse.json({ name: client.name, email: client.email })
}

// POST — complete onboarding: set password, profile, preferences, generate plan
export async function POST(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  const client = await prisma.client.findUnique({
    where: { inviteToken: params.token },
  })

  if (!client || client.inviteAccepted) {
    return NextResponse.json({ error: 'Invalid or already used invite.' }, { status: 400 })
  }

  const body = await req.json()
  const {
    password,
    goal,
    activityLevel,
    dietType,
    sex,
    age,
    heightInches,
    currentWeight,
    targetWeight,
    foodPrefs = [],
  } = body

  if (!password || password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
  }

  const passwordHash = await bcrypt.hash(password, 12)

  // Calculate TDEE if we have enough data
  let tdee: number | undefined
  let calories: number | undefined
  let protein: number | undefined
  let carbs: number | undefined
  let fat: number | undefined

  if (age && heightInches && currentWeight) {
    try {
      tdee = calculateTDEE({
        weightLbs: currentWeight,
        heightInches,
        age,
        sex,
        activityLevel,
      })
      const macros = adjustCaloriesForGoal(tdee, goal)
      calories = macros.calories
      protein = macros.protein
      carbs = macros.carbs
      fat = macros.fat
    } catch { /* skip if calc fails */ }
  }

  // Update client record
  const updatedClient = await prisma.client.update({
    where: { id: client.id },
    data: {
      passwordHash,
      inviteAccepted: true,
      inviteToken: null,  // invalidate token
      goal,
      activityLevel,
      dietType,
      sex,
      age: age || undefined,
      heightInches: heightInches || undefined,
      currentWeight: currentWeight || undefined,
      targetWeight: targetWeight || undefined,
      tdee,
      targetCalories: calories,
      targetProtein: protein,
      targetCarbs: carbs,
      targetFat: fat,
    },
  })

  // Save food preferences
  if (foodPrefs.length > 0) {
    const categoryMap: Record<string, string> = {
      'Chicken Breast': 'PROTEIN', 'Ground Beef': 'PROTEIN', 'Salmon': 'PROTEIN',
      'Tuna': 'PROTEIN', 'Eggs': 'PROTEIN', 'Shrimp': 'PROTEIN', 'Turkey': 'PROTEIN',
      'Greek Yogurt': 'DAIRY', 'Cottage Cheese': 'DAIRY', 'Tofu': 'PROTEIN',
      'White Rice': 'CARB', 'Brown Rice': 'CARB', 'Oats': 'CARB',
      'Sweet Potato': 'CARB', 'Pasta': 'CARB', 'Bread': 'CARB', 'Quinoa': 'CARB',
      'Potatoes': 'CARB', 'Broccoli': 'VEGETABLE', 'Spinach': 'VEGETABLE',
      'Asparagus': 'VEGETABLE', 'Zucchini': 'VEGETABLE', 'Peppers': 'VEGETABLE',
      'Mushrooms': 'VEGETABLE', 'Kale': 'VEGETABLE', 'Green Beans': 'VEGETABLE',
      'Banana': 'FRUIT', 'Apple': 'FRUIT', 'Blueberries': 'FRUIT',
      'Strawberries': 'FRUIT', 'Mango': 'FRUIT', 'Pineapple': 'FRUIT',
      'Avocado': 'FAT', 'Olive Oil': 'FAT', 'Nuts': 'FAT',
      'Cheese': 'DAIRY', 'Milk': 'DAIRY', 'Butter': 'FAT',
      'Hot Sauce': 'OTHER', 'Soy Sauce': 'OTHER',
    }

    await Promise.all(
      foodPrefs.map((p: { food: string; pref: string }) =>
        prisma.foodPreference.upsert({
          where: { clientId_foodName: { clientId: client.id, foodName: p.food } },
          create: {
            clientId: client.id,
            foodName: p.food,
            category: (categoryMap[p.food] || 'OTHER') as any,
            pref: p.pref as any,
          },
          update: { pref: p.pref as any },
        })
      )
    )
  }

  // Generate initial AI meal plan
  try {
    await generateMealPlan(updatedClient.id)
  } catch (err) {
    console.error('Failed to generate initial plan:', err)
    // Don't fail the whole onboarding if AI fails
  }

  return NextResponse.json({ success: true })
}
