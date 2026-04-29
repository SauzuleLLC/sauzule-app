'use client'
import { useState, useEffect } from 'react'
import { RESTAURANTS, searchFastFood, getByRestaurant, type FastFoodItem } from '@/lib/fast-food-data'

interface LogEntry {
  id: string
  loggedAt: string
  restaurant: string
  itemName: string
  calories: number
  protein: number
  carbs: number
  fat: number
  isHealthy: boolean
}

export default function FastFoodPage() {
  const [tab, setTab] = useState<'log' | 'history'>('log')
  const [query, setQuery] = useState('')
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null)
  const [healthyOnly, setHealthyOnly] = useState(false)
  const [results, setResults] = useState<FastFoodItem[]>([])
  const [selected, setSelected] = useState<FastFoodItem | null>(null)
  const [logging, setLogging] = useState(false)
  const [history, setHistory] = useState<LogEntry[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    if (query.trim().length > 1) {
      setResults(searchFastFood(query, healthyOnly))
      setSelectedRestaurant(null)
    } else if (selectedRestaurant) {
      setResults(getByRestaurant(selectedRestaurant, healthyOnly))
    } else {
      setResults([])
    }
  }, [query, selectedRestaurant, healthyOnly])

  useEffect(() => {
    if (tab === 'history') fetchHistory()
  }, [tab])

  async function fetchHistory() {
    setHistoryLoading(true)
    const res = await fetch('/api/client/fast-food')
    const data = await res.json()
    if (!data.error) setHistory(data)
    setHistoryLoading(false)
  }

  async function logItem(item: FastFoodItem) {
    setLogging(true)
    const res = await fetch('/api/client/fast-food', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    })
    if (res.ok) {
      setSuccessMsg(`✓ Logged ${item.item}`)
      setSelected(null)
      setQuery('')
      setResults([])
      setTimeout(() => setSuccessMsg(''), 3000)
    }
    setLogging(false)
  }

  const todayCals = history
    .filter(e => new Date(e.loggedAt).toDateString() === new Date().toDateString())
    .reduce((s, e) => s + e.calories, 0)

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="font-cormorant text-2xl" style={{ color: '#b8985a' }}>Fast Food Log</h1>
        <p className="text-xs opacity-50 mt-1">Track a meal — we'll adjust your day automatically</p>
      </div>

      {/* Success */}
      {successMsg && (
        <div className="px-4 py-3 rounded text-sm" style={{ background: '#0a1a0a', border: '1px solid #22c55e', color: '#22c55e' }}>
          {successMsg}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded" style={{ background: '#111' }}>
        {(['log', 'history'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 py-2 rounded text-sm font-medium transition-all capitalize"
            style={{
              background: tab === t ? '#b8985a' : 'transparent',
              color: tab === t ? '#080808' : '#999',
            }}
          >
            {t === 'log' ? 'Log a Meal' : 'History'}
          </button>
        ))}
      </div>

      {tab === 'log' && (
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <input
              value={query}
              onChange={e => { setQuery(e.target.value); setSelectedRestaurant(null); setSelected(null) }}
              placeholder="Search any restaurant or item…"
              className="w-full px-4 py-3 rounded text-sm outline-none"
              style={{ background: '#111', border: '1px solid #222', color: '#e8e0d0' }}
            />
            {query && (
              <button
                onClick={() => { setQuery(''); setResults([]); setSelected(null) }}
                className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40"
              >✕</button>
            )}
          </div>

          {/* Healthy toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setHealthyOnly(!healthyOnly)}
              className="flex items-center gap-2 text-sm transition-colors"
              style={{ color: healthyOnly ? '#22c55e' : '#666' }}
            >
              <div
                className="w-10 h-5 rounded-full transition-all relative"
                style={{ background: healthyOnly ? '#22c55e' : '#333' }}
              >
                <div
                  className="absolute w-4 h-4 bg-white rounded-full top-0.5 transition-all"
                  style={{ left: healthyOnly ? '1.25rem' : '0.125rem' }}
                />
              </div>
              Healthier options only
            </button>
          </div>

          {/* Browse by restaurant */}
          {!query && !selectedRestaurant && (
            <div>
              <div className="text-xs uppercase tracking-widest opacity-40 mb-3">Browse by restaurant</div>
              <div className="flex flex-wrap gap-2">
                {RESTAURANTS.map(r => (
                  <button
                    key={r}
                    onClick={() => setSelectedRestaurant(r)}
                    className="px-3 py-1.5 rounded text-xs transition-all"
                    style={{ background: '#111', border: '1px solid #222', color: '#e8e0d0' }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Back from restaurant browse */}
          {selectedRestaurant && !query && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => { setSelectedRestaurant(null); setResults([]) }}
                className="text-xs opacity-50"
              >
                ← All restaurants
              </button>
              <span className="text-sm font-medium">{selectedRestaurant}</span>
            </div>
          )}

          {/* Results */}
          {results.length > 0 && (
            <div className="space-y-2">
              {results.map((item, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(selected?.item === item.item ? null : item)}
                  className="w-full text-left px-4 py-3 rounded transition-all"
                  style={{
                    background: selected?.item === item.item ? '#1a1508' : '#111',
                    border: `1px solid ${selected?.item === item.item ? '#b8985a' : '#1a1a1a'}`,
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{item.item}</span>
                        {item.isHealthy && <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: '#0a1a0a', color: '#22c55e' }}>✓ healthy</span>}
                      </div>
                      {!selectedRestaurant && <div className="text-xs opacity-40 mt-0.5">{item.restaurant}</div>}
                    </div>
                    <div className="text-right text-xs shrink-0">
                      <div className="font-semibold" style={{ color: '#b8985a' }}>{item.calories} cal</div>
                      <div className="opacity-50">P {item.protein}g</div>
                    </div>
                  </div>

                  {selected?.item === item.item && (
                    <div className="mt-3 pt-3 border-t border-gray-800 space-y-3">
                      <div className="grid grid-cols-3 gap-2 text-xs text-center">
                        <div className="p-2 rounded" style={{ background: '#0d0d0d' }}>
                          <div className="font-semibold" style={{ color: '#b8985a' }}>{item.protein}g</div>
                          <div className="opacity-40">Protein</div>
                        </div>
                        <div className="p-2 rounded" style={{ background: '#0d0d0d' }}>
                          <div className="font-semibold" style={{ color: '#b8985a' }}>{item.carbs}g</div>
                          <div className="opacity-40">Carbs</div>
                        </div>
                        <div className="p-2 rounded" style={{ background: '#0d0d0d' }}>
                          <div className="font-semibold" style={{ color: '#b8985a' }}>{item.fat}g</div>
                          <div className="opacity-40">Fat</div>
                        </div>
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); logItem(item) }}
                        disabled={logging}
                        className="w-full py-2.5 rounded text-sm font-semibold"
                        style={{ background: '#b8985a', color: '#080808', opacity: logging ? 0.6 : 1 }}
                      >
                        {logging ? 'Logging…' : 'Log This Meal'}
                      </button>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'history' && (
        <div className="space-y-4">
          {/* Today's summary */}
          {todayCals > 0 && (
            <div className="px-4 py-3 rounded" style={{ background: '#111', border: '1px solid #1a1a1a' }}>
              <div className="text-xs opacity-50 mb-1">Today from fast food</div>
              <div className="text-2xl font-bold" style={{ color: '#b8985a' }}>{todayCals} <span className="text-sm font-normal opacity-60">cal</span></div>
            </div>
          )}

          {historyLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: '#b8985a', borderTopColor: 'transparent' }} />
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-12 opacity-40">
              <div className="text-3xl mb-2">🍔</div>
              <p className="text-sm">No fast food logged yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {history.map(entry => (
                <div
                  key={entry.id}
                  className="px-4 py-3 rounded"
                  style={{ background: '#111', border: '1px solid #1a1a1a' }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{entry.itemName}</span>
                        {entry.isHealthy && <span className="text-xs" style={{ color: '#22c55e' }}>✓</span>}
                      </div>
                      <div className="text-xs opacity-40 mt-0.5">
                        {entry.restaurant} · {new Date(entry.loggedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                    <div className="text-right text-xs">
                      <div style={{ color: '#b8985a' }}>{entry.calories} cal</div>
                      <div className="opacity-40">P {entry.protein}g</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
