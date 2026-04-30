import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: 'radial-gradient(ellipse at center, #0d0b07 0%, #080808 70%)', color: 'var(--txt)' }}>

      {/* Nav */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 48px', borderBottom: '1px solid var(--border)' }}>
        <h1 className="serif" style={{ color: 'var(--gold)', letterSpacing: '4px', fontSize: '20px', margin: 0 }}>SAUZULE</h1>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Link href="/client" style={{ color: 'var(--muted)', fontSize: '12px', textDecoration: 'none', letterSpacing: '1px' }}>Client Login</Link>
          <Link href="/login" style={{ color: 'var(--gold)', fontSize: '12px', textDecoration: 'none', letterSpacing: '1px', border: '1px solid var(--gold)', padding: '8px 20px', borderRadius: '4px' }}>Coach Portal</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '100px 24px 80px' }}>
        <p style={{ letterSpacing: '4px', fontSize: '11px', color: 'var(--gold)', marginBottom: '24px' }}>PREMIUM NUTRITION COACHING</p>
        <h2 className="serif" style={{ fontSize: '48px', fontWeight: 300, lineHeight: 1.2, marginBottom: '24px', letterSpacing: '2px' }}>
          Transform Your Body.<br />Transform Your Life.
        </h2>
        <p style={{ fontSize: '15px', color: 'var(--muted)', maxWidth: '460px', margin: '0 auto 48px', lineHeight: 1.8 }}>
          Personalized nutrition and fitness coaching designed around your goals,
          your lifestyle, and your schedule.
        </p>
        <Link href="/signup" style={{ display: 'inline-block', background: 'var(--gold)', color: '#080808', padding: '14px 44px', fontSize: '12px', letterSpacing: '3px', textDecoration: 'none', fontWeight: 700, borderRadius: '4px' }}>
          START YOUR JOURNEY
        </Link>
      </section>

      {/* Features */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1px', background: 'var(--border)', maxWidth: '960px', margin: '0 auto 80px' }}>
        {[
          { title: 'Custom Meal Plans', desc: 'Weekly plans built around your macros, food preferences, and goals.' },
          { title: 'Exercise Programs', desc: 'Structured workouts matched to your fitness level and schedule.' },
          { title: 'Weekly Check-Ins', desc: 'Accountability and adjustments every week to keep you on track.' },
        ].map((f) => (
          <div key={f.title} style={{ background: 'var(--card)', padding: '40px 28px', borderTop: '2px solid var(--gold)' }}>
            <h3 className="serif" style={{ fontSize: '16px', fontWeight: 400, marginBottom: '12px', color: 'var(--txt)' }}>{f.title}</h3>
            <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.7 }}>{f.desc}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section style={{ textAlign: 'center', padding: '60px 24px 100px' }}>
        <h2 className="serif" style={{ fontSize: '32px', fontWeight: 300, marginBottom: '16px' }}>Ready to start?</h2>
        <p style={{ color: 'var(--muted)', marginBottom: '40px', fontSize: '14px' }}>Already a client? Log in to your portal below.</p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/signup" style={{ display: 'inline-block', background: 'var(--gold)', color: '#080808', padding: '13px 36px', fontSize: '12px', letterSpacing: '2px', textDecoration: 'none', fontWeight: 700, borderRadius: '4px' }}>
            APPLY NOW
          </Link>
          <Link href="/client" style={{ display: 'inline-block', border: '1px solid var(--border)', color: 'var(--muted)', padding: '13px 36px', fontSize: '12px', letterSpacing: '2px', textDecoration: 'none', borderRadius: '4px' }}>
            CLIENT LOGIN
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '28px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="serif" style={{ fontSize: '12px', color: 'var(--muted)', letterSpacing: '3px' }}>SAUZULE</span>
        <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Premium Nutrition Coaching</span>
      </footer>

    </div>
  )
}
