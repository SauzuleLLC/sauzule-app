'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

// ── Types ──────────────────────────────────────────────────────────────────────
interface Profile {
  name: string
  goal: string
  currentWeight: number
  targetWeight: number
  targetCalories: number
  targetProtein: number
}

interface CheckInForm {
  weight: string
  mealAdherence: number
  workoutAdherence: number
  energyLevel: number
  sleepHours: string
  waterOz: string
  stressLevel: number
  mood: string
  foodSwapRequest: string
  wins: string
  challenges: string
  supplements: boolean
}

interface Recommendation {
  summary: string
  calories: string
  protein: string
  cardio: string
  strength: string
  supplements: string
  mindset: string
  foodSwap: string
  nextWeekFocus: string
}

// ── Constants ──────────────────────────────────────────────────────────────────
const GOAL_LABELS: Record<string, string> = {
  FAT_LOSS: 'Fat Loss',
  MUSCLE_GAIN: 'Muscle Gain',
  RECOMPOSITION: 'Recomposition',
  MAINTENANCE: 'Maintenance',
  ATHLETIC_PERFORMANCE: 'Athletic Performance',
}

const MOOD_OPTIONS = [
  { value: 'great', label: '😄 Great', color: 'border-green-500 bg-green-900/30 text-green-300' },
  { value: 'good', label: '🙂 Good', color: 'border-blue-500 bg-blue-900/30 text-blue-300' },
  { value: 'okay', label: '😐 Okay', color: 'border-yellow-500 bg-yellow-900/30 text-yellow-300' },
  { value: 'tired', label: '😴 Tired', color: 'border-orange-500 bg-orange-900/30 text-orange-300' },
  { value: 'stressed', label: '😰 Stressed', color: 'border-red-500 bg-red-900/30 text-red-300' },
]

const STEPS = ['Body', 'Adherence', 'Lifestyle', 'Notes', 'Results']

// ── Sub-components ─────────────────────────────────────────────────────────────
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1 justify-center mb-6">
      {STEPS.map((label, i) => (
        <div key={i} className="flex items-center gap-1">
          <div className={`flex flex-col items-center`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
              i < current
                ? 'bg-yellow-500 border-yellow-500 text-gray-950'
                : i === current
                ? 'bg-gray-900 border-yellow-500 text-yellow-400'
                : 'bg-gray-900 border-gray-700 text-gray-600'
            }`}>
              {i < current ? '✓' : i + 1}
            </div>
            <span className={`text-xs mt-0.5 ${i === current ? 'text-yellow-400' : 'text-gray-600'}`}>{label}</span>
          </div>
          {i < total - 1 && (
            <div className={`w-6 h-0.5 mb-4 ${i < current ? 'bg-yellow-500' : 'bg-gray-700'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

function SliderInput({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = '%',
  color = 'yellow',
  description,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
  unit?: string
  color?: string
  description?: string
}) {
  const pct = ((value - min) / (max - min)) * 100
  const colorClass = color === 'yellow' ? '#EAB308' : color === 'blue' ? '#3B82F6' : color === 'green' ? '#22C55E' : '#A855F7'
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-semibold text-gray-200">{label}</label>
        <span className="text-lg font-bold text-yellow-400">{value}{unit}</span>
      </div>
      {description && <p className="text-xs text-gray-500">{description}</p>}
      <div className="relative h-3 bg-gray-800 rounded-full">
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: colorClass }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
        />
      </div>
      <div className="flex justify-between text-xs text-gray-600">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  )
}

function StarRating({
  label,
  value,
  onChange,
  max = 5,
  descriptions,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  max?: number
  descriptions?: string[]
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-200">{label}</label>
      <div className="flex gap-2">
        {Array.from({ length: max }, (_, i) => i + 1).map(n => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-all ${
              n <= value
                ? 'bg-yellow-500 border-yellow-500 text-gray-950'
                : 'bg-gray-800 border-gray-700 text-gray-500 hover:border-yellow-600'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      {descriptions && value > 0 && (
        <p className="text-xs text-yellow-400 text-center">{descriptions[value - 1]}</p>
      )}
    </div>
  )
}

// ── AI Recommendation Generator ────────────────────────────────────────────────
function generateRecommendations(form: CheckInForm, profile: Profile): Recommendation {
  const avgAdherence = (form.mealAdherence + form.workoutAdherence) / 2
  const lowEnergy = form.energyLevel <= 2
  const goodSleep = parseFloat(form.sleepHours) >= 7
  const lowWater = parseFloat(form.waterOz) < 64
  const highStress = form.stressLevel >= 4
  const goal = profile.goal

  // Calorie recommendation
  let calories = `Stay at ${profile.targetCalories} kcal`
  if (form.mealAdherence >= 80 && goal === 'FAT_LOSS') {
    calories = `Consider a ${profile.targetCalories - 100} kcal target this week to accelerate progress`
  } else if (form.mealAdherence < 60) {
    calories = `Focus on hitting ${profile.targetCalories} kcal consistently before adjusting`
  } else if (goal === 'MUSCLE_GAIN' && form.workoutAdherence >= 80) {
    calories = `Bump to ${profile.targetCalories + 150} kcal — you're training hard, fuel it`
  }

  // Protein recommendation
  let protein = `Hit ${profile.targetProtein}g daily — your most important macro`
  if (form.mealAdherence < 70) {
    protein = `Prioritize protein first at every meal — aim for ${profile.targetProtein}g before worrying about carbs/fats`
  } else if (goal === 'MUSCLE_GAIN') {
    protein = `Strong adherence — make sure ${profile.targetProtein}g is spread across 4+ meals for max muscle protein synthesis`
  }

  // Cardio
  let cardio = 'Maintain your current cardio schedule'
  if (goal === 'FAT_LOSS' && form.workoutAdherence >= 80 && !lowEnergy) {
    cardio = 'Add one 20-min fasted walk this week — small push for big results'
  } else if (lowEnergy) {
    cardio = 'Swap one cardio session for light walking — protect your recovery'
  } else if (goal === 'MUSCLE_GAIN') {
    cardio = 'Keep cardio to 2x/week max — prioritize recovery for muscle growth'
  }

  // Strength
  let strength = 'Follow your training plan as written'
  if (form.workoutAdherence >= 90) {
    strength = 'Great training week — try adding 5 lbs to your main lifts'
  } else if (form.workoutAdherence < 50) {
    strength = 'Start with 3 sessions this week — consistency beats intensity'
  } else if (highStress) {
    strength = 'Keep weights moderate — high stress + heavy lifting increases injury risk'
  }

  // Supplements
  let supplements = form.supplements
    ? 'Great supplement consistency — keep it up!'
    : 'Set a daily alarm for your supplements — consistency here amplifies your results'
  if (lowEnergy && !goodSleep) {
    supplements += '. Consider magnesium glycinate 400mg before bed for sleep quality'
  }
  if (goal === 'MUSCLE_GAIN' && form.workoutAdherence >= 70) {
    supplements += '. Creatine 5g daily (any time) is your highest ROI supplement'
  }

  // Mindset
  let mindset = 'You\'re building sustainable habits — stay the course'
  if (avgAdherence >= 80) {
    mindset = '🔥 Exceptional week — you\'re in the top 10% of clients. Keep this momentum'
  } else if (avgAdherence >= 60) {
    mindset = 'Solid effort — identify your 1 biggest friction point and solve it this week'
  } else if (highStress) {
    mindset = 'Stress is your main blocker right now. A 5-min morning walk changes your whole day'
  } else {
    mindset = 'Progress over perfection. Each meal on plan is a win. Stack wins daily'
  }

  // Food swap
  let foodSwap = 'No swap needed — your plan is working'
  if (form.foodSwapRequest.trim()) {
    foodSwap = `Swap request noted: "${form.foodSwapRequest}" — your coach will update next week's plan`
  } else if (goal === 'FAT_LOSS' && form.mealAdherence < 70) {
    foodSwap = 'Ask to swap complex meals for simpler options — adherence beats perfection'
  }

  // Next week focus
  const focuses = []
  if (lowWater) focuses.push('💧 Drink 80+ oz water daily')
  if (!goodSleep) focuses.push('😴 Get 7-8 hrs sleep')
  if (form.mealAdherence < 70) focuses.push('🍽️ Meal prep Sunday')
  if (form.workoutAdherence < 70) focuses.push('💪 Schedule workouts like meetings')
  if (highStress) focuses.push('🧘 10-min daily decompression')
  if (focuses.length === 0) focuses.push('🏆 Maintain your excellent habits')

  return {
    summary: avgAdherence >= 80
      ? 'Outstanding week — your body is responding. Stay disciplined.'
      : avgAdherence >= 60
      ? 'Solid week with room to grow. Identify your top blocker.'
      : 'Rebuilding week — small consistent actions compound into big results.',
    calories,
    protein,
    cardio,
    strength,
    supplements,
    mindset,
    foodSwap,
    nextWeekFocus: focuses.slice(0, 3).join(' · '),
  }
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function CheckInPage() {
  const { data: session } = useSession()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [recs, setRecs] = useState<Recommendation | null>(null)

  const [form, setForm] = useState<CheckInForm>({
    weight: '',
    mealAdherence: 70,
    workoutAdherence: 70,
    energyLevel: 3,
    sleepHours: '7',
    waterOz: '80',
    stressLevel: 2,
    mood: 'good',
    foodSwapRequest: '',
    wins: '',
    challenges: '',
    supplements: true,
  })

  useEffect(() => {
    fetch('/api/client/profile')
      .then(r => r.json())
      .then(setProfile)
      .catch(console.error)
  }, [])

  const set = (key: keyof CheckInForm, value: CheckInForm[keyof CheckInForm]) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const handleSubmit = async () => {
    if (!profile) return
    setSubmitting(true)
    try {
      await fetch('/api/client/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, goalContext: profile.goal }),
      })
      setRecs(generateRecommendations(form, profile))
      setSubmitted(true)
      setStep(4)
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const weightDelta = profile && form.weight
    ? (parseFloat(form.weight) - profile.currentWeight).toFixed(1)
    : null

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-28">
      {/* Header */}
      <div className="bg-gray-950/95 backdrop-blur border-b border-gray-800 px-4 py-4">
        <h1 className="text-xl font-bold text-white">Weekly Check-In</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          {profile && <span className="text-yellow-500 ml-2">· {GOAL_LABELS[profile.goal]}</span>}
        </p>
      </div>

      <div className="px-4 pt-6 max-w-lg mx-auto">
        <StepIndicator current={step} total={5} />

        {/* ── STEP 0: Body Metrics ── */}
        {step === 0 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-yellow-400 mb-1">Body Metrics</h2>
              <p className="text-sm text-gray-500">How's your body responding this week?</p>
            </div>

            {/* Weight input */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
              <label className="block text-sm font-semibold text-gray-200">Today's Weight (lbs)</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  step="0.1"
                  placeholder={profile ? String(profile.currentWeight) : '0.0'}
                  value={form.weight}
                  onChange={e => set('weight', e.target.value)}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-2xl font-bold text-white text-center focus:outline-none focus:border-yellow-500"
                />
                <span className="text-gray-500 font-semibold">lbs</span>
              </div>

              {weightDelta !== null && (
                <div className={`flex items-center justify-center gap-2 py-2 rounded-xl ${
                  parseFloat(weightDelta) < 0
                    ? 'bg-green-900/30 border border-green-700/40'
                    : parseFloat(weightDelta) > 0
                    ? 'bg-red-900/30 border border-red-700/40'
                    : 'bg-gray-800'
                }`}>
                  <span className={`text-lg font-bold ${
                    parseFloat(weightDelta) < 0 ? 'text-green-400' : parseFloat(weightDelta) > 0 ? 'text-red-400' : 'text-gray-400'
                  }`}>
                    {parseFloat(weightDelta) > 0 ? '+' : ''}{weightDelta} lbs
                  </span>
                  <span className="text-sm text-gray-500">vs last check-in</span>
                </div>
              )}

              {profile && (
                <div className="flex justify-between text-xs text-gray-600 border-t border-gray-800 pt-3">
                  <span>Starting: <span className="text-gray-400">{profile.currentWeight} lbs</span></span>
                  <span>Goal: <span className="text-yellow-500">{profile.targetWeight} lbs</span></span>
                  {form.weight && (
                    <span>To go: <span className="text-yellow-500">
                      {Math.abs(parseFloat(form.weight) - profile.targetWeight).toFixed(1)} lbs
                    </span></span>
                  )}
                </div>
              )}
            </div>

            {/* Supplement check */}
            <button
              onClick={() => set('supplements', !form.supplements)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                form.supplements
                  ? 'bg-yellow-900/20 border-yellow-600/50 text-yellow-300'
                  : 'bg-gray-900 border-gray-700 text-gray-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">💊</span>
                <div className="text-left">
                  <p className="font-semibold text-sm">Supplements Consistent</p>
                  <p className="text-xs opacity-70">Took all recommended supplements daily</p>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                form.supplements ? 'bg-yellow-500 border-yellow-500' : 'border-gray-600'
              }`}>
                {form.supplements && <span className="text-gray-950 text-xs font-bold">✓</span>}
              </div>
            </button>
          </div>
        )}

        {/* ── STEP 1: Adherence ── */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-yellow-400 mb-1">Adherence This Week</h2>
              <p className="text-sm text-gray-500">Be honest — this drives your personalized recommendations</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-6">
              <SliderInput
                label="🍽️ Meal Plan Adherence"
                value={form.mealAdherence}
                onChange={v => set('mealAdherence', v)}
                description="How closely did you follow your nutrition plan?"
              />

              {/* Visual interpretation */}
              <div className={`text-center py-2 rounded-xl text-sm font-semibold ${
                form.mealAdherence >= 80 ? 'bg-green-900/30 text-green-400' :
                form.mealAdherence >= 60 ? 'bg-yellow-900/30 text-yellow-400' :
                'bg-red-900/30 text-red-400'
              }`}>
                {form.mealAdherence >= 90 ? '🔥 Elite — you crushed it' :
                 form.mealAdherence >= 80 ? '✅ Great — strong discipline' :
                 form.mealAdherence >= 60 ? '📈 Decent — room to improve' :
                 form.mealAdherence >= 40 ? '⚠️ Needs attention' :
                 '🚨 Rough week — let\'s talk strategy'}
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-6">
              <SliderInput
                label="💪 Workout Adherence"
                value={form.workoutAdherence}
                onChange={v => set('workoutAdherence', v)}
                color="blue"
                description="Percentage of scheduled workouts completed"
              />

              <div className={`text-center py-2 rounded-xl text-sm font-semibold ${
                form.workoutAdherence >= 80 ? 'bg-green-900/30 text-green-400' :
                form.workoutAdherence >= 60 ? 'bg-yellow-900/30 text-yellow-400' :
                'bg-red-900/30 text-red-400'
              }`}>
                {form.workoutAdherence >= 90 ? '🏋️ Beast mode activated' :
                 form.workoutAdherence >= 80 ? '✅ Strong training week' :
                 form.workoutAdherence >= 60 ? '📈 Getting there' :
                 form.workoutAdherence >= 40 ? '⚠️ More sessions needed' :
                 '🚨 Let\'s rebuild the habit'}
              </div>
            </div>

            {/* Combined score */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Weekly Compliance Score</p>
              <p className="text-4xl font-black text-yellow-400">
                {Math.round((form.mealAdherence + form.workoutAdherence) / 2)}%
              </p>
              <p className="text-xs text-gray-600 mt-1">Average across nutrition + training</p>
            </div>
          </div>
        )}

        {/* ── STEP 2: Lifestyle ── */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-yellow-400 mb-1">Lifestyle Metrics</h2>
              <p className="text-sm text-gray-500">Sleep, stress, and energy affect your results as much as diet</p>
            </div>

            {/* Energy */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <StarRating
                label="⚡ Average Energy Level"
                value={form.energyLevel}
                onChange={v => set('energyLevel', v)}
                descriptions={['Exhausted', 'Low energy', 'Okay', 'Good energy', 'High energy!']}
              />
            </div>

            {/* Sleep */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <SliderInput
                label="😴 Average Sleep"
                value={parseFloat(form.sleepHours) || 7}
                onChange={v => set('sleepHours', String(v))}
                min={4}
                max={10}
                step={0.5}
                unit=" hrs"
                color="purple"
                description="Hours per night this week"
              />
              <p className={`text-xs text-center mt-3 ${
                parseFloat(form.sleepHours) >= 7 ? 'text-green-400' : 'text-red-400'
              }`}>
                {parseFloat(form.sleepHours) >= 8 ? '🌟 Optimal recovery zone' :
                 parseFloat(form.sleepHours) >= 7 ? '✅ Good — keep it here' :
                 parseFloat(form.sleepHours) >= 6 ? '⚠️ Sub-optimal — aim for 7+' :
                 '🚨 Sleep debt is killing your results'}
              </p>
            </div>

            {/* Water */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <SliderInput
                label="💧 Daily Water Intake"
                value={parseFloat(form.waterOz) || 80}
                onChange={v => set('waterOz', String(v))}
                min={20}
                max={160}
                step={4}
                unit=" oz"
                color="blue"
                description="Average ounces per day"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>Minimum: 64 oz</span>
                <span>Optimal: 80–100 oz</span>
              </div>
            </div>

            {/* Stress */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <StarRating
                label="🧠 Stress Level"
                value={form.stressLevel}
                onChange={v => set('stressLevel', v)}
                descriptions={['Zen', 'Low stress', 'Moderate', 'High stress', 'Overwhelmed']}
              />
            </div>

            {/* Mood */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <p className="text-sm font-semibold text-gray-200 mb-3">😊 Overall Mood</p>
              <div className="grid grid-cols-2 gap-2">
                {MOOD_OPTIONS.map(m => (
                  <button
                    key={m.value}
                    onClick={() => set('mood', m.value)}
                    className={`py-3 rounded-xl border text-sm font-semibold transition-all ${
                      form.mood === m.value ? m.color : 'bg-gray-800 border-gray-700 text-gray-500'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: Notes ── */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-yellow-400 mb-1">Notes & Requests</h2>
              <p className="text-sm text-gray-500">Help us fine-tune your plan</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">🏆 Your Wins This Week</label>
                <textarea
                  placeholder="What went well? PR in the gym, hit your macros, felt strong…"
                  value={form.wins}
                  onChange={e => set('wins', e.target.value)}
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">🚧 Challenges Faced</label>
                <textarea
                  placeholder="Cravings, social eating, schedule conflicts, low motivation…"
                  value={form.challenges}
                  onChange={e => set('challenges', e.target.value)}
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">🔄 Food Swap Request</label>
                <textarea
                  placeholder="Anything you want swapped on next week's meal plan? (e.g. 'swap chicken for salmon on Wednesday')"
                  value={form.foodSwapRequest}
                  onChange={e => set('foodSwapRequest', e.target.value)}
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500 resize-none"
                />
              </div>
            </div>

            {/* Summary preview */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
              <p className="text-xs text-gray-500 mb-3 font-semibold uppercase tracking-wider">Check-In Summary</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Weight</span><span className="text-white font-semibold">{form.weight || '—'} lbs</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Meals</span><span className="text-yellow-400 font-semibold">{form.mealAdherence}%</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Workouts</span><span className="text-yellow-400 font-semibold">{form.workoutAdherence}%</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Sleep</span><span className="text-white font-semibold">{form.sleepHours} hrs</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Water</span><span className="text-white font-semibold">{form.waterOz} oz</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Energy</span><span className="text-white font-semibold">{form.energyLevel}/5</span></div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full py-4 rounded-2xl text-base font-bold bg-yellow-500 text-gray-950 hover:bg-yellow-400 active:scale-95 transition-all disabled:opacity-50"
            >
              {submitting ? '⏳ Generating your plan…' : '🚀 Submit & Get Recommendations'}
            </button>
          </div>
        )}

        {/* ── STEP 4: Results ── */}
        {step === 4 && recs && (
          <div className="space-y-4">
            <div className="text-center py-4">
              <p className="text-4xl mb-2">🎯</p>
              <h2 className="text-xl font-black text-yellow-400">Your Week {new Date().getMonth() + 1} Recommendations</h2>
              <p className="text-sm text-gray-400 mt-1">{recs.summary}</p>
            </div>

            {/* Score card */}
            <div className="bg-gray-900 border border-yellow-600/40 rounded-2xl p-5">
              <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider font-semibold">Weekly Score</p>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-2xl font-black text-yellow-400">{form.mealAdherence}%</p>
                  <p className="text-xs text-gray-500">Meals</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-yellow-400">{form.workoutAdherence}%</p>
                  <p className="text-xs text-gray-500">Workouts</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-yellow-400">
                    {Math.round((form.mealAdherence + form.workoutAdherence) / 2)}%
                  </p>
                  <p className="text-xs text-gray-500">Overall</p>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            {[
              { icon: '🍽️', label: 'Calories', text: recs.calories },
              { icon: '💪', label: 'Protein', text: recs.protein },
              { icon: '🏃', label: 'Cardio', text: recs.cardio },
              { icon: '🏋️', label: 'Strength', text: recs.strength },
              { icon: '💊', label: 'Supplements', text: recs.supplements },
              { icon: '🧠', label: 'Mindset', text: recs.mindset },
              { icon: '🔄', label: 'Food Swap', text: recs.foodSwap },
            ].map(rec => (
              <div key={rec.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <div className="flex gap-3">
                  <span className="text-xl shrink-0">{rec.icon}</span>
                  <div>
                    <p className="text-xs font-bold text-yellow-400 uppercase tracking-wide mb-1">{rec.label}</p>
                    <p className="text-sm text-gray-300 leading-relaxed">{rec.text}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Next week focus */}
            <div className="bg-yellow-900/20 border border-yellow-600/40 rounded-2xl p-5">
              <p className="text-sm font-bold text-yellow-400 mb-2">🎯 Next Week's Focus</p>
              <p className="text-sm text-yellow-200">{recs.nextWeekFocus}</p>
            </div>

            {/* Coach note */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-400">
                Your check-in has been sent to your coach. Expect your updated meal plan by Sunday.
              </p>
            </div>

            <button
              onClick={() => { setStep(0); setSubmitted(false); setRecs(null) }}
              className="w-full py-3 rounded-xl border border-gray-700 text-sm text-gray-500 hover:text-white transition-all"
            >
              Start new check-in
            </button>
          </div>
        )}

        {/* Navigation */}
        {step < 4 && (
          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <button
                onClick={() => setStep(s => s - 1)}
                className="flex-1 py-3 rounded-2xl border border-gray-700 text-sm font-semibold text-gray-400 hover:text-white transition-all"
              >
                ← Back
              </button>
            )}
            {step < 3 && (
              <button
                onClick={() => setStep(s => s + 1)}
                className="flex-1 py-4 rounded-2xl bg-yellow-500 text-gray-950 font-bold text-sm hover:bg-yellow-400 active:scale-95 transition-all"
              >
                Next →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
