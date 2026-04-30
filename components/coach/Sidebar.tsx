'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: '◈' },
  { href: '/clients', label: 'Clients', icon: '◉' },
  { href: '/meal-plans', label: 'Meal Plans', icon: '▦' },
  { href: '/billing', label: 'Billing', icon: '◆' },
  { href: '/supplements', label: 'Supplements', icon: '◎' },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <>
      {/* Desktop sidebar - hidden on mobile */}
      <aside className="hidden md:flex md:w-56 flex-col flex-shrink-0"
        style={{ background: 'var(--card)', borderRight: '1px solid var(--border)', height: '100vh' }}>

        <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="serif text-xl font-semibold" style={{ color: 'var(--gold)', letterSpacing: '4px' }}>
            SAUZULE
          </div>
          <div className="text-[10px] mt-0.5" style={{ color: 'var(--muted)', letterSpacing: '1px' }}>
            COACH PORTAL
          </div>
        </div>

        <nav className="flex-1 py-3">
          <p className="px-5 py-2 text-[10px]" style={{ color: 'var(--muted)', letterSpacing: '1.5px' }}>
            OVERVIEW
          </p>
          {nav.map(item => {
            const active = pathname === item.href
            return (
              <Link key={item.href} href={item.href}
                className="flex items-center gap-3 px-5 py-3 text-sm transition-all"
                style={{
                  color: active ? 'var(--gold)' : 'var(--muted)',
                  background: active ? 'var(--gold-dim)' : 'transparent',
                  borderLeft: active ? '2px solid var(--gold)' : '2px solid transparent',
                }}>
                <span>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="px-5 py-4" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
              style={{ background: 'var(--gold-dim)', border: '1px solid var(--border)', color: 'var(--gold)' }}>
              {session?.user?.name?.split(' ').map((n: string) => n[0]).join('') || 'PK'}
            </div>
            <div>
              <div className="text-xs font-medium" style={{ color: 'var(--txt)' }}>
                {session?.user?.name || 'Patrick Kennedy'}
              </div>
              <div className="text-[10px]" style={{ color: 'var(--muted)' }}>Head Coach</div>
            </div>
          </div>
          <button onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full text-xs py-1.5 rounded text-left px-2 transition-all"
            style={{ color: 'var(--muted)', background: 'transparent' }}
            onMouseOver={e => (e.currentTarget.style.color = 'var(--gold)')}
            onMouseOut={e => (e.currentTarget.style.color = 'var(--muted)')}>
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile top header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5"
        style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)', height: '52px' }}>
        <div className="serif font-semibold" style={{ color: 'var(--gold)', letterSpacing: '3px', fontSize: '15px' }}>
          SAUZULE
        </div>
        <button onClick={() => signOut({ callbackUrl: '/' })}
          className="text-xs px-3 py-1.5 rounded"
          style={{ color: 'var(--muted)', border: '1px solid var(--border)' }}>
          Sign out
        </button>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center"
        style={{ background: 'var(--card)', borderTop: '1px solid var(--border)', height: '62px' }}>
        {nav.map(item => {
          const active = pathname === item.href
          return (
            <Link key={item.href} href={item.href}
              className="flex flex-col items-center justify-center flex-1 h-full gap-1"
              style={{ color: active ? 'var(--gold)' : 'var(--muted)' }}>
              <span style={{ fontSize: '17px' }}>{item.icon}</span>
              <span style={{ fontSize: '9px', letterSpacing: '0.3px' }}>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
