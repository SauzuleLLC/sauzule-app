'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function ClientLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await signIn('client-login', {
      email,
      password,
      redirect: false,
    })
    setLoading(false)
    if (res?.error) {
      setError('Invalid email or password.')
    } else {
      router.push('/client/meal-plan')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#080808' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="font-cormorant text-5xl mb-2" style={{ color: '#b8985a' }}>Sauzule</div>
          <p className="text-sm opacity-60" style={{ color: '#e8e0d0' }}>Your nutrition portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs mb-1 uppercase tracking-widest opacity-60" style={{ color: '#e8e0d0' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded text-sm outline-none focus:ring-1"
              style={{
                background: '#111',
                border: '1px solid #222',
                color: '#e8e0d0',
              }}
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-xs mb-1 uppercase tracking-widest opacity-60" style={{ color: '#e8e0d0' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded text-sm outline-none"
              style={{ background: '#111', border: '1px solid #222', color: '#e8e0d0' }}
              placeholder="â¢â¢â¢â¢â¢â¢â¢â¢"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded font-semibold text-sm tracking-wider uppercase transition-opacity"
            style={{ background: '#b8985a', color: '#080808', opacity: loading ? 0.6 : 1 }}
          >
            {loading ? 'Signing inâ¦' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs mt-8 opacity-40" style={{ color: '#e8e0d0' }}>
          Coach login? <a href="/" className="underline">Click here</a>
        </p>
      </div>
    </div>
  )
}
