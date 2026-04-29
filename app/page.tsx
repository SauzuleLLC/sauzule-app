'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await signIn('coach-login', {
      email, password, redirect: false,
    })
    if (res?.ok) {
      router.push('/dashboard')
    } else {
      setError('Invalid email or password')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
         style={{ background: 'radial-gradient(ellipse at center, #0d0b07 0%, #080808 70%)' }}>
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-10">
          <h1 className="serif text-3xl" style={{ color: 'var(--gold)', letterSpacing: '4px' }}>
            SAUZULE
          </h1>
          <p className="text-xs mt-1" style={{ color: 'var(--muted)', letterSpacing: '2px' }}>
            COACH PORTAL
          </p>
        </div>

        <div className="rounded-xl p-8" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <h2 className="serif text-xl mb-6" style={{ color: 'var(--txt)' }}>Welcome back</h2>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs mb-2" style={{ color: 'var(--muted)', letterSpacing: '0.5px' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2.5 text-sm rounded-md"
                placeholder="coach@sauzule.com"
              />
            </div>
            <div>
              <label className="block text-xs mb-2" style={{ color: 'var(--muted)', letterSpacing: '0.5px' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2.5 text-sm rounded-md"
                placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
              />
            </div>

            {error && (
              <p className="text-xs text-center" style={{ color: '#e74c3c' }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-md text-sm font-medium transition-all"
              style={{
                background: loading ? 'var(--border)' : 'var(--gold)',
                color: '#080808',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Signing in\u2026' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: 'var(--muted)' }}>
          Sauzule LLC \u00b7 Premium Nutrition Coaching
        </p>
      </div>
    </div>
  )
}
