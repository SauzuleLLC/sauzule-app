'use client'

const STATUS_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  ACTIVE:   { bg: 'rgba(46,204,113,0.12)', color: '#2ecc71', border: 'rgba(46,204,113,0.3)' },
  TRIAL:    { bg: 'rgba(184,152,90,0.12)', color: '#b8985a', border: 'rgba(184,152,90,0.3)' },
  PAUSED:   { bg: 'rgba(171,163,149,0.12)', color: '#aba395', border: 'rgba(171,163,149,0.25)' },
  CANCELED: { bg: 'rgba(192,57,43,0.12)', color: '#c0392b', border: 'rgba(192,57,43,0.25)' },
  PAST_DUE: { bg: 'rgba(230,126,34,0.12)', color: '#e67e22', border: 'rgba(230,126,34,0.25)' },
}

const GOAL_LABELS: Record<string, string> = {
  FAT_LOSS: 'Fat Loss', MUSCLE_GAIN: 'Muscle Gain', MAINTENANCE: 'Maintenance',
  ATHLETIC_PERFORMANCE: 'Athletic Perf.', RECOMPOSITION: 'Recomp',
}

export function ClientsTable({ clients }: { clients: any[] }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
      <table className="w-full" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'var(--card)' }}>
            {['Client', 'Plan', 'Status', 'Goal', 'Next Billing', 'Actions'].map(h => (
              <th key={h} className="text-left px-4 py-3 text-[11px] uppercase tracking-wider"
                  style={{ color: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {clients.map(client => {
            const status = client.subscription?.status || 'TRIAL'
            const style = STATUS_STYLES[status] || STATUS_STYLES.TRIAL
            const initials = client.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
            return (
              <tr key={client.id}
                  style={{ borderBottom: '1px solid #1a1a1a' }}
                  onMouseOver={e => (e.currentTarget.style.background = 'rgba(184,152,90,0.04)')}
                  onMouseOut={e => (e.currentTarget.style.background = 'transparent')}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                         style={{ background: 'var(--gold-dim)', border: '1px solid var(--border)', color: 'var(--gold)' }}>
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: 'var(--txt)' }}>{client.name}</p>
                      <p className="text-xs" style={{ color: 'var(--muted)' }}>{client.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm" style={{ color: 'var(--gold)' }}>
                  {client.subscription?.plan ? `${client.subscription.plan.name} · $${client.subscription.plan.priceMonthly / 100}/mo` : '—'}
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded-full text-[11px]"
                        style={{ background: style.bg, color: style.color, border: `1px solid ${style.border}` }}>
                    {status.charAt(0) + status.slice(1).toLowerCase()}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm" style={{ color: 'var(--muted)' }}>
                  {GOAL_LABELS[client.goal] || client.goal}
                </td>
                <td className="px-4 py-3 text-sm" style={{ color: 'var(--muted)' }}>
                  {client.subscription?.currentPeriodEnd
                    ? new Date(client.subscription.currentPeriodEnd).toLocaleDateString()
                    : '—'}
                </td>
                <td className="px-4 py-3">
                  <a href={`/clients/${client.id}`}
                     className="px-3 py-1.5 rounded text-xs"
                     style={{ border: '1px solid var(--border)', color: 'var(--muted)' }}>
                    View Plan
                  </a>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {clients.length === 0 && (
        <div className="py-12 text-center" style={{ color: 'var(--muted)' }}>
          <p className="text-sm">No clients yet.</p>
          <a href="/clients/invite" className="text-xs mt-2 inline-block" style={{ color: 'var(--gold)' }}>
            Invite your first client →
          </a>
        </div>
      )}
    </div>
  )
}
