import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Sidebar } from '@/components/coach/Sidebar'
import { ClientsTable } from '@/components/coach/ClientsTable'

export default async function ClientsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/')

  const clients = await prisma.client.findMany({
    where: { coachId: session.user.id },
    include: {
      subscription: { include: { plan: true } },
      mealPlans: { where: { status: 'ACTIVE' }, take: 1, orderBy: { createdAt: 'desc' } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto px-8 py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="serif text-2xl" style={{ color: 'var(--txt)' }}>Clients</h1>
            <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{clients.length} total clients</p>
          </div>
          <a href="/clients/invite"
             className="px-4 py-2 rounded-md text-sm font-medium"
             style={{ background: 'var(--gold)', color: '#080808' }}>
            + Invite Client
          </a>
        </div>
        <ClientsTable clients={clients} />
      </main>
    </div>
  )
}
