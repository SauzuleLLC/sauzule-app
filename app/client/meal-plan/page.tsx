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

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

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
    if (!planData.error) setPlan(planData)
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
