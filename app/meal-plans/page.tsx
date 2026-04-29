import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Sidebar } from '@/components/coach/Sidebar'

const statusColor: Record<string, string> = {
  PENDING_APPROVAL: '#f39c12',
  ACTIVE: '#2ecc71',
  ARCHIVED: 'var(--muted)',
}
const statusLabel: Record<string, string> = {
  PENDING_APPROVAL: 'Pending Review',
  ACTIVE: 'Active',
  ARCHIVED: 'Archived',
}

export default async function MealPlansPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/')

  const mealPlans = await prisma.mealPlan.findMany({
    where: { client: { coachId: session.user.id } },
    include: { client: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto px-8 py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="serif text-2xl" style={{ color: 'var(--txt)' }}>Meal Plans</h1>
            <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
              {mealPlans.length} total plans across all clients
            </p>
          </div>
        </div>

        {mealPlans.length === 0 ? (
          <div className="rounded-xl p-12 text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <p className="serif text-xl mb-2" style={{ color: 'var(--txt)' }}>No meal plans yet</p>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              Plans generate automatically when clients complete their Sunday check-in.
            </p>
          </div>
        ) : (
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <table className="w-full">
              <thead>
                <tr style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)' }}>
                  <th className="text-left px-6 py-4 text-xs font-medium" style={{ color: 'var(--muted)', letterSpacing: '1px' }}>CLIENT</th>
                  <th className="text-left px-6 py-4 text-xs font-medium" style={{ color: 'var(--muted)', letterSpacing: '1px' }}>WEEK</th>
                  <th className="text-left px-6 py-4 text-xs font-medium" style={{ color: 'var(--muted)', letterSpacing: '1px' }}>GOAL</th>
                  <th className="text-left px-6 py-4 text-xs font-medium" style={{ color: 'var(--muted)', letterSpacing: '1px' }}>CALORIES</th>
                  <th className="text-left px-6 py-4 text-xs font-medium" style={{ color: 'var(--muted)', letterSpacing: '1px' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {mealPlans.map((plan, i) => (
                  <tr key={plan.id} style={{ background: i % 2 === 0 ? 'var(--card)' : 'transparent', borderBottom: '1px solid var(--border)' }}>
                    <td className="px-6 py-4"><span className="text-sm font-medium" style={{ color: 'var(--txt)' }}>{plan.client.name}</span></td>
                    <td className="px-6 py-4"><span className="text-sm" style={{ color: 'var(--txt)' }}>{plan.weekStart ? new Date(plan.weekStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}</span></td>
                    <td className="px-6 py-4"><span className="text-xs px-2 py-1 rounded" style={{ background: 'var(--border)', color: 'var(--muted)' }}>{plan.goal?.replace('_', ' ') ?? '—'}</span></td>
                    <td className="px-6 py-4"><span className="text-sm" style={{ color: 'var(--txt)' }}>{plan.targetCalories ? plan.targetCalories + ' kcal' : '—'}</span></td>
                    <td className="px-6 py-4"><span className="text-xs font-medium" style={{ color: statusColor[plan.status] ?? 'var(--muted)' }}>{statusLabel[plan.status] ?? plan.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
