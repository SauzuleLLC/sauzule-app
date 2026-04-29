import Anthropic from '@anthropic-ai/sdk'
import { prisma } from './prisma'

const client = new Anthropic()

// Mifflin-St Jeor BMR → TDEE → Goal-adjusted calories
export function calculateTDEE(params: {
  weightLbs: number; heightInches: number; age: number; sex: string; activityLevel: string
}): number {
  const kg = params.weightLbs * 0.453592
  const cm = params.heightInches * 2.54
  const bmr = params.sex === 'MALE'
    ? 10 * kg + 6.25 * cm - 5 * params.age + 5
    : 10 * kg + 6.25 * cm - 5 * params.age - 161

  const multipliers: Record<string, number> = {
    SEDENTARY: 1.2, LIGHT: 1.375, MODERATE: 1.55, VERY_ACTIVE: 1.725, ATHLETE: 1.9,
  }
  return Math.round(bmr * (multipliers[params.activityLevel] || 1.55))
}

export function adjustCaloriesForGoal(tdee: number, goal: string): {
  calories: number; protein: number; carbs: number; fat: number
} {
  let calories = tdee
  if (goal === 'FAT_LOSS') calories = Math.round(tdee * 0.8)           // -20% deficit
  else if (goal === 'MUSCLE_GAIN') calories = Math.round(tdee * 1.1)  // +10% surplus
  else if (goal === 'RECOMPOSITION') calories = tdee                   // maintenance

  // Macro split based on goal
  let proteinPct = 0.35, carbPct = 0.40, fatPct = 0.25
  if (goal === 'FAT_LOSS') { proteinPct = 0.40; carbPct = 0.30; fatPct = 0.30 }
  else if (goal === 'MUSCLE_GAIN') { proteinPct = 0.30; carbPct = 0.45; fatPct = 0.25 }
  else if (goal === 'ATHLETIC_PERFORMANCE') { proteinPct = 0.25; carbPct = 0.55; fatPct = 0.20 }

  return {
    calories,
    protein: Math.round((calories * proteinPct) / 4),
    carbs: Math.round((calories * carbPct) / 4),
    fat: Math.round((calories * fatPct) / 9),
  }
}

export async function generateMealPlan(clientId: string): Promise<string> {
  const clientData = await prisma.client.findUnique({
    where: { id: clientId },
    include: { foodPreferences: true },
  })

  if (!clientData) throw new Error('Client not found')

  const lovedFoods = clientData.foodPreferences.filter(f => f.pref === 'LOVE').map(f => f.foodName)
  const likedFoods = clientData.foodPreferences.filter(f => f.pref === 'LIKE').map(f => f.foodName)
  const dislikedFoods = clientData.foodPreferences.filter(f => f.pref === 'DISLIKE').map(f => f.foodName)
  const allergicFoods = clientData.foodPreferences.filter(f => f.pref === 'ALLERGIC').map(f => f.foodName)

  const macros = adjustCaloriesForGoal(clientData.tdee || 2200, clientData.goal)

  const prompt = `You are a professional nutrition coach creating a personalized 7-day meal plan.

CLIENT PROFILE:
- Goal: ${clientData.goal.replace('_', ' ')}
- Diet type: ${clientData.dietType.replace('_', ' ')}
- Daily targets: ${macros.calories} calories, ${macros.protein}g protein, ${macros.carbs}g carbs, ${macros.fat}g fat
- Loves: ${lovedFoods.join(', ') || 'No specific preferences'}
- Likes: ${likedFoods.join(', ') || 'N/A'}
- Dislikes (minimize): ${dislikedFoods.join(', ') || 'None'}
- ALLERGIC (never include): ${allergicFoods.join(', ') || 'None'}

Create a 7-day meal plan (Monday–Sunday) with 4 meals per day (breakfast, lunch, dinner, snack).

For EACH meal provide:
- name: brief meal name
- calories: number
- protein: grams
- carbs: grams
- fat: grams
- ingredients: array of ingredient strings
- prepTime: minutes

Rules:
1. NEVER include allergic foods
2. Prioritize loved foods, include liked foods frequently
3. Minimize disliked foods
4. Hit macro targets within ±50 calories per day
5. Vary meals — no repeated dinners in same week
6. Keep prep simple (under 30 min for weekdays)
7. Use real, whole foods (no ultra-processed)

Respond with ONLY valid JSON in this exact format:
{
  "days": [
    {
      "day": "Monday",
      "meals": [
        {
          "type": "BREAKFAST",
          "name": "...",
          "calories": 450,
          "protein": 35,
          "carbs": 45,
          "fat": 12,
          "ingredients": ["..."],
          "prepTime": 10
        }
      ]
    }
  ],
  "totalAvgCalories": ${macros.calories},
  "totalAvgProtein": ${macros.protein},
  "totalAvgCarbs": ${macros.carbs},
  "totalAvgFat": ${macros.fat}
}`

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 8192,
    messages: [{ role: 'user', content: prompt }],
  })

  const content = response.content[0]
  if (content.type !== 'text') throw new Error('Unexpected response type')
  return content.text
}

export async function adjustPlanFromSundayCheckIn(clientId: string, checkIn: {
  adherenceRating: number; energyRating: number; trainingSessions: number;
  foodSwapRequest: string | null; weightChange: number | null;
}): Promise<string> {
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: { foodPreferences: true, mealPlans: { where: { status: 'ACTIVE' }, take: 1, orderBy: { createdAt: 'desc' } } },
  })
  if (!client) throw new Error('Client not found')

  const macros = adjustCaloriesForGoal(client.tdee || 2200, client.goal)
  
  // Adjustment logic
  let calAdjust = 0
  if (checkIn.weightChange !== null) {
    if (checkIn.weightChange > 0.5 && client.goal === 'FAT_LOSS') calAdjust = -100
    if (checkIn.weightChange < -1 && client.goal === 'FAT_LOSS') calAdjust = +50
    if (checkIn.weightChange < 0 && client.goal === 'MUSCLE_GAIN') calAdjust = +150
  }
  if (checkIn.energyRating <= 2) calAdjust += 100  // low energy → increase carbs
  if (checkIn.adherenceRating <= 2) calAdjust = 0  // bad week → hold calories steady

  const adjustedPrompt = `Adjust a nutrition plan for the coming week based on last week's check-in.

LAST WEEK SUMMARY:
- Diet adherence: ${checkIn.adherenceRating}/5
- Energy: ${checkIn.energyRating}/5
- Training sessions: ${checkIn.trainingSessions}
- Weight change: ${checkIn.weightChange !== null ? `${checkIn.weightChange > 0 ? '+' : ''}${checkIn.weightChange} lbs` : 'Not tracked'}
- Food swap request: ${checkIn.foodSwapRequest || 'None'}

ADJUSTMENTS:
- Calorie adjustment: ${calAdjust > 0 ? '+' : ''}${calAdjust} calories
- New daily target: ${macros.calories + calAdjust} calories
- Reason: ${calAdjust > 0 ? 'Low energy detected, increasing carbohydrates' : calAdjust < 0 ? 'Weight loss stalled, slight deficit increase' : 'Maintaining current targets'}

Generate a new 7-day meal plan applying the adjustments above. Same JSON format as before.
Client loved foods: ${client.foodPreferences.filter(f => f.pref === 'LOVE').map(f => f.foodName).join(', ')}
Never include: ${client.foodPreferences.filter(f => f.pref === 'ALLERGIC').map(f => f.foodName).join(', ')}`

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 8192,
    messages: [{ role: 'user', content: adjustedPrompt }],
  })

  const content = response.content[0]
  if (content.type !== 'text') throw new Error('Unexpected response type')
  return content.text
}
