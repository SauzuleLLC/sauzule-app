'use client'
import { useState } from 'react'

export function PendingApprovals({ plans }: { plans: any[] }) {
  const [approving, setApproving] = useState<string | null>(null)

  async function approve(planId: string) {
    setApproving(planId)
    await fetch(`/api/meal-plans/${planId}/approve`, { method: 'POST' })
    window.location.reload()
  }

  return (
    <div className="rounded-xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <p className="text-xs mb-4" style={{ color: 'var(--muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>
        Pending Approvals
      </p>
      {plans.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--muted)' }}>All plans approved ✓</p>
      ) : (
        <div className="space-y-3">
          {plans.map(plan => (
            <div key={plan.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--txt)' }}>{plan.client.name}</p>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>
                  AI generated · {new Date(plan.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => approve(plan.id)}
                disabled={approving === plan.id}
                className="px-3 py-1.5 rounded text-xs font-medium"
                style={{ background: 'var(--gold)', color: '#080808' }}>
                {approving === plan.id ? '…' : 'Approve'}
              </button>
            </div>
          ))}
        </div>
      )}
      <p className="text-[11px] mt-4" style={{ color: 'var(--muted)' }}>
        Average approval time: <span style={{ color: 'var(--gold)' }}>under 60 seconds</span>
      </p>
    </div>
  )
}
