'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

const GOALS = [
  { value: 'FAT_LOSS', label: 'Fat Loss', emoji: '🔥' },
  { value: 'MUSCLE_GAIN', label: 'Build Muscle', emoji: '💪' },
  { value: 'MAINTENANCE', label: 'Maintain', emoji: '⚖️' },
  { value: 'ATHLETIC_PERFORMANCE', label: 'Athletic Performance', emoji: '🏆' },
  { value: 'RECOMPOSITION', label: 'Body Recomposition', emoji: '🔄' },
]

const ACTIVITY_LEVELS = [
  { value: 'SEDENTARY', label: 'Sedentary', desc: 'Little to no exercise' },
  { value: 'LIGHT', label: 'Light', desc: '1-3 days/week' },
  { value: 'MODERATE', label: 'Moderate', desc: '3-5 days/week' },
  { value: 'VERY_ACTIVE', label: 'Very Active', desc: '6-7 days/week' },
  { value: 'ATHLETE', label: 'Athlete', desc: 'Twice daily training' },
]

const DIET_TYPES = [
  { value: 'HIGH_PROTEIN', label: 'High Protein' },
  { value: 'BALANCED', label: 'Balanced' },
  { value: 'LOW_CARB', label: 'Low Carb' },
  { value: 'KETO', label: 'Keto' },
  { value: 'MEDITERRANEAN', label: 'Mediterranean' },
  { value: 'VEGAN', label: 'Vegan' },
  { value: 'VEGETARIAN', label: 'Vegetarian' },
]

const FOOD_ITEMS = {
  Proteins: ['Chicken Breast', 'Ground Beef', 'Salmon', 'Tuna', 'Eggs', 'Shrimp', 'Turkey', 'Greek Yogurt', 'Cottage Cheese', 'Tofu'],
  Carbs: ['White Rice', 'Brown Rice', 'Oats', 'Sweet Potato', 'Pasta', 'Bread', 'Quinoa', 'Potatoes'],
  Vegetables: ['Broccoli', 'Spinach', 'Asparagus', 'Zucchini', 'Peppers', 'Mushrooms', 'Kale', 'Green Beans'],
  Fruits: ['Banana', 'Apple', 'Blueberries', 'Strawberries', 'Mango', 'Pineapple'],
  Other: ['Avocado', 'Olive Oil', 'Nuts', 'Cheese', 'Milk', 'Butter', 'Hot Sauce', 'Soy Sauce'],
}

type Pref = 'LOVE' | 'LIKE' | 'DISLIKE' | 'ALLERGIC' | null

export default function InvitePage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string

  const [step, setStep] = useState(0)
  const [client, setClient] = useState<{ name: string; email: string } | null>(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Form state
  const [password, setPassword] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [goal, setGoal] = useState('FAT_LOSS')
  const [activityLevel, setActivityLevel] = useState('MODERATE')
  const [dietType, setDietType] = useState('HIGH_PROTEIN')
  const [sex, setSex] = useState('MALE')
  const [age, setAge] = useState('')
  const [heightFt, setHeightFt] = useState('')
  const [heightIn, setHeightIn] = useState('')
  const [currentWeight, setCurrentWeight] = useState('')
  const [targetWeight, setTargetWeight] = useState('')
  const [foodPrefs, setFoodPrefs] = useState<Record<string, Pref>>({})

  useEffect(() => {
    fetch(`/api/invite/${token}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) setError(d.error)
        else setClient(d)
      })
  }, [token])

  function togglePref(food: string, pref: Pref) {
    setFoodPrefs(prev => ({
      ...prev,
      [food]: prev[food] === pref ? null : pref,
    }))
  }

  function getPrefColor(pref: Pref) {
    if (pref === 'LOVE') return '#22c55e'
    if (pref === 'LIKE') return '#b8985a'
    if (pref === 'DISLIKE') return '#f97316'
    if (pref === 'ALLERGIC') return '#ef4444'
    return '#333'
  }

  async function handleSubmit() {
    if (password !== confirmPw) { setError('Passwords do not match'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    setSubmitting(true)
    setError('')

    const heightInches = (parseInt(heightFt) || 0) * 12 + (parseInt(heightIn) || 0)
    const prefs = Object.entries(foodPrefs)
      .filter(([, v]) => v !== null)
      .map(([food, pref]) => ({ food, pref }))

    const res = await fetch(`/api/invite/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        password,
        goal,
        activityLevel,
        dietType,
        sex,
        age: parseInt(age) || undefined,
        heightInches: heightInches || undefined,
        currentWeight: parseFloat(currentWeight) || undefined,
        targetWeight: parseFloat(targetWeight) || undefined,
        foodPrefs: prefs,
      }),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Something went wrong')
      setSubmitting(false)
      return
    }

    // Auto sign in
    await signIn('client-login', {
      email: client!.email,
      password,
      redirect: false,
    })
    router.push('/client/meal-plan')
  }

  if (error && !client) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#080808', color: '#e8e0d0' }}>
        <div className="text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-red-400">{error}</p>
          <p className="text-sm opacity-50 mt-2">This invite may have expired or already been used.</p>
        </div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#080808' }}>
        <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: '#b8985a', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  const steps = [
    { title: 'Welcome', subtitle: `Hi ${client.name}! Let's get you set up.` },
    { title: 'Set Password', subtitle: 'Create a password for your portal' },
    { title: 'Your Goal', subtitle: "What's your primary fitness goal?" },
    { title: 'Activity Level', subtitle: 'How active are you currently?' },
    { title: 'Diet Style', subtitle: 'What eating style fits you best?' },
    { title: 'Body Stats', subtitle: 'Help us calculate your personalized targets' },
    { title: 'Food Preferences', subtitle: 'Tell us what you love, like, or avoid' },
  ]

  const PREFS_LIST: Array<{ label: string; emoji: string; desc?: string }> = [
    { label: 'Love', emoji: '❤️', desc: 'Include often' },
    { label: 'Like', emoji: '👍', desc: 'Include sometimes' },
    { label: 'Dislike', emoji: '👎', desc: 'Avoid if possible' },
    { label: 'Allergic', emoji: '🚫', desc: 'Never include' },
  ]

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#080808', color: '#e8e0d0' }}>
      {/* Header */}
      <div className="text-center pt-10 pb-6">
        <div className="font-cormorant text-4xl mb-1" style={{ color: '#b8985a' }}>Sauzule</div>
        <div className="text-sm opacity-50">{steps[step].subtitle}</div>
      </div>

      {/* Progress */}
      <div className="px-6 mb-8">
        <div className="flex gap-1">
          {steps.map((_, i) => (
            <div
              key={i}
              className="flex-1 h-1 rounded-full transition-all"
              style={{ background: i <= step ? '#b8985a' : '#222' }}
            />
          ))}
        </div>
        <div className="text-xs opacity-40 mt-2 text-center">{step + 1} of {steps.length}</div>
      </div>

      {/* Step Content */}
      <div className="flex-1 px-6 max-w-lg mx-auto w-full">

        {/* STEP 0: Welcome */}
        {step === 0 && (
          <div className="text-center space-y-6">
            <div className="text-6xl">🎯</div>
            <div>
              <h2 className="font-cormorant text-3xl mb-2" style={{ color: '#b8985a' }}>
                Welcome to your nutrition journey
              </h2>
              <p className="opacity-60 text-sm leading-relaxed">
                Your coach has set up a personalized plan for you. Complete this quick setup
                and we'll generate your first AI-powered 7-day meal plan based on your preferences.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs text-center">
              {['AI Meal Plans', 'Food Swaps', 'Weekly Reset'].map(f => (
                <div key={f} className="p-3 rounded" style={{ background: '#111', border: '1px solid #222' }}>
                  <div className="opacity-70">{f}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 1: Password */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs mb-1 uppercase tracking-widest opacity-60">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded text-sm outline-none"
                style={{ background: '#111', border: '1px solid #222', color: '#e8e0d0' }}
                placeholder="At least 8 characters"
              />
            </div>
            <div>
              <label className="block text-xs mb-1 uppercase tracking-widest opacity-60">Confirm Password</label>
              <input
                type="password"
                value={confirmPw}
                onChange={e => setConfirmPw(e.target.value)}
                className="w-full px-4 py-3 rounded text-sm outline-none"
                style={{ background: '#111', border: '1px solid #222', color: '#e8e0d0' }}
                placeholder="Re-enter password"
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
          </div>
        )}

        {/* STEP 2: Goal */}
        {step === 2 && (
          <div className="space-y-3">
            {GOALS.map(g => (
              <button
                key={g.value}
                onClick={() => setGoal(g.value)}
                className="w-full flex items-center gap-4 px-4 py-4 rounded text-left transition-all"
                style={{
                  background: goal === g.value ? '#1a1508' : '#111',
                  border: `1px solid ${goal === g.value ? '#b8985a' : '#222'}`,
                  color: '#e8e0d0',
                }}
              >
                <span className="text-2xl">{g.emoji}</span>
                <span className="font-medium">{g.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* STEP 3: Activity */}
        {step === 3 && (
          <div className="space-y-3">
            {ACTIVITY_LEVELS.map(a => (
              <button
                key={a.value}
                onClick={() => setActivityLevel(a.value)}
                className="w-full flex items-center justify-between px-4 py-4 rounded text-left transition-all"
                style={{
                  background: activityLevel === a.value ? '#1a1508' : '#111',
                  border: `1px solid ${activityLevel === a.value ? '#b8985a' : '#222'}`,
                  color: '#e8e0d0',
                }}
              >
                <span className="font-medium">{a.label}</span>
                <span className="text-xs opacity-50">{a.desc}</span>
              </button>
            ))}
          </div>
        )}

        {/* STEP 4: Diet Type */}
        {step === 4 && (
          <div className="grid grid-cols-2 gap-3">
            {DIET_TYPES.map(d => (
              <button
                key={d.value}
                onClick={() => setDietType(d.value)}
                className="px-4 py-4 rounded text-sm font-medium transition-all"
                style={{
                  background: dietType === d.value ? '#1a1508' : '#111',
                  border: `1px solid ${dietType === d.value ? '#b8985a' : '#222'}`,
                  color: dietType === d.value ? '#b8985a' : '#e8e0d0',
                }}
              >
                {d.label}
              </button>
            ))}
          </div>
        )}

        {/* STEP 5: Body Stats */}
        {step === 5 && (
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs mb-1 uppercase tracking-widest opacity-60">Sex</label>
                <div className="flex gap-2">
                  {['MALE', 'FEMALE'].map(s => (
                    <button
                      key={s}
                      onClick={() => setSex(s)}
                      className="flex-1 py-2 rounded text-sm transition-all"
                      style={{
                        background: sex === s ? '#1a1508' : '#111',
                        border: `1px solid ${sex === s ? '#b8985a' : '#222'}`,
                        color: sex === s ? '#b8985a' : '#e8e0d0',
                      }}
                    >
                      {s === 'MALE' ? 'Male' : 'Female'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-xs mb-1 uppercase tracking-widest opacity-60">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={e => setAge(e.target.value)}
                  className="w-full px-4 py-2 rounded text-sm outline-none"
                  style={{ background: '#111', border: '1px solid #222', color: '#e8e0d0' }}
                  placeholder="25"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs mb-1 uppercase tracking-widest opacity-60">Height</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={heightFt}
                  onChange={e => setHeightFt(e.target.value)}
                  className="w-24 px-4 py-2 rounded text-sm outline-none"
                  style={{ background: '#111', border: '1px solid #222', color: '#e8e0d0' }}
                  placeholder="5 ft"
                />
                <input
                  type="number"
                  value={heightIn}
                  onChange={e => setHeightIn(e.target.value)}
                  className="w-24 px-4 py-2 rounded text-sm outline-none"
                  style={{ background: '#111', border: '1px solid #222', color: '#e8e0d0' }}
                  placeholder="10 in"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs mb-1 uppercase tracking-widest opacity-60">Current Weight (lbs)</label>
                <input
                  type="number"
                  value={currentWeight}
                  onChange={e => setCurrentWeight(e.target.value)}
                  className="w-full px-4 py-2 rounded text-sm outline-none"
                  style={{ background: '#111', border: '1px solid #222', color: '#e8e0d0' }}
                  placeholder="185"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs mb-1 uppercase tracking-widest opacity-60">Target Weight (lbs)</label>
                <input
                  type="number"
                  value={targetWeight}
                  onChange={e => setTargetWeight(e.target.value)}
                  className="w-full px-4 py-2 rounded text-sm outline-none"
                  style={{ background: '#111', border: '1px solid #222', color: '#e8e0d0' }}
                  placeholder="170"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Food Preferences */}
        {step === 6 && (
          <div className="space-y-6">
            <div className="flex gap-2 text-xs flex-wrap">
              {PREFS_LIST.map(p => (
                <span key={p.label} className="flex items-center gap-1">
                  <span>{p.emoji}</span>
                  <span className="opacity-60">{p.label}</span>
                </span>
              ))}
            </div>

            {Object.entries(FOOD_ITEMS).map(([category, foods]) => (
              <div key={category}>
                <div className="text-xs uppercase tracking-widest mb-3 opacity-50">{category}</div>
                <div className="flex flex-wrap gap-2">
                  {foods.map(food => {
                    const pref = foodPrefs[food] || null
                    return (
                      <div key={food} className="flex items-center rounded overflow-hidden" style={{ border: `1px solid ${pref ? getPrefColor(pref) : '#222'}` }}>
                        <span className="px-3 py-1 text-sm" style={{ color: pref ? getPrefColor(pref) : '#e8e0d0' }}>{food}</span>
                        <div className="flex">
                          {(['LOVE', 'LIKE', 'DISLIKE', 'ALLERGIC'] as Pref[]).map(p => (
                            <button
                              key={p!}
                              onClick={() => togglePref(food, p)}
                              className="px-1 py-1 text-xs transition-opacity"
                              style={{
                                background: pref === p ? getPrefColor(p) + '30' : 'transparent',
                                color: getPrefColor(p),
                                opacity: pref && pref !== p ? 0.3 : 1,
                              }}
                              title={p!}
                            >
                              {p === 'LOVE' ? '❤️' : p === 'LIKE' ? '👍' : p === 'DISLIKE' ? '👎' : '🚫'}
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}

            {error && <p className="text-sm text-red-400">{error}</p>}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="px-6 pb-10 pt-6 max-w-lg mx-auto w-full flex gap-3">
        {step > 0 && (
          <button
            onClick={() => { setStep(s => s - 1); setError('') }}
            className="px-6 py-3 rounded text-sm"
            style={{ background: '#111', border: '1px solid #222', color: '#e8e0d0' }}
          >
            Back
          </button>
        )}

        {step < steps.length - 1 ? (
          <button
            onClick={() => {
              if (step === 1) {
                if (!password || password.length < 8) { setError('Minimum 8 characters'); return }
                if (password !== confirmPw) { setError('Passwords do not match'); return }
              }
              setError('')
              setStep(s => s + 1)
            }}
            className="flex-1 py-3 rounded font-semibold text-sm tracking-wider uppercase"
            style={{ background: '#b8985a', color: '#080808' }}
          >
            Continue
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 py-3 rounded font-semibold text-sm tracking-wider uppercase"
            style={{ background: '#b8985a', color: '#080808', opacity: submitting ? 0.6 : 1 }}
          >
            {submitting ? 'Generating your plan…' : 'Generate My Plan ✨'}
          </button>
        )}
      </div>
    </div>
  )
}
