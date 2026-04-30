import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: 'radial-gradient(ellipse at center, #0d0b07 0%, #080808 70%)', color: 'var(--txt)' }}>

      {/* Nav */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 48px', borderBottom: '1px solid var(--border)' }}>
        <h1 className="serif" style={{ color: 'var(--gold)', letterSpacing: '4px', fontSize: '20px', margin: 0 }}>SAUZULE</h1>
        <Link href="/login" style={{ color: 'var(--muted)', fontSize: '12px', textDecoration: 'none', letterSpacing: '1px' }}>Coach Portal</Link>
      </nav>

      {/* Hero - Split Layout */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', maxWidth: '1100px', margin: '0 auto', padding: '80px 48px', alignItems: 'center' }}>

        {/* Left: Marketing */}
        <div>
          <p style={{ letterSpacing: '4px', fontSize: '11px', color: 'var(--gold)', marginBottom: '24px' }}>PREMIUM NUTRITION COACHING</p>
          <h2 className="serif" style={{ fontSize: '48px', fontWeight: 300, lineHeight: 1.2, marginBottom: '24px', letterSpacing: '2px' }}>
            Transform Your Body.<br />Transform Your Life.
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--muted)', maxWidth: '420px', marginBottom: '40px', lineHeight: 1.8 }}>
            Personalized nutrition and fitness coaching built around your goals, lifestyle, and schedule.
          </p>
          <Link href="/signup" style={{ display: 'inline-block', background: 'var(--gold)', color: '#080808', padding: '14px 44px', fontSize: '12px', letterSpacing: '3px', textDecoration: 'none', fontWeight: 700, borderRadius: '4px' }}>
            START YOUR JOURNEY
          </Link>
        </div>

        {/* Right: Client Portal Card */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '40px', borderTop: '3px solid var(--gold)' }}>
          <p style={{ letterSpacing: '3px', fontSize: '10px', color: 'var(--gold)', marginBottom: '8px' }}>EXISTING CLIENTS</p>
          <h3 className="serif" style={{ fontSize: '24px', fontWeight: 300, marginBottom: '8px', color: 'var(--txt)' }}>Client Portal</h3>
          <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '28px', lineHeight: 1.6 }}>
            Access your meal plan, workout program, grocery list, and weekly check-in.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
            {[
              { icon: 'M', label: 'Custom Meal Plan' },
              { icon: 'W', label: 'Exercise Program' },
              { icon: 'C', label: 'Weekly Check-In' },
              { icon: 'G', label: 'Grocery List' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: 'var(--muted)' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--gold)', flexShrink: 0 }} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
          <Link href="/client" style={{ display: 'block', textAlign: 'center', background: 'var(--gold)', color: '#080808', padding: '14px', fontSize: '12px', letterSpacing: '2px', textDecoration: 'none', fontWeight: 700, borderRadius: '4px' }}>
            ACCESS MY PORTAL
          </Link>
        </div>
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

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '28px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="serif" style={{ fontSize: '12px', color: 'var(--muted)', letterSpacing: '3px' }}>SAUZULE</span>
        <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Premium Nutrition Coaching</span>
      </footer>

    </div>
  )
}
