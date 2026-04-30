'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

const GOALS = [
  { value: 'FAT_LOSS',             label: 'Burn Fat',              icon: '🔥', desc: 'Lose weight and shed body fat' },
  { value: 'MUSCLE_GAIN',          label: 'Build Muscle',          icon: '💪', desc: 'Gain lean muscle and get stronger' },
  { value: 'RECOMPOSITION',        label: 'Get Toned',             icon: '⚡', desc: 'Lose fat and build muscle together' },
  { value: 'MAINTENANCE',          label: 'Stay Healthy',          icon: '⚖️', desc: 'Maintain weight and feel your best' },
  { value: 'ATHLETIC_PERFORMANCE', label: 'Athletic Performance',  icon: '🏆', desc: 'Optimize for sport and competition' },
]

const DIET_TYPES = [
  { value: 'HIGH_PROTEIN',   label: 'High Protein',    desc: 'Maximize protein for muscle & satiety' },
  { value: 'BALANCED',       label: 'Balanced',        desc: 'Even mix of protein, carbs & fats' },
  { value: 'LOW_CARB',       label: 'Low Carb',        desc: 'Reduce carbs to accelerate fat loss' },
  { value: 'KETO',           label: 'Keto',            desc: 'Very low carb, high fat protocol' },
  { value: 'MEDITERRANEAN',  label: 'Mediterranean',   desc: 'Whole foods and healthy fats' },
  { value: 'VEGAN',          label: 'Vegan',           desc: '100% plant-based nutrition' },
]

const ACTIVITY_LEVELS = [
  { value: 'SEDENTARY',   label: 'Not Very Active', desc: 'Desk job, little exercise' },
  { value: 'LIGHT',       label: 'Lightly Active',  desc: 'Exercise 1–2 days/week' },
  { value: 'MODERATE',    label: 'Moderately Active', desc: 'Exercise 3–4 days/week' },
  { value: 'VERY_ACTIVE', label: 'Very Active',     desc: 'Exercise 5–6 days/week' },
  { value: 'ATHLETE',     label: 'Athlete',         desc: 'Training daily or twice a day' },
]

const ALLERGIES = ['Gluten', 'Dairy', 'Eggs', 'Nuts', 'Shellfish', 'Soy', 'Fish', 'None']

const s = (active: boolean) => ({
  background: active ? '#1a1508' : '#111111',
  border: `1px solid ${active ? '#b8985a' : '#1e1e1e'}`,
  color: active ? '#b8985a' : '#e8e0d0',
  borderRadius: '12px',
  padding: '14px 16px',
  width: '100%',
  textAlign: 'left' as const,
  cursor: 'pointer',
  transition: 'all 0.15s',
})

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const [goal, setGoal]             = useState('FAT_LOSS')
  const [name, setName]             = useState('')
  const [email, setEmail]           = useState('')
  const [pw, setPw]                 = useState('')
  const [pw2, setPw2]               = useState('')
  const [sex, setSex]               = useState('MALE')
  const [age, setAge]               = useState('')
  const [hFt, setHFt]               = useState('')
  const [hIn, setHIn]               = useState('')
  const [wt, setWt]                 = useState('')
  const [twt, setTwt]               = useState('')
  const [activity, setActivity]     = useState('MODERATE')
  const [diet, setDiet]             = useState('HIGH_PROTEIN')
  const [allergies, setAllergies]   = useState<string[]>([])
  const [favs, setFavs]             = useState('')
  const [avoids, setAvoids]         = useState('')

  const steps = ['Your Goal', 'About You', 'Activity Level', 'Eating Style', 'Food Preferences', 'Create Account']

  function toggleAllergy(a: string) {
    if (a === 'None') { setAllergies([]); return }
    setAllergies(p => p.includes(a) ? p.filter(x => x !== a) : [...p.filter(x => x !== 'None'), a])
  }

  function next() {
    setErr('')
    if (step === 1 && !name.trim()) { setErr('Please enter your name'); return }
    if (step === 5) { submit(); return }
    setStep(p => p + 1)
  }

  async function submit() {
    if (!email.trim()) { setErr('Email is required'); return }
    if (pw.length < 8) { setErr('Password must be at least 8 characters'); return }
    if (pw !== pw2) { setErr('Passwords do not match'); return }
    setBusy(true)
    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name, email, password: pw, goal, activityLevel: activity, dietType: diet, sex,
        age: parseInt(age) || undefined,
        heightInches: ((parseInt(hFt) || 0) * 12 + (parseInt(hIn) || 0)) || undefined,
        currentWeight: parseFloat(wt) || undefined,
        targetWeight: parseFloat(twt) || undefined,
        allergies, favFoods: favs, avoidFoods: avoids,
      }),
    })
    const data = await res.json()
    if (!res.ok) { setErr(data.error || 'Something went wrong'); setBusy(false); return }
    await signIn('client-login', { email, password: pw, redirect: false })
    router.push('/client')
  }

  const inp = {
    className: 'w-full px-4 py-3 rounded-xl text-sm outline-none',
    style: { background: '#111111', border: '1px solid #1e1e1e', color: '#e8e0d0' } as React.CSSProperties,
  }
  const lbl = { className: 'block text-xs mb-2 uppercase tracking-widest', style: { color: '#555' } as React.CSSProperties }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#080808', color: '#e8e0d0' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', padding: '32px 16px 16px' }}>
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '26px', color: '#b8985a', letterSpacing: '4px' }}>SAUZULE</div>
        <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>{steps[step]}</div>
      </div>

      {/* Progress bar */}
      <div style={{ padding: '0 20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          {steps.map((_, i) => (
            <div key={i} style={{ flex: 1, height: '3px', borderRadius: '99px', background: i <= step ? '#b8985a' : '#1e1e1e', transition: 'background 0.3s' }} />
          ))}
        </div>
        <div style={{ textAlign: 'center', fontSize: '11px', color: '#444', marginTop: '6px' }}>Step {step + 1} of {steps.length}</div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '0 20px', maxWidth: '560px', margin: '0 auto', width: '100%' }}>

        {step === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {GOALS.map(g => (
              <button key={g.value} onClick={() => setGoal(g.value)} style={s(goal === g.value)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span style={{ fontSize: '28px' }}>{g.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '2px' }}>{g.label}</div>
                    <div style={{ fontSize: '12px', color: '#777' }}>{g.desc}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label {...lbl}>Full Name</label>
              <input {...inp} type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Smith" />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <label {...lbl}>Sex</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['MALE','FEMALE'].map(v => (
                    <button key={v} onClick={() => setSex(v)}
                      style={{ ...s(sex===v), padding: '10px', textAlign: 'center', flex: 1, fontSize: '13px' }}>
                      {v === 'MALE' ? 'Male' : 'Female'}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ width: '80px' }}>
                <label {...lbl}>Age</label>
                <input {...inp} type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="30" style={{ ...inp.style, textAlign: 'center' }} />
              </div>
            </div>
            <div>
              <label {...lbl}>Height</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <input {...inp} type="number" value={hFt} onChange={e => setHFt(e.target.value)} placeholder="5" />
                  <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: '#555' }}>ft</span>
                </div>
                <div style={{ position: 'relative', flex: 1 }}>
                  <input {...inp} type="number" value={hIn} onChange={e => setHIn(e.target.value)} placeholder="10" />
                  <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: '#555' }}>in</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <label {...lbl}>Current Weight</label>
                <div style={{ position: 'relative' }}>
                  <input {...inp} type="number" value={wt} onChange={e => setWt(e.target.value)} placeholder="185" />
                  <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: '#555' }}>lbs</span>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <label {...lbl}>Goal Weight</label>
                <div style={{ position: 'relative' }}>
                  <input {...inp} type="number" value={twt} onChange={e => setTwt(e.target.value)} placeholder="165" />
                  <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: '#555' }}>lbs</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {ACTIVITY_LEVELS.map(a => (
              <button key={a.value} onClick={() => setActivity(a.value)} style={s(activity === a.value)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: '14px' }}>{a.label}</span>
                  <span style={{ fontSize: '11px', color: '#666' }}>{a.desc}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {step === 3 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {DIET_TYPES.map(d => (
              <button key={d.value} onClick={() => setDiet(d.value)} style={{ ...s(diet === d.value), padding: '16px' }}>
                <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '4px' }}>{d.label}</div>
                <div style={{ fontSize: '11px', color: '#666', lineHeight: 1.4 }}>{d.desc}</div>
              </button>
            ))}
          </div>
        )}

        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label {...lbl}>Allergies / Foods to Avoid</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {ALLERGIES.map(a => {
                  const active = a === 'None' ? allergies.length === 0 : allergies.includes(a)
                  return (
                    <button key={a} onClick={() => toggleAllergy(a)}
                      style={{ padding: '7px 14px', borderRadius: '99px', fontSize: '12px', cursor: 'pointer',
                        background: active ? '#b8985a' : '#111', border: `1px solid ${active ? '#b8985a' : '#1e1e1e'}`,
                        color: active ? '#080808' : '#e8e0d0' }}>
                      {a}
                    </button>
                  )
                })}
              </div>
            </div>
            <div>
              <label {...lbl}>Foods You Love ❤️  <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(separate with commas)</span></label>
              <textarea value={favs} onChange={e => setFavs(e.target.value)}
                placeholder="e.g. Chicken, rice, eggs, broccoli, Greek yogurt..."
                rows={3}
                style={{ ...inp.style, width: '100%', resize: 'none', padding: '12px 16px', lineHeight: 1.5 }} />
            </div>
            <div>
              <label {...lbl}>Foods You Dislike or Avoid 👎</label>
              <textarea value={avoids} onChange={e => setAvoids(e.target.value)}
                placeholder="e.g. Salmon, Brussels sprouts, liver..."
                rows={2}
                style={{ ...inp.style, width: '100%', resize: 'none', padding: '12px 16px', lineHeight: 1.5 }} />
            </div>
          </div>
        )}

        {step === 5 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '16px', borderRadius: '12px', background: '#111', border: '1px solid #1e1e1e', marginBottom: '4px' }}>
              <div style={{ fontSize: '13px', color: '#b8985a', fontWeight: 600, marginBottom: '6px' }}>🎉 Almost done!</div>
              <p style={{ fontSize: '12px', color: '#666', lineHeight: 1.6, margin: 0 }}>
                Create your login and we'll instantly build your personalized meal plan, workout schedule, supplement protocol, water goal, and sleep target.
              </p>
            </div>
            <div>
              <label {...lbl}>Email Address</label>
              <input {...inp} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" />
            </div>
            <div>
              <label {...lbl}>Password</label>
              <input {...inp} type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="At least 8 characters" />
            </div>
            <div>
              <label {...lbl}>Confirm Password</label>
              <input {...inp} type="password" value={pw2} onChange={e => setPw2(e.target.value)} placeholder="Re-enter your password" />
            </div>
            {err && <p style={{ fontSize: '13px', color: '#f87171', padding: '10px 14px', background: 'rgba(248,113,113,0.08)', borderRadius: '8px', border: '1px solid rgba(248,113,113,0.2)', margin: 0 }}>{err}</p>}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={{ padding: '24px 20px 36px', maxWidth: '560px', margin: '0 auto', width: '100%', display: 'flex', gap: '10px' }}>
        {step > 0 && (
          <button onClick={() => { setStep(p => p - 1); setErr('') }}
            style={{ padding: '14px 20px', borderRadius: '12px', fontSize: '14px', background: '#111', border: '1px solid #1e1e1e', color: '#e8e0d0', cursor: 'pointer' }}>
            Back
          </button>
        )}
        <button onClick={next} disabled={busy}
          style={{ flex: 1, padding: '14px', borderRadius: '12px', fontSize: '14px', fontWeight: 600, letterSpacing: '0.06em',
            background: '#b8985a', color: '#080808', border: 'none', cursor: busy ? 'not-allowed' : 'pointer', opacity: busy ? 0.7 : 1 }}>
          {step === 5 ? (busy ? 'Building your plan…' : 'Create My Plan ✨') : 'Continue →'}
        </button>
      </div>

      <div style={{ textAlign: 'center', paddingBottom: '32px' }}>
        <a href="/client/login" style={{ fontSize: '12px', color: '#444', textDecoration: 'none' }}>
          Already have an account? Sign in
        </a>
      </div>
    </div>
  )
}
