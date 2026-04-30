'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface Meal {
  id: string
  mealType: string
  name: string
  description?: string
  calories: number
  protein: number
  carbs: number
  fat: number
  servingSize?: string
  ingredients: string[]
  isSwappable: boolean
}

interface DayPlan {
  id: string
  dayOfWeek: number
  date: string
  meals: Meal[]
}

interface MealPlan {
  id: string
  weekStartDate: string
  status: string
  avgCalories?: number
  avgProtein?: number
  avgCarbs?: number
  avgFat?: number
  days: DayPlan[]
}

interface ClientProfile {
  name: string
  targetCalories?: number
  targetProtein?: number
  targetCarbs?: number
  targetFat?: number
  goal: string
}

const MEAL_LABELS: Record<string, string> = {
  BREAKFAST: 'Breakfast',
  LUNCH: 'Lunch',
  DINNER: 'Dinner',
  SNACK_1: 'Snack 1',
  SNACK_2: 'Snack 2',
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']  const FALLBACK_PLAN: MealPlan = {   id: 'sample',   weekStartDate: new Date().toISOString(),   status: 'ACTIVE',   avgCalories: 2800,   avgProtein: 210,   avgCarbs: 270,   avgFat: 85,   days: [     { id: 'd0', dayOfWeek: 0, date: new Date().toISOString(), meals: [       { id: 'd0m1', mealType: 'BREAKFAST', name: 'Egg White Omelette & Oats', calories: 520, protein: 42, carbs: 56, fat: 12, servingSize: '1 serving', ingredients: ['5 egg whites', '1 whole egg', '1 cup oats', 'spinach', 'feta'], isSwappable: true },       { id: 'd0m2', mealType: 'LUNCH', name: 'Grilled Chicken Rice Bowl', calories: 680, protein: 55, carbs: 72, fat: 15, servingSize: '1 bowl', ingredients: ['6oz chicken breast', '1 cup brown rice', 'broccoli', 'olive oil', 'lemon'], isSwappable: true },       { id: 'd0m3', mealType: 'SNACK_1', name: 'Greek Yogurt & Almonds', calories: 280, protein: 22, carbs: 18, fat: 12, servingSize: '1 cup', ingredients: ['1 cup Greek yogurt', '1oz almonds', 'honey'], isSwappable: true },       { id: 'd0m4', mealType: 'DINNER', name: 'Salmon & Sweet Potato', calories: 720, protein: 48, carbs: 65, fat: 22, servingSize: '1 plate', ingredients: ['7oz salmon', '1 large sweet potato', 'asparagus', 'olive oil', 'garlic'], isSwappable: true },     ]},     { id: 'd1', dayOfWeek: 1, date: new Date().toISOString(), meals: [       { id: 'd1m1', mealType: 'BREAKFAST', name: 'Protein Pancakes', calories: 480, protein: 38, carbs: 52, fat: 10, servingSize: '3 pancakes', ingredients: ['1 cup oat flour', '2 scoops protein powder', '2 eggs', 'almond milk', 'banana'], isSwappable: true },       { id: 'd1m2', mealType: 'LUNCH', name: 'Turkey & Avocado Wrap', calories: 620, protein: 48, carbs: 58, fat: 20, servingSize: '1 wrap', ingredients: ['6oz turkey breast', '1 whole wheat tortilla', 'avocado', 'tomato', 'lettuce'], isSwappable: true },       { id: 'd1m3', mealType: 'SNACK_1', name: 'Cottage Cheese & Berries', calories: 240, protein: 26, carbs: 22, fat: 4, servingSize: '1 cup', ingredients: ['1 cup cottage cheese', '1/2 cup blueberries', '1/2 cup strawberries'], isSwappable: true },       { id: 'd1m4', mealType: 'DINNER', name: 'Lean Beef Stir Fry', calories: 680, protein: 52, carbs: 60, fat: 18, servingSize: '1 plate', ingredients: ['6oz lean beef', '1 cup brown rice', 'mixed peppers', 'soy sauce', 'ginger'], isSwappable: true },     ]},     { id: 'd2', dayOfWeek: 2, date: new Date().toISOString(), meals: [       { id: 'd2m1', mealType: 'BREAKFAST', name: 'Overnight Oats with Protein', calories: 500, protein: 40, carbs: 60, fat: 10, servingSize: '1 jar', ingredients: ['1 cup oats', '1 scoop protein powder', 'almond milk', 'chia seeds', 'berries'], isSwappable: true },       { id: 'd2m2', mealType: 'LUNCH', name: 'Tuna Salad Plate', calories: 580, protein: 52, carbs: 45, fat: 16, servingSize: '1 plate', ingredients: ['7oz tuna', 'brown rice', 'cucumber', 'olive oil', 'lemon', 'capers'], isSwappable: true },       { id: 'd2m3', mealType: 'SNACK_1', name: 'Protein Shake & Banana', calories: 300, protein: 28, carbs: 32, fat: 5, servingSize: '1 shake', ingredients: ['2 scoops protein powder', 'almond milk', '1 banana', 'peanut butter'], isSwappable: true },       { id: 'd2m4', mealType: 'DINNER', name: 'Baked Chicken & Quinoa', calories: 720, protein: 55, carbs: 65, fat: 20, servingSize: '1 plate', ingredients: ['7oz chicken thighs', '1 cup quinoa', 'green beans', 'olive oil', 'herbs'], isSwappable: true },     ]},     { id: 'd3', dayOfWeek: 3, date: new Date().toISOString(), meals: [       { id: 'd3m1', mealType: 'BREAKFAST', name: 'Scrambled Eggs & Turkey Bacon', calories: 460, protein: 44, carbs: 20, fat: 20, servingSize: '1 plate', ingredients: ['4 eggs', '3 turkey bacon strips', 'whole wheat toast', 'avocado'], isSwappable: true },       { id: 'd3m2', mealType: 'LUNCH', name: 'Chicken Caesar Wrap', calories: 640, protein: 50, carbs: 62, fat: 18, servingSize: '1 wrap', ingredients: ['6oz chicken breast', 'romaine', 'whole wheat tortilla', 'parmesan', 'caesar dressing'], isSwappable: true },       { id: 'd3m3', mealType: 'SNACK_1', name: 'Rice Cakes & Peanut Butter', calories: 260, protein: 10, carbs: 32, fat: 10, servingSize: '2 rice cakes', ingredients: ['2 rice cakes', '2 tbsp peanut butter', 'honey'], isSwappable: true },       { id: 'd3m4', mealType: 'DINNER', name: 'Shrimp & Vegetable Pasta', calories: 660, protein: 46, carbs: 72, fat: 14, servingSize: '1 bowl', ingredients: ['8oz shrimp', 'whole wheat pasta', 'zucchini', 'tomatoes', 'garlic'], isSwappable: true },     ]},     { id: 'd4', dayOfWeek: 4, date: new Date().toISOString(), meals: [       { id: 'd4m1', mealType: 'BREAKFAST', name: 'Smoothie Bowl', calories: 500, protein: 36, carbs: 65, fat: 10, servingSize: '1 bowl', ingredients: ['2 scoops protein powder', 'frozen berries', 'almond milk', 'granola', 'chia seeds'], isSwappable: true },       { id: 'd4m2', mealType: 'LUNCH', name: 'Ground Turkey Burrito Bowl', calories: 700, protein: 56, carbs: 68, fat: 18, servingSize: '1 bowl', ingredients: ['6oz ground turkey', 'brown rice', 'black beans', 'salsa', 'Greek yogurt'], isSwappable: true },       { id: 'd4m3', mealType: 'SNACK_1', name: 'Hard Boiled Eggs & Veggies', calories: 220, protein: 18, carbs: 12, fat: 10, servingSize: '1 serving', ingredients: ['3 hard boiled eggs', 'celery', 'carrots', 'hummus'], isSwappable: true },       { id: 'd4m4', mealType: 'DINNER', name: 'Pork Tenderloin & Roasted Veggies', calories: 680, protein: 50, carbs: 58, fat: 18, servingSize: '1 plate', ingredients: ['7oz pork tenderloin', 'sweet potato', 'brussels sprouts', 'olive oil', 'herbs'], isSwappable: true },     ]},     { id: 'd5', dayOfWeek: 5, date: new Date().toISOString(), meals: [       { id: 'd5m1', mealType: 'BREAKFAST', name: 'Veggie Egg Muffins', calories: 420, protein: 36, carbs: 24, fat: 18, servingSize: '3 muffins', ingredients: ['6 eggs', 'bell peppers', 'spinach', 'mushrooms', 'cheese'], isSwappable: true },       { id: 'd5m2', mealType: 'LUNCH', name: 'Salmon Sushi Bowl', calories: 660, protein: 48, carbs: 70, fat: 18, servingSize: '1 bowl', ingredients: ['6oz salmon', 'sushi rice', 'cucumber', 'avocado', 'edamame'], isSwappable: true },       { id: 'd5m3', mealType: 'SNACK_1', name: 'Protein Bar & Apple', calories: 280, protein: 20, carbs: 36, fat: 8, servingSize: '1 serving', ingredients: ['1 protein bar', '1 medium apple'], isSwappable: true },       { id: 'd5m4', mealType: 'DINNER', name: 'Steak & Potato', calories: 780, protein: 58, carbs: 62, fat: 25, servingSize: '1 plate', ingredients: ['8oz sirloin steak', '1 large baked potato', 'salad', 'olive oil', 'garlic'], isSwappable: true },     ]},     { id: 'd6', dayOfWeek: 6, date: new Date().toISOString(), meals: [       { id: 'd6m1', mealType: 'BREAKFAST', name: 'French Toast with Berries', calories: 520, protein: 32, carbs: 68, fat: 14, servingSize: '3 slices', ingredients: ['3 slices whole wheat bread', '3 eggs', 'almond milk', 'cinnamon', 'fresh berries'], isSwappable: true },       { id: 'd6m2', mealType: 'LUNCH', name: 'Chicken Vegetable Soup', calories: 560, protein: 46, carbs: 52, fat: 12, servingSize: '1 large bowl', ingredients: ['6oz chicken breast', 'chicken broth', 'carrots', 'celery', 'barley'], isSwappable: true },       { id: 'd6m3', mealType: 'SNACK_1', name: 'Trail Mix', calories: 300, protein: 10, carbs: 28, fat: 16, servingSize: '1/4 cup', ingredients: ['almonds', 'walnuts', 'dried cranberries', 'pumpkin seeds', 'dark chocolate'], isSwappable: true },       { id: 'd6m4', mealType: 'DINNER', name: 'Herb Roasted Chicken & Rice', calories: 700, protein: 55, carbs: 65, fat: 18, servingSize: '1 plate', ingredients: ['7oz chicken breast', '1 cup brown rice', 'roasted vegetables', 'olive oil', 'rosemary'], isSwappable: true },     ]},   ], }

export default function MealPlanPage() {
  const { data: session } = useSession()
  const [plan, setPlan] = useState<MealPlan | null>(null)
  const [profile, setProfile] = useState<ClientProfile | null>(null)
  const [activeDay, setActiveDay] = useState(0)
  const [loading, setLoading] = useState(true)
  const [swapping, setSwapping] = useState<string | null>(null)
  const [swapTarget, setSwapTarget] = useState<string>('')
  const [swapMealId, setSwapMealId] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    const [planRes, profileRes] = await Promise.all([
      fetch('/api/client/meal-plan'),
      fetch('/api/client/profile'),
    ])
    const planData = await planRes.json()
    const profileData = await profileRes.json()
    setPlan(!planData.error ? planData : FALLBACK_PLAN)
    if (!profileData.error) setProfile(profileData)

    // Set active day to today
    const todayIdx = (new Date().getDay() + 6) % 7  // Mon=0
    setActiveDay(Math.min(todayIdx, (planData.days?.length || 1) - 1))
    setLoading(false)
  }

  async function handleGeneratePlan() {
    setGenerating(true)
    const res = await fetch('/api/ai/generate-plan', { method: 'POST' })
    if (res.ok) await fetchData()
    setGenerating(false)
  }

  async function handleSwap(mealId: string) {
    if (!swapTarget.trim()) return
    setSwapping(mealId)
    const res = await fetch('/api/client/swap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mealId, swappedFood: swapTarget }),
    })
    if (res.ok) {
      await fetchData()
      setSwapMealId(null)
      setSwapTarget('')
    }
    setSwapping(null)
  }

  const todayMeals = plan?.days?.[activeDay]?.meals || []
  const dayCalories = todayMeals.reduce((s, m) => s + m.calories, 0)
  const dayProtein = todayMeals.reduce((s, m) => s + m.protein, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: '#b8985a', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  if (!plan) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">🤖</div>
        <h2 className="font-cormorant text-2xl mb-3" style={{ color: '#b8985a' }}>No Meal Plan Yet</h2>
        <p className="text-sm opacity-60 mb-6">Generate your AI-powered 7-day meal plan</p>
        <button
          onClick={handleGeneratePlan}
          disabled={generating}
          className="px-8 py-3 rounded font-semibold text-sm tracking-wider uppercase"
          style={{ background: '#b8985a', color: '#080808', opacity: generating ? 0.6 : 1 }}
        >
          {generating ? 'Generating…' : 'Generate My Plan ✨'}
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-cormorant text-2xl" style={{ color: '#b8985a' }}>Your Meal Plan</h1>
          <p className="text-xs opacity-50 mt-1">
            Week of {new Date(plan.weekStartDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </p>
        </div>
        <button
          onClick={handleGeneratePlan}
          disabled={generating}
          className="text-xs px-3 py-2 rounded"
          style={{ background: '#111', border: '1px solid #b8985a', color: '#b8985a', opacity: generating ? 0.5 : 1 }}
        >
          {generating ? '⏳' : '🔄 New Plan'}
        </button>
      </div>

      {/* Macro targets bar */}
      {profile?.targetCalories && (
        <div className="p-4 rounded-lg" style={{ background: '#111', border: '1px solid #1a1a1a' }}>
          <div className="flex justify-between text-xs mb-3 opacity-60">
            <span>Daily Targets</span>
            <span>{dayCalories} / {profile.targetCalories} cal</span>
          </div>
          <div className="w-full h-2 rounded-full" style={{ background: '#222' }}>
            <div
              className="h-2 rounded-full transition-all"
              style={{
                width: `${Math.min(100, (dayCalories / profile.targetCalories) * 100)}%`,
                background: '#b8985a',
              }}
            />
          </div>
          <div className="flex gap-4 mt-3 text-xs">
            <span className="opacity-60">P: <span style={{ color: '#b8985a' }}>{Math.round(dayProtein)}g</span></span>
            <span className="opacity-60">C: <span style={{ color: '#b8985a' }}>{Math.round(todayMeals.reduce((s, m) => s + m.carbs, 0))}g</span></span>
            <span className="opacity-60">F: <span style={{ color: '#b8985a' }}>{Math.round(todayMeals.reduce((s, m) => s + m.fat, 0))}g</span></span>
          </div>
        </div>
      )}

      {/* Day selector */}
      <div className="flex gap-1">
        {plan.days.map((day, i) => {
          const cals = day.meals.reduce((s, m) => s + m.calories, 0)
          return (
            <button
              key={i}
              onClick={() => setActiveDay(i)}
              className="flex-1 py-2 rounded text-center transition-all"
              style={{
                background: activeDay === i ? '#1a1508' : '#111',
                border: `1px solid ${activeDay === i ? '#b8985a' : '#1a1a1a'}`,
              }}
            >
              <div className="text-xs font-medium" style={{ color: activeDay === i ? '#b8985a' : '#e8e0d0' }}>
                {DAYS[i]}
              </div>
              <div className="text-xs opacity-40">{cals}cal</div>
            </button>
          )
        })}
      </div>

      {/* Meals for selected day */}
      <div className="space-y-3">
        {todayMeals.map(meal => (
          <div
            key={meal.id}
            className="rounded-lg overflow-hidden"
            style={{ background: '#111', border: '1px solid #1a1a1a' }}
          >
            <div className="px-4 pt-4 pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="text-xs uppercase tracking-widest opacity-40 mb-1">
                    {MEAL_LABELS[meal.mealType]}
                  </div>
                  <div className="font-medium text-sm leading-snug">{meal.name}</div>
                  {meal.servingSize && (
                    <div className="text-xs opacity-40 mt-0.5">{meal.servingSize}</div>
                  )}
                </div>
                <div className="text-right text-xs shrink-0">
                  <div className="font-semibold" style={{ color: '#b8985a' }}>{meal.calories} cal</div>
                  <div className="opacity-50 mt-0.5">P {Math.round(meal.protein)}g</div>
                </div>
              </div>

              {/* Macros */}
              <div className="flex gap-3 mt-3 text-xs opacity-50">
                <span>Carbs: {Math.round(meal.carbs)}g</span>
                <span>Fat: {Math.round(meal.fat)}g</span>
                {meal.prepTime && <span>Prep: {meal.prepTime}min</span>}
              </div>

              {/* Ingredients */}
              {meal.ingredients.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {meal.ingredients.slice(0, 5).map((ing, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#1a1a1a', color: '#999' }}>
                      {ing}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Swap */}
            {meal.isSwappable && (
              <div className="px-4 pb-4">
                {swapMealId === meal.id ? (
                  <div className="flex gap-2 mt-2">
                    <input
                      value={swapTarget}
                      onChange={e => setSwapTarget(e.target.value)}
                      placeholder="Swap to… (e.g. turkey instead of chicken)"
                      className="flex-1 px-3 py-2 rounded text-xs outline-none"
                      style={{ background: '#0d0d0d', border: '1px solid #333', color: '#e8e0d0' }}
                      onKeyDown={e => e.key === 'Enter' && handleSwap(meal.id)}
                    />
                    <button
                      onClick={() => handleSwap(meal.id)}
                      disabled={swapping === meal.id}
                      className="px-3 py-2 rounded text-xs"
                      style={{ background: '#b8985a', color: '#080808' }}
                    >
                      {swapping === meal.id ? '…' : 'Swap'}
                    </button>
                    <button
                      onClick={() => { setSwapMealId(null); setSwapTarget('') }}
                      className="px-3 py-2 rounded text-xs"
                      style={{ background: '#1a1a1a', color: '#999' }}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setSwapMealId(meal.id)}
                    className="text-xs mt-2 opacity-40 hover:opacity-80 transition-opacity"
                    style={{ color: '#b8985a' }}
                  >
                    🔄 Swap this meal
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
