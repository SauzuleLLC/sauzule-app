import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Sidebar } from '@/components/coach/Sidebar'

const GOAL_LABELS: Record<string, string> = {
  FAT_LOSS: 'Fat Loss',
  MUSCLE_GAIN: 'Muscle Gain',
  MAINTENANCE: 'Maintenance',
}

const PRIORITY_COLOR: Record<string, string> = {
  ESSENTIAL: '#c9a84c',
  RECOMMENDED: '#2ecc71',
  OPTIONAL: 'var(--muted)',
}

export default async function SupplementsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/')

  const stacks = await prisma.supplementStack.findMany({
    where: { coachId: session.user.id },
    orderBy: [{ goal: 'asc' }, { sortOrder: 'asc' }],
  })

  const grouped = stacks.reduce<Record<string, typeof stacks>>((acc, s) => {
    if (!acc[s.goal]) acc[s.goal] = []
    acc[s.goal].push(s)
    return acc
  }, {})

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto px-8 py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="serif text-2xl" style={{ color: 'var(--txt)' }}>Supplement Stacks</h1>
            <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
              Your recommended stacks by client goal
            </p>
          </div>
        </div>

        <div className="space-y-10">
          {Object.entries(grouped).map(([goal, items]) => (
            <div key={goal}>
              <h2 className="serif text-lg mb-4" style={{ color: 'var(--gold)' }}>
                {GOAL_LABELS[goal] ?? goal}
              </h2>
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                <table className="w-full">
                  <thead>
                    <tr style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)' }}>
                      <th className="text-left px-6 py-3 text-xs font-medium" style={{ color: 'var(--muted)', letterSpacing: '1px' }}>SUPPLEMENT</th>
                      <th className="text-left px-6 py-3 text-xs font-medium" style={{ color: 'var(--muted)', letterSpacing: '1px' }}>PRIORITY</th>
                      <th className="text-left px-6 py-3 text-xs font-medium" style={{ color: 'var(--muted)', letterSpacing: '1px' }}>DOSAGE</th>
                      <th className="text-left px-6 py-3 text-xs font-medium" style={{ color: 'var(--muted)', letterSpacing: '1px' }}>TIMING</th>
                      <th className="text-left px-6 py-3 text-xs font-medium" style={{ color: 'var(--muted)', letterSpacing: '1px' }}>LINK</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, i) => (
                      <tr key={item.id}
                        style={{
                          background: i % 2 === 0 ? 'var(--card)' : 'transparent',
                          borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 'none',
                        }}>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium" style={{ color: 'var(--txt)' }}>{item.name}</div>
                          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{item.benefits}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-semibold" style={{ color: PRIORITY_COLOR[item.priority] ?? 'var(--muted)' }}>
                            {item.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm" style={{ color: 'var(--txt)' }}>{item.dosage}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm" style={{ color: 'var(--muted)' }}>{item.timing}</span>
                        </td>
                        <td className="px-6 py-4">
                          {item.amazonUrl ? (
                            <a href={item.amazonUrl} target="_blank" rel="noopener noreferrer"
                              className="text-xs underline" style={{ color: 'var(--gold)' }}>
                              Amazon ↗
                            </a>
                          ) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
