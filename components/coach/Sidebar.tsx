'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { SauzuleLogo } from '@/components/ui/SauzuleLogo'

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: '◈' },
  { href: '/clients', label: 'Clients', icon: '◉' },
  { href: '/meal-plans', label: 'Meal Plans', icon: '▦' },
  { href: '/billing', label: 'Billing & Pricing', icon: '◆' },
  { href: '/supplements', label: 'Supplements', icon: '◎' },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <aside className="w-56 flex flex-col flex-shrink-0"
           style={{ background: 'var(--card)', borderRight: '1px solid var(--border)', height: '100vh' }}>
      {/* Logo */}
      <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-3">
          <SauzuleLogo size={32} />
          <div>
            <div className="serif text-lg font-semibold" style={{ color: 'var(--gold)', letterSpacing: '3px' }}>
              SAUZULE
            </div>
            <div className="text-[10px]" style={{ color: 'var(--muted)', letterSpacing: '1px' }}>
              COACH PORTAL
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3">
        <p className="px-5 py-2 text-[10px]" style={{ color: 'var(--muted)', letterSpacing: '1.5px' }}>
          OVERVIEW
        </p>
        {nav.map(item => {
          const active = pathname === item.href
          return (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-3 px-5 py-2.5 text-sm transition-all"
              style={{
                color: active ? 'var(--gold)' : 'var(--muted)',
                background: active ? 'var(--gold-dim)' : 'transparent',
                borderLeft: active ? '2px solid var(--gold)' : '2px solid transparent',
              }}>
              <span className="text-sm">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Coach info */}
      <div className="px-5 py-4" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
               style={{ background: 'var(--gold-dim)', border: '1px solid var(--border)', color: 'var(--gold)' }}>
            {session?.user?.name?.split(' ').map(n => n[0]).join('') || 'PK'}
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
  )
}
