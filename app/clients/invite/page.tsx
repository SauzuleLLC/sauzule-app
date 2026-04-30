'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/coach/Sidebar'

export default function InviteClientPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [planId, setPlanId] = useState('')
  const [plans, setPlans] = useState<{ id: string; name: string; priceMonthly: number }[]>([])
  const [loading, setLoading] = useState(false)
  const [inviteUrl, setInviteUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/billing/plans')
      .then(r => r.json())
      .then(d => setPlans(d.plans || []))
      .catch(() => {})
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim()) { setError('Name and email are required'); return }
    setLoading(true)
    setError('')
    const res = await fetch('/api/clients/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, planId: planId || undefined }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setError(data.error || 'Something went wrong'); return }
    setInviteUrl(data.inviteUrl)
  }

  function copyLink() {
    navigator.clipboard.writeText(inviteUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto px-4 md:px-8 pt-14 md:pt-6 pb-20 md:pb-6">
        <div className="max-w-lg">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.push('/clients')}
              className="text-xs mb-4 flex items-center gap-1 transition-colors"
              style={{ color: 'var(--muted)' }}
              onMouseOver={e => (e.currentTarget.style.color = 'var(--gold)')}
              onMouseOut={e => (e.currentTarget.style.color = 'var(--muted)')}
            >
              ← Back to Clients
            </button>
            <h1 className="serif text-2xl" style={{ color: 'var(--txt)' }}>Invite a Client</h1>
            <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
              Generate a personal invite link. Send it to your client and they'll complete onboarding themselves.
            </p>
          </div>

          {!inviteUrl ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-xs mb-2 uppercase tracking-widest" style={{ color: 'var(--muted)' }}>
                  Client Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. John Smith"
                  className="w-full px-4 py-3 rounded text-sm outline-none transition-all"
                  style={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    color: 'var(--txt)',
                  }}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs mb-2 uppercase tracking-widest" style={{ color: 'var(--muted)' }}>
                  Client Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="client@email.com"
                  className="w-full px-4 py-3 rounded text-sm outline-none transition-all"
                  style={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    color: 'var(--txt)',
                  }}
                />
              </div>

              {/* Plan */}
              {plans.length > 0 && (
                <div>
                  <label className="block text-xs mb-2 uppercase tracking-widest" style={{ color: 'var(--muted)' }}>
                    Pricing Plan <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(optional)</span>
                  </label>
                  <select
                    value={planId}
                    onChange={e => setPlanId(e.target.value)}
                    className="w-full px-4 py-3 rounded text-sm outline-none"
                    style={{
                      background: 'var(--card)',
                      border: '1px solid var(--border)',
                      color: 'var(--txt)',
                    }}
                  >
                    <option value="">No plan assigned yet</option>
                    {plans.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} — ${(p.priceMonthly / 100).toFixed(0)}/mo
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {error && (
                <p className="text-sm px-4 py-2 rounded" style={{ color: '#f87171', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)' }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded font-semibold text-sm tracking-wider uppercase transition-all"
                style={{
                  background: 'var(--gold)',
                  color: '#080808',
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? 'Generating…' : 'Generate Invite Link →'}
              </button>
            </form>
          ) : (
            /* Success state - show invite link */
            <div className="space-y-6">
              <div className="p-5 rounded-lg" style={{ background: 'rgba(184,152,90,0.08)', border: '1px solid rgba(184,152,90,0.25)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <span style={{ color: 'var(--gold)' }}>✓</span>
                  <span className="text-sm font-medium" style={{ color: 'var(--txt)' }}>
                    Invite link created for {name}
                  </span>
                </div>
                <p className="text-xs mb-4" style={{ color: 'var(--muted)', lineHeight: 1.6 }}>
                  Send this link to your client. They'll set up their password, choose their goals, enter their stats, and pick their food preferences. Their first meal plan generates automatically.
                </p>

                {/* Link box */}
                <div
                  className="flex items-center gap-2 p-3 rounded text-xs font-mono break-all"
                  style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--muted)' }}
                >
                  <span className="flex-1 truncate">{inviteUrl}</span>
                </div>

                <button
                  onClick={copyLink}
                  className="mt-3 w-full py-3 rounded font-semibold text-sm tracking-wider uppercase transition-all"
                  style={{ background: copied ? '#22c55e' : 'var(--gold)', color: '#080808' }}
                >
                  {copied ? '✓ Copied!' : 'Copy Link'}
                </button>
              </div>

              {/* What happens next */}
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--muted)' }}>What happens next</p>
                {[
                  { n: '1', text: 'Client clicks the link and sets their password' },
                  { n: '2', text: 'They complete a 7-step onboarding (goals, stats, food preferences)' },
                  { n: '3', text: 'AI generates their first 7-day meal plan instantly' },
                  { n: '4', text: 'They appear in your Clients list — ready to manage' },
                ].map(s => (
                  <div key={s.n} className="flex items-start gap-3 text-sm" style={{ color: 'var(--muted)' }}>
                    <span className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
                      style={{ background: 'var(--gold-dim)', color: 'var(--gold)', border: '1px solid var(--border)' }}>
                      {s.n}
                    </span>
                    {s.text}
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { setName(''); setEmail(''); setPlanId(''); setInviteUrl('') }}
                  className="flex-1 py-2.5 rounded text-sm"
                  style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--muted)' }}
                >
                  Invite Another
                </button>
                <button
                  onClick={() => router.push('/clients')}
                  className="flex-1 py-2.5 rounded text-sm font-medium"
                  style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--txt)' }}
                >
                  View All Clients
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
