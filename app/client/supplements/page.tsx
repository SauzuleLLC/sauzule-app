'use client'
import { useState, useEffect } from 'react'

interface Supplement {
  id: string
  name: string
  priority: 'ESSENTIAL' | 'RECOMMENDED' | 'OPTIONAL'
  dosage: string
  timing: string
  benefits: string
  amazonUrl: string
  goal: string
}

const PRIORITY_CONFIG = {
  ESSENTIAL: { label: 'Essential', color: '#b8985a', emoji: '⭐' },
  RECOMMENDED: { label: 'Recommended', color: '#7c6fa0', emoji: '👍' },
  OPTIONAL: { label: 'Optional', color: '#555', emoji: '➕' },
}

export default function SupplementsPage() {
  const [supplements, setSupplements] = useState<Supplement[]>([])
  const [loading, setLoading] = useState(true)
  const [goalLabel, setGoalLabel] = useState('')
  const [filter, setFilter] = useState<'ALL' | 'ESSENTIAL' | 'RECOMMENDED' | 'OPTIONAL'>('ALL')

  useEffect(() => {
    fetch('/api/client/supplements')
      .then(r => r.json())
      .then(data => {
        if (!data.error) {
          setSupplements(data.supplements)
          setGoalLabel(data.goalLabel)
        }
        setLoading(false)
      })
  }, [])

  async function handleAffiliateClick(supp: Supplement) {
    // Log the click
    fetch('/api/client/affiliate-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ supplementId: supp.id, amazonUrl: supp.amazonUrl }),
    })
    window.open(supp.amazonUrl, '_blank', 'noopener')
  }

  const filtered = filter === 'ALL' ? supplements : supplements.filter(s => s.priority === filter)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: '#b8985a', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="font-cormorant text-2xl" style={{ color: '#b8985a' }}>Supplement Stack</h1>
        {goalLabel && (
          <p className="text-xs opacity-50 mt-1">Recommended for {goalLabel}</p>
        )}
      </div>

      {/* Disclaimer */}
      <div className="px-4 py-3 rounded text-xs opacity-60" style={{ background: '#111', border: '1px solid #1a1a1a' }}>
        💡 These recommendations are from your coach. Always consult a doctor before starting any supplement regimen.
        Amazon links support Sauzule at no extra cost to you.
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {(['ALL', 'ESSENTIAL', 'RECOMMENDED', 'OPTIONAL'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-all"
            style={{
              background: filter === f ? '#b8985a' : '#111',
              color: filter === f ? '#080808' : '#999',
              border: `1px solid ${filter === f ? '#b8985a' : '#222'}`,
            }}
          >
            {f === 'ALL' ? 'All' : PRIORITY_CONFIG[f].label}
          </button>
        ))}
      </div>

      {/* Supplement cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 opacity-40">
          <div className="text-3xl mb-2">💊</div>
          <p className="text-sm">No supplements in this category</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(supp => {
            const config = PRIORITY_CONFIG[supp.priority]
            return (
              <div
                key={supp.id}
                className="rounded-lg overflow-hidden"
                style={{ background: '#111', border: '1px solid #1a1a1a' }}
              >
                <div className="px-4 py-4">
                  {/* Badge + Name */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ background: config.color + '20', color: config.color }}
                        >
                          {config.emoji} {config.label}
                        </span>
                      </div>
                      <div className="font-semibold text-base" style={{ color: '#e8e0d0' }}>{supp.name}</div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-sm opacity-70">
                    <div className="flex gap-3">
                      <span className="text-xs uppercase tracking-widest opacity-50 w-14 shrink-0">Dose</span>
                      <span className="text-xs">{supp.dosage}</span>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-xs uppercase tracking-widest opacity-50 w-14 shrink-0">Timing</span>
                      <span className="text-xs">{supp.timing}</span>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-xs uppercase tracking-widest opacity-50 w-14 shrink-0">Benefits</span>
                      <span className="text-xs leading-relaxed">{supp.benefits}</span>
                    </div>
                  </div>

                  {/* Amazon CTA */}
                  <button
                    onClick={() => handleAffiliateClick(supp)}
                    className="mt-4 w-full py-2.5 rounded text-sm font-semibold tracking-wide flex items-center justify-center gap-2"
                    style={{ background: '#FF9900', color: '#111' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#111"><path d="M13 2C9.13 2 6 5.13 6 9c0 3.08 1.85 5.73 4.5 6.95V18h5v-2.05C18.15 14.73 20 12.08 20 9c0-3.87-3.13-7-7-7zm-1.5 14.5h3V18h-3v-1.5zM12 3.5c3.03 0 5.5 2.47 5.5 5.5S15.03 14.5 12 14.5 6.5 12.03 6.5 9 8.97 3.5 12 3.5z"/></svg>
                    View on Amazon
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Footer note */}
      <p className="text-xs text-center opacity-30 pb-2">
        As an Amazon Associate, Sauzule earns from qualifying purchases.
      </p>
    </div>
  )
}
