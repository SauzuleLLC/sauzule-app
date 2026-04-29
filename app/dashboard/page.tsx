import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Sidebar } from '@/components/coach/Sidebar'
import { DashboardStats } from '@/components/coach/DashboardStats'
import { PendingApprovals } from '@/components/coach/PendingApprovals'
import { SundayDigest } from '@/components/coach/SundayDigest'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/')

  const coachId = session.user.id

  const [clients, pendingPlans, thisWeekCheckIns] = await Promise.all([
    prisma.client.findMany({
      where: { coachId },
      include: { subscription: { include: { plan: true } } },
    }),
    prisma.mealPlan.findMany({
      where: { client: { coachId }, status: 'PENDING_APPROVAL' },
      include: { client: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.sundayCheckIn.findMany({
      where: {
        client: { coachId },
        weekDate: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    }),
  ])

  const activeClients = clients.filter(c => c.subscription?.status === 'ACTIVE').length
  const mrr = clients.reduce((sum, c) => {
    if (c.subscription?.status === 'ACTIVE') {
      return sum + (c.subscription.plan.priceMonthly / 100)
    }
    return sum
  }, 0)

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="px-8 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="serif text-2xl" style={{ color: 'var(--txt)' }}>Dashboard</h1>
              <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <a href="/clients/invite"
               className="px-4 py-2 rounded-md text-sm font-medium"
               style={{ background: 'var(--gold)', color: '#080808' }}>
              + Invite Client
            </a>
          </div>

          <DashboardStats
            activeClients={activeClients}
            totalClients={clients.length}
            mrr={mrr}
            pendingCount={pendingPlans.length}
          />

          <div className="grid grid-cols-2 gap-5 mt-6">
            <PendingApprovals plans={pendingPlans} />
            <SundayDigest
              total={clients.length}
              responded={thisWeekCheckIns.length}
              autoRenewed={thisWeekCheckIns.filter(c => c.autoRenewed).length}
            />
          </div>

          {/* Amazon Revenue Card */}
          <div className="mt-5 rounded-xl p-5"
               style={{ background: 'linear-gradient(135deg, #0f0d08, #1a1408)', border: '1px solid var(--gold)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs mb-1" style={{ color: 'var(--gold)', letterSpacing: '1px' }}>
                  AMAZON ASSOCIATES · sauzule-20
                </p>
                <p className="serif text-2xl" style={{ color: 'var(--txt)' }}>
                  Track your affiliate revenue
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                  Log in to affiliate-program.amazon.com to see real-time earnings
                </p>
              </div>
              <a href="https://affiliate-program.amazon.com" target="_blank"
                 className="px-4 py-2 rounded-md text-sm font-medium flex-shrink-0"
                 style={{ border: '1px solid var(--gold)', color: 'var(--gold)' }}>
                View Earnings →
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
