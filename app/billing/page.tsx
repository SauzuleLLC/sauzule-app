'use client'
import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/coach/Sidebar'

type Plan = { id: string; name: string; priceMonthly: number; stripePriceId?: string; features: string[] }

export default function BillingPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [saving, setSaving] = useState<string | null>(null)
  const [prices, setPrices] = useState<Record<string, number>>({})

  useEffect(() => {
    fetch('/api/billing/plans').then(r => r.json()).then(data => {
      setPlans(data)
      const p: Record<string, number> = {}
      data.forEach((plan: Plan) => { p[plan.id] = plan.priceMonthly / 100 })
      setPrices(p)
    })
  }, [])

  async function savePlan(planId: string) {
    setSaving(planId)
    await fetch(`/api/billing/plans/${planId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceMonthly: Math.round(prices[planId] * 100) }),
    })
    setSaving(null)
    alert('Price updated! New subscribers will see this price immediately.')
  }

  const defaultPlans = [
    { name: 'Starter', price: 39, features: ['AI meal plan', 'Food preference setup', 'Food logging'] },
    { name: 'Standard', price: 59, features: ['Everything in Starter', 'Fast food logging (40+ chains)', 'Sunday weekly reset'] },
    { name: 'Elite', price: 99, features: ['Everything in Standard', 'Supplement stack recommendations', 'Amazon affiliate links', 'Priority support'] },
  ]

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto px-8 py-6">
        <h1 className="serif text-2xl mb-1" style={{ color: 'var(--txt)' }}>Billing & Pricing</h1>
        <p className="text-xs mb-8" style={{ color: 'var(--muted)' }}>
          Set your prices below — changes apply to all new subscriptions immediately via Stripe.
        </p>

        <div className="grid grid-cols-3 gap-5 mb-8">
          {(plans.length > 0 ? plans : defaultPlans.map((p, i) => ({
            id: String(i), name: p.name, priceMonthly: p.price * 100,
            stripePriceId: undefined, features: p.features,
          }))).map((plan, idx) => (
            <div key={plan.id}
                 className="rounded-xl p-5"
                 style={{
                   background: idx === 1 ? 'var(--gold-dim)' : 'var(--card2)',
                   border: `1px solid ${idx === 1 ? 'var(--gold)' : 'var(--border)'}`,
                 }}>
              {idx === 1 && (
                <p className="text-[10px] mb-2" style={{ color: 'var(--gold)', letterSpacing: '1px' }}>★ MOST POPULAR</p>
              )}
              <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--muted)' }}>{plan.name}</p>
              <p className="serif text-4xl mb-1" style={{ color: 'var(--txt)' }}>
                ${prices[plan.id] ?? plan.priceMonthly / 100}
              </p>
              <p className="text-xs mb-4" style={{ color: 'var(--muted)' }}>/month</p>

              {/* Price editor */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm" style={{ color: 'var(--muted)' }}>$</span>
                <input
                  type="number"
                  value={prices[plan.id] ?? plan.priceMonthly / 100}
                  onChange={e => setPrices(prev => ({ ...prev, [plan.id]: Number(e.target.value) }))}
                  className="w-20 text-center text-base rounded px-2 py-1"
                  style={{ border: '1px solid var(--gold)', color: 'var(--gold)', fontFamily: 'Cormorant Garamond, serif' }}
                  min={1}
                />
                <button
                  onClick={() => savePlan(plan.id)}
                  disabled={saving === plan.id}
                  className="px-3 py-1 rounded text-xs font-medium"
                  style={{ background: 'var(--gold)', color: '#080808' }}>
                  {saving === plan.id ? '…' : 'Set'}
                </button>
              </div>

              <ul className="space-y-1">
                {plan.features.map((f, i) => (
                  <li key={i} className="text-xs" style={{ color: 'var(--muted)' }}>✓ {f}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Stripe info */}
        <div className="rounded-xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <p className="text-xs uppercase tracking-wider mb-4" style={{ color: 'var(--muted)' }}>Stripe Configuration</p>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p style={{ color: 'var(--muted)' }} className="text-xs">Account</p>
              <p style={{ color: 'var(--txt)' }}>Sauzule LLC</p>
              <p style={{ color: 'var(--muted)' }} className="text-xs">acct_1Sk8m2KoT00YsIn5</p>
            </div>
            <div>
              <p style={{ color: 'var(--muted)' }} className="text-xs">Processing Fee</p>
              <p style={{ color: 'var(--txt)' }}>2.9% + $0.30 / transaction</p>
            </div>
            <div>
              <p style={{ color: 'var(--muted)' }} className="text-xs">Payouts</p>
              <p style={{ color: 'var(--txt)' }}>Automatic · 2-day rolling</p>
            </div>
          </div>
          <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
            <a href="https://dashboard.stripe.com" target="_blank"
               className="text-xs" style={{ color: 'var(--gold)' }}>
              Open Stripe Dashboard →
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
