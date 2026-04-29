'use client'
export function DashboardStats({ activeClients, totalClients, mrr, pendingCount }: {
  activeClients: number; totalClients: number; mrr: number; pendingCount: number
}) {
  const stats = [
    { label: 'Active Clients', value: activeClients, sub: `${totalClients} total` },
    { label: 'Monthly Revenue', value: `$${mrr.toLocaleString()}`, sub: 'MRR via Stripe' },
    { label: 'Plans Pending', value: pendingCount, sub: pendingCount > 0 ? '● Needs review' : '✓ All approved', highlight: pendingCount > 0 },
    { label: 'Stripe Account', value: 'Active', sub: 'Payments live' },
  ]
  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <div key={i} className="rounded-lg p-4"
             style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <p className="text-[11px] mb-2" style={{ color: 'var(--muted)', letterSpacing: '0.5px' }}>{s.label}</p>
          <p className="serif text-2xl font-medium" style={{ color: 'var(--txt)' }}>{s.value}</p>
          <p className="text-[11px] mt-1" style={{ color: s.highlight ? 'var(--gold)' : 'var(--muted)' }}>{s.sub}</p>
        </div>
      ))}
    </div>
  )
}
