export function SundayDigest({ total, responded, autoRenewed }: {
  total: number; responded: number; autoRenewed: number
}) {
  return (
    <div className="rounded-xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <p className="text-xs mb-4" style={{ color: 'var(--muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>
        Sunday Reset — This Week
      </p>
      {[
        { label: 'Check-ins received', value: `${responded} / ${total}` },
        { label: 'Plans auto-generated', value: responded },
        { label: 'Auto-renewed (no response)', value: autoRenewed, muted: true },
        { label: 'Delivery window', value: '7:00 – 7:30 AM', gold: true },
      ].map((row, i) => (
        <div key={i} className="flex justify-between items-center py-2"
             style={{ borderBottom: i < 3 ? '1px solid #1a1a1a' : 'none' }}>
          <span className="text-sm" style={{ color: 'var(--muted)' }}>{row.label}</span>
          <span className="text-sm font-medium"
                style={{ color: row.gold ? 'var(--gold)' : row.muted ? 'var(--muted)' : 'var(--txt)' }}>
            {row.value}
          </span>
        </div>
      ))}
    </div>
  )
}
