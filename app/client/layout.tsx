'use client'
import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

const NAV = [
  { href: '/client/meal-plan', label: 'Meal Plan', icon: '🥗' },
  { href: '/client/fast-food', label: 'Fast Food', icon: '🍔' },
  { href: '/client/supplements', label: 'Supplements', icon: '💊' },
  { href: '/client/check-in', label: 'Check-In', icon: '📋' },
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
        <div className="w-8 h-8 border-2 border-gold rounded-full animate-spin" style={{ borderTopColor: 'transparent', borderColor: '#b8985a' }} />
      </div>
    )
  }

  if (!session || session.user.role !== 'client') return null

  return (
    <div className="min-h-screen" style={{ background: '#080808', color: '#e8e0d0' }}>
      {/* Top bar */}
      <header className="border-b" style={{ borderColor: '#1a1a1a', background: '#0d0d0d' }}>
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <div className="font-cormorant text-xl" style={{ color: '#b8985a' }}>Sauzule</div>
            <div className="text-xs opacity-60">Welcome, {session.user.name}</div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/client/login' })}
            className="text-xs opacity-50 hover:opacity-100 transition-opacity"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 pb-24">
        {children}
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 border-t" style={{ background: '#0d0d0d', borderColor: '#1a1a1a' }}>
        <div className="max-w-2xl mx-auto flex">
          {NAV.map(({ href, label, icon }) => {
            const active = path.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className="flex-1 flex flex-col items-center py-3 gap-1 text-xs transition-colors"
                style={{ color: active ? '#b8985a' : '#666' }}
              >
                <span className="text-xl">{icon}</span>
                <span>{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
