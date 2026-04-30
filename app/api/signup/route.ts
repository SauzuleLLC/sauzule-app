import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const {
      name, email, password, goal, activityLevel, dietType, sex,
      age, heightInches, currentWeight, targetWeight,
      allergies = [], favFoods = '', avoidFoods = '',
    } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const existing = await prisma.client.findFirst({ where: { email: email.toLowerCase() } })
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 })
    }

    const coach = await prisma.coach.findFirst()
    if (!coach) {
      return NextResponse.json({ error: 'Service unavailable. Please contact support.' }, { status: 503 })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    // Calculate TDEE using Mifflin-St Jeor equation
    let tdee = 2200
    if (age && heightInches && currentWeight && sex) {
      const bmr = sex === 'MALE'
        ? (10 * currentWeight * 0.453592) + (6.25 * heightInches * 2.54) - (5 * age) + 5
        : (10 * currentWeight * 0.453592) + (6.25 * heightInches * 2.54) - (5 * age) - 161
      const multiplier: Record<string, number> = {
        SEDENTARY: 1.2, LIGHT: 1.375, MODERATE: 1.55, VERY_ACTIVE: 1.725, ATHLETE: 1.9,
      }
      tdee = Math.round(bmr * (multiplier[activityLevel] || 1.55))
    }

    const calAdjust: Record<string, number> = {
      FAT_LOSS: -500, MUSCLE_GAIN: 300, RECOMPOSITION: -200,
      MAINTENANCE: 0, ATHLETIC_PERFORMANCE: 250,
    }
    const targetCalories = Math.max(1200, tdee + (calAdjust[goal] || 0))
    const bodyWeightLbs = currentWeight || 160
    const targetProtein = Math.round(bodyWeightLbs * 0.8)
    const targetCarbs   = Math.round((targetCalories * 0.4) / 4)
    const targetFat     = Math.round((targetCalories * 0.3) / 9)

    // Water goal: 0.67 oz per lb of body weight
    const waterOz = Math.round(bodyWeightLbs * 0.67)
    // Sleep goal based on goal
    const sleepHours = ['MUSCLE_GAIN', 'ATHLETIC_PERFORMANCE'].includes(goal) ? 9 : 8

    const client = await prisma.client.create({
      data: {
        coachId: coach.id,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        passwordHash,
        inviteAccepted: true,
        goal:          goal          || 'FAT_LOSS',
        activityLevel: activityLevel || 'MODERATE',
        dietType:      dietType      || 'HIGH_PROTEIN',
        sex:           sex           || 'MALE',
        age:           age           ? parseInt(age)            : null,
        heightInches:  heightInches  ? parseInt(heightInches)   : null,
        currentWeight: currentWeight ? parseFloat(currentWeight): null,
        targetWeight:  targetWeight  ? parseFloat(targetWeight) : null,
        tdee,
        targetCalories,
        targetProtein,
        targetCarbs,
        targetFat,
      },
    })

    // Save food preferences
    const prefs: { clientId: string; foodName: string; category: 'OTHER'; pref: 'LOVE' | 'DISLIKE' | 'ALLERGIC' }[] = []
    favFoods.split(',').map((f: string) => f.trim()).filter(Boolean).forEach((food: string) => {
      prefs.push({ clientId: client.id, foodName: food, category: 'OTHER', pref: 'LOVE' })
    })
    avoidFoods.split(',').map((f: string) => f.trim()).filter(Boolean).forEach((food: string) => {
      prefs.push({ clientId: client.id, foodName: food, category: 'OTHER', pref: 'DISLIKE' })
    })
    allergies.forEach((food: string) => {
      if (food !== 'None') prefs.push({ clientId: client.id, foodName: food, category: 'OTHER', pref: 'ALLERGIC' })
    })
    if (prefs.length > 0) {
      await prisma.foodPreference.createMany({ data: prefs, skipDuplicates: true })
    }

    // Kick off AI meal plan generation in background
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    fetch(`${baseUrl}/api/ai/generate-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-internal-key': process.env.INTERNAL_API_KEY || '' },
      body: JSON.stringify({ clientId: client.id }),
    }).catch(console.error)

    return NextResponse.json({
      success: true,
      clientId: client.id,
      targets: { calories: targetCalories, protein: targetProtein, carbs: targetCarbs, fat: targetFat, waterOz, sleepHours },
    })
  } catch (err: any) {
    console.error('[signup]', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
