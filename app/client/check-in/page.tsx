'use client'
import { useState, useEffect } from 'react'

const DAYS_SINCE_SUNDAY = () => {
  const now = new Date()
  return now.getDay() === 0  // is it Sunday?
}

export default function CheckInPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [alreadyDone, setAlreadyDone] = useState(false)
  const [error, setError] = useState('')
  const [history, setHistory] = useState<any[]>([])

  // Form state
  const [adherence, setAdherence] = useState(3)
  const [energy, setEnergy] = useState(3)
  const [sessions, setSessions] = useState(3)
  const [weightChange, setWeightChange] = useState('')
  const [swapRequest, setSwapRequest] = useState('')
  const [aiNote, setAiNote] = useState('')

  useEffect(() => {
    checkStatus()
  }, [])

  async function checkStatus() {
    const res = await fetch('/api/client/check-in')
    const data = await res.json()
    if (data.completedThisWeek) setAlreadyDone(true)
    if (data.history) setHistory(data.history)
    setLoading(false)
  }

  async function handleSubmit() {
    setSubmitting(true)
    setError('')
    const res = await fetch('/api/client/check-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        adherenceRating: adherence,
        energyRating: energy,
        trainingSessions: sessions,
        weightChange: weightChange ? parseFloat(weightChange) : undefined,
        foodSwapRequest: swapRequest || undefined,
      }),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Something went wrong')
      setSubmitting(false)
      return
    }
    setAiNote(data.aiAdjustment || '')
    setSubmitted(true)
    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: '#b8985a', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="text-center py-16 space-y-6">
        <div className="text-6xl">🎉</div>
        <div>
          <h2 className="font-cormorant text-3xl mb-2" style={{ color: '#b8985a' }}>Check-in Complete!</h2>
          <p className="text-sm opacity-60">Your new meal plan will be ready by 7:30 AM Sunday.</p>
        </div>
        {aiNote && (
          <div className="p-4 rounded text-sm text-left" style={{ background: '#111', border: '1px solid #1a1a1a' }}>
            <div className="text-xs uppercase tracking-widest opacity-40 mb-2">AI Plan Adjustment</div>
            <p className="opacity-80 leading-relaxed">{aiNote}</p>
          </div>
        )}
      </div>
    )
  }

  if (alreadyDone) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-cormorant text-2xl" style={{ color: '#b8985a' }}>Weekly Check-In</h1>
          <p className="text-xs opacity-50 mt-1">Your progress, your plan</p>
        </div>

        <div className="text-center py-10 space-y-4">
          <div className="text-5xl">✅</div>
          <div>
            <h2 className="font-medium mb-1">Check-in complete for this week</h2>
            <p className="text-sm opacity-50">Come back next Sunday to check in again.</p>
          </div>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div>
            <div className="text-xs uppercase tracking-widest opacity-40 mb-3">Past Check-ins</div>
            <div className="space-y-3">
              {history.map((h: any) => (
                <div key={h.id} className="px-4 py-3 rounded" style={{ background: '#111', border: '1px solid #1a1a1a' }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-medium">
                        {new Date(h.weekDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      <div className="text-xs opacity-40 mt-0.5">
                        Adherence {h.adherenceRating}/5 · Energy {h.energyRating}/5 · {h.trainingSessions} sessions
                      </div>
                    </div>
                    {h.weightChange != null && (
                      <div
                        className="text-sm font-semibold"
                        style={{ color: h.weightChange < 0 ? '#22c55e' : h.weightChange > 0 ? '#f97316' : '#b8985a' }}
                      >
                        {h.weightChange > 0 ? '+' : ''}{h.weightChange} lbs
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-cormorant text-2xl" style={{ color: '#b8985a' }}>Weekly Check-In</h1>
        <p className="text-xs opacity-50 mt-1">5 quick questions — then we generate your new plan</p>
      </div>

      {/* Q1: Adherence */}
      <div>
        <label className="block text-sm font-medium mb-1">How well did you follow your meal plan?</label>
        <p className="text-xs opacity-40 mb-3">1 = barely tried, 5 = perfect</p>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              onClick={() => setAdherence(n)}
              className="flex-1 py-3 rounded text-lg font-semibold transition-all"
              style={{
                background: adherence === n ? '#b8985a' : '#111',
                color: adherence === n ? '#080808' : '#e8e0d0',
                border: `1px solid ${adherence === n ? '#b8985a' : '#222'}`,
              }}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="flex justify-between text-xs opacity-40 mt-1">
          <span>Struggled</span>
          <span>Perfect</span>
        </div>
      </div>

      {/* Q2: Energy */}
      <div>
        <label className="block text-sm font-medium mb-1">How were your energy levels this week?</label>
        <p className="text-xs opacity-40 mb-3">1 = exhausted, 5 = incredible</p>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              onClick={() => setEnergy(n)}
              className="flex-1 py-3 rounded text-lg font-semibold transition-all"
              style={{
                background: energy === n ? '#b8985a' : '#111',
                color: energy === n ? '#080808' : '#e8e0d0',
                border: `1px solid ${energy === n ? '#b8985a' : '#222'}`,
              }}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Q3: Training sessions */}
      <div>
        <label className="block text-sm font-medium mb-3">How many training sessions did you complete?</label>
        <div className="flex gap-2 flex-wrap">
          {[0, 1, 2, 3, 4, 5, 6, 7].map(n => (
            <button
              key={n}
              onClick={() => setSessions(n)}
              className="w-12 py-2.5 rounded text-sm font-semibold transition-all"
              style={{
                background: sessions === n ? '#b8985a' : '#111',
                color: sessions === n ? '#080808' : '#e8e0d0',
                border: `1px solid ${sessions === n ? '#b8985a' : '#222'}`,
              }}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Q4: Weight change */}
      <div>
        <label className="block text-sm font-medium mb-1">Weight change this week (optional)</label>
        <p className="text-xs opacity-40 mb-3">Use negative for weight lost (e.g. -2.5)</p>
        <div className="flex items-center gap-3">
          <input
            type="number"
            step="0.1"
            value={weightChange}
            onChange={e => setWeightChange(e.target.value)}
            className="w-32 px-4 py-3 rounded text-sm outline-none"
            style={{ background: '#111', border: '1px solid #222', color: '#e8e0d0' }}
            placeholder="-2.5"
          />
          <span className="text-sm opacity-50">lbs</span>
        </div>
      </div>

      {/* Q5: Food swap request */}
      <div>
        <label className="block text-sm font-medium mb-1">Any food swaps for next week? (optional)</label>
        <p className="text-xs opacity-40 mb-3">e.g. "swap chicken for shrimp" or "no broccoli next week"</p>
        <textarea
          value={swapRequest}
          onChange={e => setSwapRequest(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 rounded text-sm outline-none resize-none"
          style={{ background: '#111', border: '1px solid #222', color: '#e8e0d0' }}
          placeholder="Optional message to your AI nutritionist…"
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full py-4 rounded font-semibold text-sm tracking-widest uppercase"
        style={{ background: '#b8985a', color: '#080808', opacity: submitting ? 0.6 : 1 }}
      >
        {submitting ? 'Generating your new plan…' : 'Submit & Generate New Plan ✨'}
      </button>

      <p className="text-xs text-center opacity-30">
        Your AI nutritionist will adjust next week's plan based on your responses.
        New plan delivered by 7:30 AM Sunday.
      </p>
    </div>
  )
}
