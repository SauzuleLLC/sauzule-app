'use client'
import { useState } from 'react'

interface Plan {
  id: string
  name: string
  priceMonthly: number
}

interface Props {
  plans: Plan[]
  onClose: () => void
  onSuccess: (inviteUrl: string, clientName: string) => void
}

export function InviteClientModal({ plans, onClose, onSuccess }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [planId, setPlanId] = useState(plans[0]?.id || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/clients/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, planId }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setError(data.error); return }
    onSuccess(data.inviteUrl, name)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.8)' }}>
      <div className="w-full max-w-md rounded-xl p-6" style={{ background: '#111', border: '1px solid #222' }}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-cormorant text-xl" style={{ color: '#b8985a' }}>Invite New Client</h2>
          <button onClick={onClose} className="opacity-40 hover:opacity-100 text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs mb-1 uppercase tracking-widest opacity-60">Full Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded text-sm outline-none"
              style={{ background: '#0d0d0d', border: '1px solid #333', color: '#e8e0d0' }}
              placeholder="John Smith"
            />
          </div>
          <div>
            <label className="block text-xs mb-1 uppercase tracking-widest opacity-60">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded text-sm outline-none"
              style={{ background: '#0d0d0d', border: '1px solid #333', color: '#e8e0d0' }}
              placeholder="john@email.com"
            />
          </div>
          {plans.length > 0 && (
            <div>
              <label className="block text-xs mb-1 uppercase tracking-widest opacity-60">Plan</label>
              <select
                value={planId}
                onChange={e => setPlanId(e.target.value)}
                className="w-full px-4 py-3 rounded text-sm outline-none"
                style={{ background: '#0d0d0d', border: '1px solid #333', color: '#e8e0d0' }}
              >
                {plans.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} — ${(p.priceMonthly / 100).toFixed(0)}/mo
                  </option>
                ))}
              </select>
            </div>
          )}

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded text-sm"
              style={{ background: '#1a1a1a', color: '#999' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded text-sm font-semibold"
              style={{ background: '#b8985a', color: '#080808', opacity: loading ? 0.6 : 1 }}
            >
              {loading ? 'Creating…' : 'Generate Invite Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Success modal - shows invite link to copy
export function InviteLinkModal({ url, name, onClose }: { url: string; name: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.8)' }}>
      <div className="w-full max-w-md rounded-xl p-6 text-center" style={{ background: '#111', border: '1px solid #222' }}>
        <div className="text-4xl mb-3">🎉</div>
        <h2 className="font-cormorant text-xl mb-1" style={{ color: '#b8985a' }}>Invite Created!</h2>
        <p className="text-sm opacity-60 mb-5">Share this link with {name}</p>

        <div
          className="px-4 py-3 rounded text-xs text-left break-all mb-3"
          style={{ background: '#0d0d0d', border: '1px solid #333', color: '#999' }}
        >
          {url}
        </div>

        <div className="flex gap-3">
          <button
            onClick={copy}
            className="flex-1 py-3 rounded text-sm font-semibold"
            style={{ background: copied ? '#22c55e' : '#b8985a', color: '#080808' }}
          >
            {copied ? '✓ Copied!' : 'Copy Link'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded text-sm"
            style={{ background: '#1a1a1a', color: '#999' }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
