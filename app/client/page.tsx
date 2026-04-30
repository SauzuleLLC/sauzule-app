'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'

interface Profile {
  goal: string
  currentWeight: number
  targetWeight: number
  dailyCalories: number
  proteinGrams: number
  carbGrams: number
  fatGrams: number
  name?: string
}

interface DailyLog {
  calories: number
  protein: number
  carbs: number
  fat: number
  water: number // cups
  habits: boolean[]
}

const TIPS = [
  "Protein keeps you full and preserves muscle — hit your target every day.",
  "Consistency beats perfection. One off day won't derail your progress.",
  "Track your food before you eat it — it helps you make better choices.",
  "Sleep is a superpower. 7–9 hours accelerates fat loss and muscle gain.",
  "Your body is 60% water. Hydration improves energy, focus, and performance.",
  "Progress photos every 2 weeks show changes the scale misses.",
  "Meal prep on Sunday = discipline on Monday through Friday.",
  "Strength training 3× per week burns more calories than cardio alone long term.",
  "Don't fear carbs — time them around your workouts for best results.",
  "Small wins compound. Every check-in moves you closer to your goal.",
]

const HABIT_LABELS = [
  "Hit protein goal",
  "Completed workout",
  "Took supplements",
  "Slept 7+ hours",
  "10k+ steps",
  "Managed stress",
]

const GOAL_LABELS: Record<string, string> = {
  FAT_LOSS: "Fat Loss",
  MUSCLE_GAIN: "Muscle Gain",
  RECOMPOSITION: "Recomp",
  MAINTENANCE: "Maintenance",
  ATHLETIC_PERFORMANCE: "Performance",
}

function MacroRing({ calories, protein, carbs, fat, targets }: {
  calories: number; protein: number; carbs: number; fat: number
  targets: { calories: number; protein: number; carbs: number; fat: number }
}) {
  const size = 180
  const cx = size / 2
  const cy = size / 2

  function ring(radius: number, value: number, max: number, color: string, overColor = '#f97316') {
    const circumference = 2 * Math.PI * radius
    const pct = Math.min(value / Math.max(max, 1), 1)
    const over = value > max
    const dash = circumference * pct
    return (
      <g>
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#1f2937" strokeWidth={10} />
        <circle
          cx={cx} cy={cy} r={radius} fill="none"
          stroke={over ? overColor : color}
          strokeWidth={10}
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
      </g>
    )
  }

  const calLeft = Math.max(targets.calories - calories, 0)
  const over = calories > targets.calories

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size}>
        {ring(82, calories, targets.calories, '#facc15')}
        {ring(68, protein, targets.protein, '#4ade80')}
        {ring(54, carbs, targets.carbs, '#60a5fa')}
        {ring(40, fat, targets.fat, '#c084fc')}
      </svg>
      <div className="absolute text-center">
        <div className={`text-2xl font-bold ${over ? 'text-orange-400' : 'text-yellow-400'}`}>
          {over ? `+${calories - targets.calories}` : calLeft}
        </div>
        <div className="text-xs text-gray-400">{over ? 'over' : 'kcal left'}</div>
      </div>
    </div>
  )
}

function RingLegend({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.min(Math.round((value / Math.max(max, 1)) * 100), 100)
  return (
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between text-xs mb-0.5">
          <span className="text-gray-400">{label}</span>
          <span className="text-gray-300">{value}g / {max}g</span>
        </div>
        <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
        </div>
      </div>
    </div>
  )
}

function WaterTracker({ cups, onChange }: { cups: number; onChange: (n: number) => void }) {
  const total = 12
  const ozPerCup = 8
  const goalCups = 12
  const pct = Math.round((cups / goalCups) * 100)

  return (
    <div className="bg-gray-900 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-white">💧 Water</h3>
        <span className="text-sm text-gray-400">{cups * ozPerCup} / {goalCups * ozPerCup} oz</span>
      </div>
      <div className="grid grid-cols-6 gap-1.5 mb-3">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            onClick={() => onChange(i < cups ? i : i + 1)}
            className={`h-8 rounded-lg text-sm transition-all ${
              i < cups
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                : 'bg-gray-800 text-gray-600 hover:bg-gray-700'
            }`}
          >
            💧
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-xs text-gray-400 w-8 text-right">{pct}%</span>
      </div>
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => onChange(Math.max(0, cups - 1))}
          className="flex-1 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors"
        >
          −1 cup
        </button>
        <button
          onClick={() => onChange(Math.min(total, cups + 1))}
          className="flex-1 py-1.5 bg-blue-900/50 hover:bg-blue-800/50 text-blue-300 rounded-lg text-sm transition-colors"
        >
          +1 cup
        </button>
      </div>
    </div>
  )
}

function HabitChecklist({ habits, onChange }: { habits: boolean[]; onChange: (i: number) => void }) {
  const done = habits.filter(Boolean).length
  return (
    <div className="bg-gray-900 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-white">✅ Daily Habits</h3>
        <span className="text-sm text-gray-400">{done}/{HABIT_LABELS.length}</span>
      </div>
      <div className="space-y-2">
        {HABIT_LABELS.map((label, i) => (
          <button
            key={i}
            onClick={() => onChange(i)}
            className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all text-left ${
              habits[i] ? 'bg-green-900/40 border border-green-700/50' : 'bg-gray-800 border border-transparent hover:border-gray-700'
            }`}
          >
            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
              habits[i] ? 'bg-green-500' : 'border-2 border-gray-600'
            }`}>
              {habits[i] && <span className="text-xs text-white">✓</span>}
            </div>
            <span className={`text-sm ${habits[i] ? 'text-green-300' : 'text-gray-400'}`}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

const QUICK_ACTIONS = [
  { label: 'Meals', icon: '🥗', href: '/client/meals' },
  { label: 'Workout', icon: '🏋️', href: '/client/workout' },
  { label: 'Fast Food', icon: '🍔', href: '/client/fast-food' },
  { label: 'Grocery', icon: '🛒', href: '/client/grocery' },
  { label: 'Supplements', icon: '💊', href: '/client/supplements' },
  { label: 'Check In', icon: '📊', href: '/client/check-in' },
]

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function todayKey() {
  return `sauzule-dashboard-${new Date().toISOString().split('T')[0]}`
}

const DEFAULT_LOG: DailyLog = {
  calories: 0, protein: 0, carbs: 0, fat: 0,
  water: 0,
  habits: [false, false, false, false, false, false],
}

export default function ClientDashboard() {
  const { data: session } = useSession()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [log, setLog] = useState<DailyLog>(DEFAULT_LOG)
  const [tip] = useState(() => TIPS[Math.floor(Math.random() * TIPS.length)])

  // Load profile
  useEffect(() => {
    fetch('/api/client/profile')
      .then(r => r.ok ? r.json() : null)
      .then(d => d && setProfile(d))
      .catch(() => {})
  }, [])

  // Load/save daily log from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(todayKey())
      if (saved) setLog(JSON.parse(saved))
    } catch {}
  }, [])

  useEffect(() => {
    try { localStorage.setItem(todayKey(), JSON.stringify(log)) } catch {}
  }, [log])

  function addMacros(cal: number, pro: number, carb: number, fat: number) {
    setLog(l => ({ ...l, calories: l.calories + cal, protein: l.protein + pro, carbs: l.carbs + carb, fat: l.fat + fat }))
  }

  function toggleHabit(i: number) {
    setLog(l => {
      const habits = [...l.habits]
      habits[i] = !habits[i]
      return { ...l, habits }
    })
  }

  const targets = useMemo(() => ({
    calories: profile?.dailyCalories ?? 2000,
    protein: profile?.proteinGrams ?? 150,
    carbs: profile?.carbGrams ?? 200,
    fat: profile?.fatGrams ?? 65,
  }), [profile])

  const weightProgress = useMemo(() => {
    if (!profile?.currentWeight || !profile?.targetWeight) return null
    const start = profile.currentWeight
    const target = profile.targetWeight
    const current = profile.currentWeight
    if (start === target) return null
    const losing = target < start
    const totalChange = Math.abs(target - start)
    const achieved = losing ? Math.max(0, start - current) : Math.max(0, current - start)
    return { pct: Math.min(100, Math.round((achieved / totalChange) * 100)), current, target, losing }
  }, [profile])

  const firstName = session?.user?.name?.split(' ')[0] ?? profile?.name?.split(' ')[0] ?? 'there'

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-28">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-950/95 backdrop-blur-sm border-b border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">{getGreeting()},</p>
            <h1 className="text-lg font-bold text-yellow-400">{firstName} 👋</h1>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
            {profile?.goal && (
              <div className="text-xs text-yellow-500 font-medium mt-0.5">{GOAL_LABELS[profile.goal] ?? profile.goal}</div>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">

        {/* Tip banner */}
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 flex gap-3">
          <span className="text-lg">💡</span>
          <p className="text-xs text-yellow-200/80 leading-relaxed">{tip}</p>
        </div>

        {/* Macro Ring + Legend */}
        <div className="bg-gray-900 rounded-2xl p-4">
          <h2 className="font-semibold text-white mb-4 text-center">Today&apos;s Macros</h2>
          <div className="flex flex-col items-center gap-4">
            <MacroRing
              calories={log.calories} protein={log.protein}
              carbs={log.carbs} fat={log.fat} targets={targets}
            />
            <div className="w-full space-y-2">
              <RingLegend label="Calories (kcal)" value={log.calories} max={targets.calories} color="#facc15" />
              <RingLegend label="Protein" value={log.protein} max={targets.protein} color="#4ade80" />
              <RingLegend label="Carbs" value={log.carbs} max={targets.carbs} color="#60a5fa" />
              <RingLegend label="Fat" value={log.fat} max={targets.fat} color="#c084fc" />
            </div>
          </div>

          {/* Quick Log Buttons */}
          <div className="mt-4 border-t border-gray-800 pt-4">
            <p className="text-xs text-gray-500 mb-2">Quick Log</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: '+100 kcal', cal: 100, pro: 0, carb: 20, fat: 3 },
                { label: '+10g protein', cal: 40, pro: 10, carb: 0, fat: 0 },
                { label: '+20g carbs', cal: 80, pro: 0, carb: 20, fat: 0 },
                { label: '+10g fat', cal: 90, pro: 0, carb: 0, fat: 10 },
              ].map(btn => (
                <button
                  key={btn.label}
                  onClick={() => addMacros(btn.cal, btn.pro, btn.carb, btn.fat)}
                  className="py-2 px-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-sm font-medium transition-colors"
                >
                  {btn.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setLog(l => ({ ...l, calories: 0, protein: 0, carbs: 0, fat: 0 }))}
              className="w-full mt-2 py-1.5 text-xs text-gray-600 hover:text-gray-400 transition-colors"
            >
              Reset macros
            </button>
          </div>
        </div>

        {/* Water Tracker */}
        <WaterTracker cups={log.water} onChange={n => setLog(l => ({ ...l, water: n }))} />

        {/* Habit Checklist */}
        <HabitChecklist habits={log.habits} onChange={toggleHabit} />

        {/* Weight Progress */}
        {weightProgress && (
          <div className="bg-gray-900 rounded-2xl p-4">
            <h3 className="font-semibold text-white mb-3">⚖️ Weight Goal</h3>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Current: <span className="text-white font-medium">{weightProgress.current} lbs</span></span>
              <span className="text-gray-400">Target: <span className="text-yellow-400 font-medium">{weightProgress.target} lbs</span></span>
            </div>
            <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full transition-all duration-700"
                style={{ width: `${weightProgress.pct}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">{weightProgress.pct}% of the way to your goal</p>
          </div>
        )}

        {/* Quick Actions */}
        <div>
          <h3 className="font-semibold text-white mb-3">Quick Actions</h3>
          <div className="grid grid-cols-3 gap-3">
            {QUICK_ACTIONS.map(action => (
              <Link
                key={action.href}
                href={action.href}
                className="bg-gray-900 hover:bg-gray-800 rounded-2xl p-4 flex flex-col items-center gap-2 transition-all active:scale-95 border border-gray-800 hover:border-gray-700"
              >
                <span className="text-2xl">{action.icon}</span>
                <span className="text-xs text-gray-400 font-medium text-center">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Check In CTA */}
        <Link
          href="/client/check-in"
          className="block bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 rounded-2xl p-4 text-center transition-all active:scale-95"
        >
          <div className="text-lg font-bold text-gray-950">📊 Weekly Check-In</div>
          <div className="text-xs text-yellow-900 mt-0.5">Log progress & get AI recommendations</div>
        </Link>

      </div>
    </div>
  )
}
