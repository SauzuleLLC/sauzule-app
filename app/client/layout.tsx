'use client'
import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

const NAV = [
  { href: '/client',           label: 'Today',      icon: '◈' },
  { href: '/client/meal-plan', label: 'My Plan',    icon: '▦' },
  { href: '/client/exercise',  label: 'Exercise',   icon: '◉' },
  { href: '/client/grocery',   label: 'Grocery',    icon: '◎' },
  { href: '/client/check-in',  label: 'Check-In',   icon: '✓' },
]

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const path = usePathname()

  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user.role !== 'client') {
      router.push('/client/login')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#080808' }}>
        <div className="w-8 h-8 border-2 rounded-full animate-spin"
          style={{ borderColor: '#b8985a', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  if (!session || session.user.role !== 'client') return null

  return (
    <div className="min-h-screen pb-20" style={{ background: '#080808', color: '#e8e0d0' }}>
      {/* Top bar */}
      <header style={{ background: '#0d0d0d', borderBottom: '1px solid #1a1a1a', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', color: '#b8985a', letterSpacing: '3px' }}>SAUZULE</div>
            <div style={{ fontSize: '11px', color: '#555', marginTop: '1px' }}>Hi, {session.user.name?.split(' ')[0]} 👋</div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/client/login' })}
            style={{ fontSize: '11px', color: '#444', border: '1px solid #222', borderRadius: '6px', padding: '6px 12px', background: 'transparent', cursor: 'pointer' }}
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Page content */}
      <main style={{ maxWidth: '640px', margin: '0 auto', padding: '16px 16px 8px' }}>
        {children}
      </main>

      {/* Bottom nav */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#0d0d0d', borderTop: '1px solid #1a1a1a', zIndex: 50 }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex' }}>
          {NAV.map(({ href, label, icon }) => {
            const active = href === '/client' ? path === '/client' : path.startsWith(href)
            return (
              <Link key={href} href={href}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '10px 4px',
                  gap: '3px',
                  color: active ? '#b8985a' : '#555',
                  textDecoration: 'none',
                  fontSize: '9px',
                  letterSpacing: '0.5px',
                  transition: 'color 0.15s',
                }}
              >
                <span style={{ fontSize: '18px', lineHeight: 1 }}>{icon}</span>
                <span>{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
