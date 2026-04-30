'use client'
import { useState, useEffect } from 'react'

type GroceryItem = {
  id: string
  name: string
  amount: string
  checked: boolean
  category: string
}

type Profile = {
  goal: string
  dietType: string
  name: string
  email: string
}

const GROCERY_LISTS: Record<string, Record<string, { name: string; amount: string }[]>> = {
  FAT_LOSS: {
    '🥩 Proteins': [
      { name: 'Chicken Breast', amount: '3 lbs' },
      { name: 'Salmon Fillets', amount: '1.5 lbs' },
      { name: 'Turkey (93% lean ground)', amount: '1 lb' },
      { name: 'Eggs', amount: '2 dozen' },
      { name: 'Greek Yogurt (non-fat)', amount: '32 oz' },
      { name: 'Cottage Cheese (low-fat)', amount: '16 oz' },
      { name: 'Tuna (canned in water)', amount: '4 cans' },
      { name: 'Shrimp', amount: '1 lb' },
    ],
    '🥦 Produce': [
      { name: 'Spinach', amount: '10 oz bag' },
      { name: 'Broccoli', amount: '2 heads' },
      { name: 'Bell Peppers (mixed)', amount: '6 count' },
      { name: 'Cucumber', amount: '2 count' },
      { name: 'Zucchini', amount: '3 count' },
      { name: 'Asparagus', amount: '1 bundle' },
      { name: 'Cherry Tomatoes', amount: '1 pint' },
      { name: 'Baby Carrots', amount: '1 lb bag' },
      { name: 'Celery', amount: '1 bunch' },
      { name: 'Avocados', amount: '4 count' },
      { name: 'Lemons', amount: '4 count' },
      { name: 'Blueberries', amount: '1 pint' },
      { name: 'Strawberries', amount: '1 lb' },
    ],
    '🌾 Grains & Carbs': [
      { name: 'Brown Rice', amount: '2 lb bag' },
      { name: 'Rolled Oats', amount: '18 oz' },
      { name: 'Quinoa', amount: '1 lb' },
      { name: 'Sweet Potatoes', amount: '4 count' },
      { name: 'Ezekiel Bread', amount: '1 loaf' },
    ],
    '🧀 Dairy & Alternatives': [
      { name: 'Unsweetened Almond Milk', amount: '1/2 gallon' },
      { name: 'Low-fat Mozzarella', amount: '8 oz' },
    ],
    '🫙 Pantry & Extras': [
      { name: 'Olive Oil (extra virgin)', amount: '16 oz' },
      { name: 'Apple Cider Vinegar', amount: '1 bottle' },
      { name: 'Chicken Broth (low sodium)', amount: '32 oz' },
      { name: 'Almond Butter (natural)', amount: '16 oz' },
      { name: 'Protein Powder (whey isolate)', amount: '2 lb tub' },
      { name: 'Cinnamon', amount: '1 jar' },
      { name: 'Garlic Powder', amount: '1 jar' },
      { name: 'Cayenne Pepper', amount: '1 jar' },
      { name: 'Sea Salt & Black Pepper', amount: '1 set' },
    ],
  },
  MUSCLE_GAIN: {
    '🥩 Proteins': [
      { name: 'Chicken Breast', amount: '4 lbs' },
      { name: 'Lean Ground Beef (90/10)', amount: '2 lbs' },
      { name: 'Salmon Fillets', amount: '2 lbs' },
      { name: 'Eggs', amount: '3 dozen' },
      { name: 'Greek Yogurt (full-fat)', amount: '32 oz' },
      { name: 'Cottage Cheese', amount: '24 oz' },
      { name: 'Sirloin Steak', amount: '1.5 lbs' },
      { name: 'Canned Tuna', amount: '6 cans' },
    ],
    '🥦 Produce': [
      { name: 'Broccoli', amount: '3 heads' },
      { name: 'Spinach', amount: '10 oz bag' },
      { name: 'Bananas', amount: '2 bunches' },
      { name: 'Blueberries', amount: '2 pints' },
      { name: 'Bell Peppers', amount: '4 count' },
      { name: 'Avocados', amount: '4 count' },
      { name: 'Tomatoes', amount: '4 count' },
    ],
    '🌾 Grains & Carbs': [
      { name: 'White Rice', amount: '5 lb bag' },
      { name: 'Rolled Oats', amount: '42 oz' },
      { name: 'Whole Wheat Pasta', amount: '2 lbs' },
      { name: 'Whole Grain Bread', amount: '1 loaf' },
      { name: 'Russet Potatoes', amount: '5 lb bag' },
      { name: 'Sweet Potatoes', amount: '4 count' },
    ],
    '🧀 Dairy & Alternatives': [
      { name: 'Whole Milk', amount: '1/2 gallon' },
      { name: 'Cheddar Cheese', amount: '16 oz block' },
      { name: 'Butter (grass-fed)', amount: '1 lb' },
    ],
    '🫙 Pantry & Extras': [
      { name: 'Olive Oil', amount: '16 oz' },
      { name: 'Peanut Butter (natural)', amount: '16 oz' },
      { name: 'Mixed Nuts', amount: '16 oz' },
      { name: 'Protein Powder (whey)', amount: '5 lb tub' },
      { name: 'Creatine Monohydrate', amount: '1 container' },
      { name: 'Honey', amount: '1 jar' },
      { name: 'Soy Sauce (low sodium)', amount: '1 bottle' },
      { name: 'Chicken Broth', amount: '32 oz' },
    ],
  },
}

const GOAL_MAP: Record<string, string> = {
  FAT_LOSS: 'FAT_LOSS',
  RECOMPOSITION: 'FAT_LOSS',
  MAINTENANCE: 'FAT_LOSS',
  MUSCLE_GAIN: 'MUSCLE_GAIN',
  ATHLETIC_PERFORMANCE: 'MUSCLE_GAIN',
}

export default function GroceryPage() {
  const [items, setItems] = useState<GroceryItem[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [emailSent, setEmailSent] = useState(false)

  useEffect(() => {
    fetch('/api/client/profile')
      .then(r => r.json())
      .then(data => {
        setProfile(data)
        const listKey = GOAL_MAP[data.goal] || 'FAT_LOSS'
        const list = GROCERY_LISTS[listKey]
        const allItems: GroceryItem[] = []
        Object.entries(list).forEach(([category, catItems]) => {
          catItems.forEach((item, i) => {
            allItems.push({ id: `${category}-${i}`, name: item.name, amount: item.amount, category, checked: false })
          })
        })
        setItems(allItems)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const toggleItem = (id: string) => setItems(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item))
  const uncheckAll = () => setItems(prev => prev.map(i => ({ ...i, checked: false })))
  const handlePrint = () => window.print()

  const handleEmail = () => {
    const unchecked = items.filter(i => !i.checked)
    const lines: string[] = ['SAUZULE WEEKLY GROCERY LIST', '='.repeat(30), '']
    const cats = [...new Set(unchecked.map(i => i.category))]
    cats.forEach(cat => {
      lines.push(cat)
      unchecked.filter(i => i.category === cat).forEach(item => {
        lines.push(`  [ ] ${item.name} — ${item.amount}`)
      })
      lines.push('')
    })
    lines.push('Generated by Sauzule Health Platform')
    const body = encodeURIComponent(lines.join('\n'))
    window.location.href = `mailto:${profile?.email || ''}?subject=My+Sauzule+Grocery+List&body=${body}`
    setEmailSent(true)
    setTimeout(() => setEmailSent(false), 3000)
  }

  const categories = [...new Set(items.map(i => i.category))]
  const totalItems = items.length
  const checkedItems = items.filter(i => i.checked).length
  const progress = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="text-center"><div className="text-4xl mb-4">🛒</div><p className="text-gray-400">Building your grocery list...</p></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-24">
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-4 print:hidden">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold text-white">🛒 Grocery List</h1>
            <p className="text-sm text-gray-400">{checkedItems} of {totalItems} items · {progress}% done</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handlePrint} className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
              🖨️ Print
            </button>
            <button
              onClick={handleEmail}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${emailSent ? 'bg-green-500 text-white' : 'bg-yellow-500 hover:bg-yellow-400 text-black'}`}
            >
              {emailSent ? '✓ Sent!' : '📧 Email Me'}
            </button>
          </div>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
          <div className="bg-yellow-400 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        {checkedItems > 0 && (
          <button onClick={uncheckAll} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">↩ Uncheck all</button>
        )}
      </div>

      <div className="hidden print:block p-6 border-b-2 border-gray-300 mb-4">
        <h1 className="text-2xl font-bold">🛒 SAUZULE Weekly Grocery List</h1>
        <p className="text-gray-600 mt-1">Goal: {profile?.goal?.replace(/_/g, ' ')} | Plan: {profile?.dietType?.replace(/_/g, ' ')}</p>
      </div>

      <div className="p-4 space-y-4">
        {categories.map(category => {
          const catItems = items.filter(i => i.category === category)
          const catChecked = catItems.filter(i => i.checked).length
          const allChecked = catChecked === catItems.length
          return (
            <div key={category} className={`bg-gray-900 rounded-xl overflow-hidden border transition-all ${allChecked ? 'border-green-800 opacity-75' : 'border-gray-800'} print:border-gray-300 print:mb-6`}>
              <div className="flex items-center justify-between px-4 py-3 bg-gray-800 print:bg-gray-100">
                <span className="font-semibold text-white print:text-black">{category}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">{catChecked}/{catItems.length}</span>
                  {allChecked && <span className="text-green-400 text-sm">✓ Done!</span>}
                </div>
              </div>
              <div className="divide-y divide-gray-800 print:divide-gray-200">
                {catItems.map(item => (
                  <label key={item.id} className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-800/50 transition-colors group">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${item.checked ? 'bg-yellow-400 border-yellow-400' : 'border-gray-600 group-hover:border-yellow-500'}`}>
                      {item.checked && <span className="text-black text-xs font-bold leading-none">✓</span>}
                    </div>
                    <input type="checkbox" checked={item.checked} onChange={() => toggleItem(item.id)} className="sr-only" />
                    <span className={`flex-1 text-sm transition-all ${item.checked ? 'line-through text-gray-500' : 'text-white'} print:text-black`}>{item.name}</span>
                    <span className="text-xs text-gray-500 flex-shrink-0">{item.amount}</span>
                  </label>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mx-4 mb-6 p-4 bg-gray-900 border border-yellow-500/20 rounded-xl print:hidden">
        <p className="text-sm text-gray-400">💡 <strong className="text-yellow-400">Shopping tip:</strong> Start in produce, then proteins, then grains. Shop the perimeter first for the freshest foods.</p>
      </div>

      {progress === 100 && (
        <div className="mx-4 mb-6 p-4 bg-green-900/30 border border-green-700 rounded-xl text-center print:hidden">
          <div className="text-3xl mb-2">🎉</div>
          <p className="text-green-400 font-semibold">Shopping complete! You are all set for the week.</p>
        </div>
      )}
    </div>
  )
}
