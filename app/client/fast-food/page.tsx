'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSession } from 'next-auth/react'
import {
  FAST_FOOD_DATA,
  RESTAURANTS,
  getBestForGoal,
  getHighProteinItems,
  searchItems,
  type FastFoodItem,
} from '@/lib/fast-food-data'

const GOAL_LABELS: Record<string, string> = {
  FAT_LOSS: 'Fat Loss',
  MUSCLE_GAIN: 'Muscle Gain',
  RECOMPOSITION: 'Recomposition',
  MAINTENANCE: 'Maintenance',
  ATHLETIC_PERFORMANCE: 'Athletic Performance',
}

const CATEGORY_ICONS: Record<string, string> = {
  burger: '🍔',
  sandwich: '🥪',
  bowl: '🥗',
  salad: '🥗',
  wrap: '🌯',
  tacos: '🌮',
  pizza: '🍕',
  chicken: '🍗',
  seafood: '🐟',
  breakfast: '🍳',
  sides: '🥙',
  pasta: '🍝',
  drink: '🥤',
}

const GOAL_BADGE_COLORS: Record<string, string> = {
  FAT_LOSS: 'bg-blue-900/60 text-blue-300 border border-blue-700/50',
  MUSCLE_GAIN: 'bg-yellow-900/60 text-yellow-300 border border-yellow-700/50',
  RECOMPOSITION: 'bg-purple-900/60 text-purple-300 border border-purple-700/50',
  MAINTENANCE: 'bg-gray-700/60 text-gray-300 border border-gray-600/50',
  ATHLETIC_PERFORMANCE: 'bg-orange-900/60 text-orange-300 border border-orange-700/50',
}

const GOAL_SHORT: Record<string, string> = {
  FAT_LOSS: 'Fat Loss',
  MUSCLE_GAIN: 'Muscle',
  RECOMPOSITION: 'Recomp',
  MAINTENANCE: 'Maintain',
  ATHLETIC_PERFORMANCE: 'Athletic',
}

interface Profile {
  goal: string
  targetCalories: number
  targetProtein: number
  targetCarbs: number
  targetFat: number
  name: string
}

function MacroBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-gray-400">
        <span>{label}</span>
        <span>{value}g <span className="text-gray-600">/ {max}g</span></span>
      </div>
      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function NutrientPill({ label, value, unit = 'g', warn = false }: { label: string; value: number; unit?: string; warn?: boolean }) {
  return (
    <div className={`flex flex-col items-center px-3 py-2 rounded-lg ${warn ? 'bg-red-900/30 border border-red-700/40' : 'bg-gray-800/60'}`}>
      <span className={`text-sm font-bold ${warn ? 'text-red-400' : 'text-white'}`}>{value}{unit}</span>
      <span className="text-xs text-gray-500 mt-0.5">{label}</span>
    </div>
  )
}

function ItemCard({
  item,
  userGoal,
  onAdd,
  added,
}: {
  item: FastFoodItem
  userGoal: string
  onAdd: (item: FastFoodItem) => void
  added: boolean
}) {
  const fitsGoal = item.goalFit.includes(userGoal)
  const highSodium = item.sodium > 1200

  return (
    <div className={`bg-gray-900 border rounded-xl p-4 flex flex-col gap-3 ${item.isHealthy ? 'border-yellow-600/40' : 'border-gray-800'}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-base">{CATEGORY_ICONS[item.category] ?? '🍽️'}</span>
            {item.isHealthy && (
              <span className="text-xs font-semibold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-1.5 py-0.5 rounded-full">
                ✓ Healthy Pick
              </span>
            )}
            {fitsGoal && (
              <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${GOAL_BADGE_COLORS[userGoal]}`}>
                🎯 {GOAL_SHORT[userGoal]}
              </span>
            )}
          </div>
          <p className="text-sm font-semibold text-white leading-tight">{item.item}</p>
          <p className="text-xs text-gray-500 mt-0.5">{item.restaurant}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-lg font-bold text-yellow-400">{item.calories}</p>
          <p className="text-xs text-gray-500">cal</p>
        </div>
      </div>

      {/* Macro grid */}
      <div className="grid grid-cols-4 gap-1.5">
        <NutrientPill label="Protein" value={item.protein} />
        <NutrientPill label="Carbs" value={item.carbs} />
        <NutrientPill label="Fat" value={item.fat} />
        <NutrientPill label="Sodium" value={item.sodium} unit="mg" warn={highSodium} />
      </div>

      {/* Fiber / Sugar row */}
      <div className="flex gap-3 text-xs text-gray-500">
        <span>🌾 Fiber: <span className="text-gray-300">{item.fiber}g</span></span>
        <span>🍬 Sugar: <span className="text-gray-300">{item.sugar}g</span></span>
      </div>

      {/* Goal fit badges */}
      <div className="flex flex-wrap gap-1">
        {item.goalFit.map(g => (
          <span key={g} className={`text-xs px-1.5 py-0.5 rounded-full ${GOAL_BADGE_COLORS[g]}`}>
            {GOAL_SHORT[g]}
          </span>
        ))}
      </div>

      {/* Add to meal button */}
      <button
        onClick={() => onAdd(item)}
        className={`w-full py-2 rounded-lg text-sm font-semibold transition-all ${
          added
            ? 'bg-green-700/40 text-green-300 border border-green-600/40 cursor-default'
            : 'bg-yellow-500 text-gray-950 hover:bg-yellow-400 active:scale-95'
        }`}
        disabled={added}
      >
        {added ? '✓ Added to My Meal' : '+ Add to My Meal'}
      </button>
    </div>
  )
}

export default function FastFoodPage() {
  const { data: session } = useSession()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [search, setSearch] = useState('')
  const [selectedChain, setSelectedChain] = useState('All')
  const [activeFilter, setActiveFilter] = useState<'all' | 'healthy' | 'goal' | 'high-protein' | 'low-cal'>('goal')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [meal, setMeal] = useState<FastFoodItem[]>([])
  const [mealVisible, setMealVisible] = useState(false)

  useEffect(() => {
    fetch('/api/client/profile')
      .then(r => r.json())
      .then(setProfile)
      .catch(console.error)
  }, [])

  const userGoal = profile?.goal ?? 'MAINTENANCE'

  // Build filtered list
  const displayItems = useMemo(() => {
    let items = FAST_FOOD_DATA

    // Chain filter
    if (selectedChain !== 'All') {
      items = items.filter(i => i.restaurant === selectedChain)
    }

    // Category filter
    if (selectedCategory !== 'all') {
      items = items.filter(i => i.category === selectedCategory)
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase()
      items = items.filter(
        i =>
          i.item.toLowerCase().includes(q) ||
          i.restaurant.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q)
      )
    }

    // Quick filter
    if (activeFilter === 'healthy') items = items.filter(i => i.isHealthy)
    if (activeFilter === 'goal') items = items.filter(i => i.goalFit.includes(userGoal))
    if (activeFilter === 'high-protein') items = items.filter(i => i.protein >= 25)
    if (activeFilter === 'low-cal') items = items.filter(i => i.calories <= 400)

    // Sort: healthy + goal-fit first, then by protein desc
    return [...items].sort((a, b) => {
      const aScore = (a.isHealthy ? 2 : 0) + (a.goalFit.includes(userGoal) ? 1 : 0)
      const bScore = (b.isHealthy ? 2 : 0) + (b.goalFit.includes(userGoal) ? 1 : 0)
      if (bScore !== aScore) return bScore - aScore
      return b.protein - a.protein
    })
  }, [search, selectedChain, activeFilter, selectedCategory, userGoal])

  // Meal totals
  const mealTotals = useMemo(() => ({
    calories: meal.reduce((s, i) => s + i.calories, 0),
    protein: meal.reduce((s, i) => s + i.protein, 0),
    carbs: meal.reduce((s, i) => s + i.carbs, 0),
    fat: meal.reduce((s, i) => s + i.fat, 0),
    sodium: meal.reduce((s, i) => s + i.sodium, 0),
  }), [meal])

  const addedIds = useMemo(() => new Set(meal.map(i => `${i.restaurant}::${i.item}`)), [meal])

  const handleAdd = (item: FastFoodItem) => {
    const id = `${item.restaurant}::${item.item}`
    if (!addedIds.has(id)) {
      setMeal(prev => [...prev, item])
      setMealVisible(true)
    }
  }

  const removeFromMeal = (idx: number) => {
    setMeal(prev => prev.filter((_, i) => i !== idx))
  }

  const categories = useMemo(() => {
    const cats = [...new Set(FAST_FOOD_DATA.map(i => i.category))].sort()
    return ['all', ...cats]
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-28">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-gray-950/95 backdrop-blur border-b border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-lg font-bold text-white">Fast Food Guide</h1>
            <p className="text-xs text-gray-500">40 chains · {FAST_FOOD_DATA.length} items · goal-optimized</p>
          </div>
          {meal.length > 0 && (
            <button
              onClick={() => setMealVisible(v => !v)}
              className="relative bg-yellow-500 text-gray-950 rounded-full px-3 py-1.5 text-sm font-bold"
            >
              🧺 {meal.length} item{meal.length !== 1 ? 's' : ''}
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {meal.length}
              </span>
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search items, chains, or categories…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-sm">✕</button>
          )}
        </div>

        {/* Chain selector */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide mb-3">
          {['All', ...RESTAURANTS].map(chain => (
            <button
              key={chain}
              onClick={() => setSelectedChain(chain)}
              className={`shrink-0 text-xs px-3 py-1.5 rounded-full font-medium border transition-all ${
                selectedChain === chain
                  ? 'bg-yellow-500 text-gray-950 border-yellow-500'
                  : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-yellow-600'
              }`}
            >
              {chain}
            </button>
          ))}
        </div>

        {/* Quick filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide mb-2">
          {[
            { id: 'goal', label: `🎯 Best for ${GOAL_SHORT[userGoal] ?? 'Goal'}` },
            { id: 'healthy', label: '✅ Healthy Picks' },
            { id: 'high-protein', label: '💪 High Protein (25g+)' },
            { id: 'low-cal', label: '🔥 Low Cal (≤400)' },
            { id: 'all', label: '📋 All Items' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id as typeof activeFilter)}
              className={`shrink-0 text-xs px-3 py-1.5 rounded-full font-medium border transition-all ${
                activeFilter === f.id
                  ? 'bg-yellow-500 text-gray-950 border-yellow-500'
                  : 'bg-gray-800 text-gray-400 border-gray-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 text-xs px-2.5 py-1 rounded-full font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-gray-200 text-gray-950'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              {cat === 'all' ? 'All Categories' : `${CATEGORY_ICONS[cat] ?? ''} ${cat}`}
            </button>
          ))}
        </div>
      </div>

      {/* Meal Builder Panel */}
      {mealVisible && meal.length > 0 && (
        <div className="mx-4 mt-4 bg-gray-900 border border-yellow-600/40 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-yellow-400">🧺 My Meal Builder</h2>
            <button onClick={() => setMealVisible(false)} className="text-gray-500 text-sm">hide</button>
          </div>

          {/* Meal items */}
          <div className="space-y-2 mb-4">
            {meal.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className="text-gray-300 flex-1 truncate">{item.item} <span className="text-gray-600">· {item.restaurant}</span></span>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-yellow-400 font-semibold">{item.calories} cal</span>
                  <button onClick={() => removeFromMeal(idx)} className="text-red-500 text-xs hover:text-red-400">✕</button>
                </div>
              </div>
            ))}
          </div>

          {/* Meal macro totals */}
          <div className="border-t border-gray-800 pt-3 space-y-2">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Total Calories</span>
              <span className={`font-bold ${mealTotals.calories > (profile?.targetCalories ?? 9999) ? 'text-red-400' : 'text-yellow-400'}`}>
                {mealTotals.calories} cal
              </span>
            </div>
            {profile && (
              <>
                <MacroBar label="Protein" value={mealTotals.protein} max={profile.targetProtein} color="bg-yellow-500" />
                <MacroBar label="Carbs" value={mealTotals.carbs} max={profile.targetCarbs} color="bg-blue-500" />
                <MacroBar label="Fat" value={mealTotals.fat} max={profile.targetFat} color="bg-purple-500" />
              </>
            )}
            {mealTotals.sodium > 2300 && (
              <p className="text-xs text-red-400 mt-2">⚠️ Sodium {mealTotals.sodium}mg — exceeds daily 2300mg limit</p>
            )}
          </div>

          <button
            onClick={() => { setMeal([]); setMealVisible(false) }}
            className="mt-3 w-full py-1.5 rounded-lg text-xs text-gray-500 border border-gray-700 hover:text-red-400 hover:border-red-700 transition-all"
          >
            Clear meal
          </button>
        </div>
      )}

      {/* Result count */}
      <div className="px-4 pt-4 pb-2">
        <p className="text-xs text-gray-600">
          Showing <span className="text-gray-400 font-semibold">{displayItems.length}</span> items
          {selectedChain !== 'All' && <span> at <span className="text-yellow-500">{selectedChain}</span></span>}
          {activeFilter !== 'all' && (
            <span> · <span className="text-yellow-500">
              {activeFilter === 'goal' && `Best for ${GOAL_LABELS[userGoal]}`}
              {activeFilter === 'healthy' && 'Healthy Picks only'}
              {activeFilter === 'high-protein' && 'High protein ≥25g'}
              {activeFilter === 'low-cal' && 'Low calorie ≤400'}
            </span></span>
          )}
        </p>
      </div>

      {/* Items grid */}
      <div className="px-4 grid grid-cols-1 gap-4">
        {displayItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-gray-400 font-semibold">No items found</p>
            <p className="text-gray-600 text-sm mt-1">Try a different search or filter</p>
            <button
              onClick={() => { setSearch(''); setSelectedChain('All'); setActiveFilter('all'); setSelectedCategory('all') }}
              className="mt-4 text-yellow-500 text-sm hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          displayItems.map((item, idx) => (
            <ItemCard
              key={`${item.restaurant}::${item.item}::${idx}`}
              item={item}
              userGoal={userGoal}
              onAdd={handleAdd}
              added={addedIds.has(`${item.restaurant}::${item.item}`)}
            />
          ))
        )}
      </div>

      {/* Goal context footer */}
      {profile && (
        <div className="mx-4 mt-6 bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Your daily targets ({GOAL_LABELS[userGoal]})</p>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <p className="text-sm font-bold text-yellow-400">{profile.targetCalories}</p>
              <p className="text-xs text-gray-600">cal</p>
            </div>
            <div>
              <p className="text-sm font-bold text-yellow-400">{profile.targetProtein}g</p>
              <p className="text-xs text-gray-600">protein</p>
            </div>
            <div>
              <p className="text-sm font-bold text-yellow-400">{profile.targetCarbs}g</p>
              <p className="text-xs text-gray-600">carbs</p>
            </div>
            <div>
              <p className="text-sm font-bold text-yellow-400">{profile.targetFat}g</p>
              <p className="text-xs text-gray-600">fat</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
