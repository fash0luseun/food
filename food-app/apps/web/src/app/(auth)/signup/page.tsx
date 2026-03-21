'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Logo } from '@/components/ui/Logo'
import { Spinner } from '@/components/ui/Spinner'

export default function SignupPage() {
  const { login, isAuthenticated } = useAuth()
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) { router.replace('/restaurants'); return null }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      login(data.token, data.user)
      router.replace('/restaurants')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative z-10 min-h-screen bg-[var(--bg)] flex">

      {/* Left — brand panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col items-center justify-center p-12 premium-grid-bg">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold-bg)] to-transparent pointer-events-none" />
        <div className="relative text-center">
          <Logo size={80} />
          <h2 className="mt-5 text-4xl font-black text-[var(--text)]">D<span className="text-[var(--gold)]">&</span>D</h2>
          <p className="text-sm font-bold text-[var(--gold)] uppercase tracking-widest mt-1">Premium Delivery</p>
          <p className="mt-5 text-[var(--text-2)] text-base max-w-xs mx-auto">Join thousands enjoying premium Nigerian food delivery.</p>
          <div className="mt-8 text-6xl">🍔</div>
          <div className="mt-8 grid grid-cols-3 gap-4 max-w-xs mx-auto">
            {[['Free', '1st delivery'], ['30min', 'Avg. time'], ['24/7', 'Support']].map(([val, label]) => (
              <div key={label} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-3">
                <p className="text-lg font-black text-[var(--gold)]">{val}</p>
                <p className="text-xs text-[var(--text-3)] mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="flex justify-center mb-8 lg:hidden">
            <div className="flex items-center gap-2.5">
              <Logo size={36} />
              <span className="text-2xl font-black text-[var(--text)]">D<span className="text-[var(--gold)]">&</span>D</span>
            </div>
          </div>

          <h1 className="text-2xl font-black text-[var(--text)] mb-1">Create New Account</h1>
          <p className="text-sm text-[var(--text-3)] mb-8">Join D&amp;D and start ordering today</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-[var(--text-2)] mb-1.5" htmlFor="name">Full name</label>
              <input id="name" type="text" placeholder="Jane Doe" value={name}
                onChange={(e) => setName(e.target.value)} required
                className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-3)] text-sm focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)] transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[var(--text-2)] mb-1.5" htmlFor="email">Email</label>
              <input id="email" type="email" placeholder="you@example.com" value={email}
                onChange={(e) => setEmail(e.target.value)} required
                className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-3)] text-sm focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)] transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[var(--text-2)] mb-1.5" htmlFor="password">Password</label>
              <input id="password" type="password" placeholder="Min. 6 characters" value={password}
                onChange={(e) => setPassword(e.target.value)} minLength={6} required
                className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-3)] text-sm focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)] transition-colors" />
            </div>

            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400 font-medium">{error}</div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-[var(--gold)] hover:bg-[var(--gold-hover)] disabled:opacity-60 rounded-xl text-sm font-black text-[var(--gold-text)] transition-colors active:scale-[0.98] flex items-center justify-center gap-2 mt-1"
              style={{ boxShadow: 'var(--shadow-gold)' }}>
              {loading ? <><Spinner className="w-4 h-4 text-[var(--gold-text)]" /> Creating account...</> : 'Create account'}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-[var(--text-3)]">
            By signing up, you agree to our{' '}
            <a href="#" className="text-[var(--gold)] hover:underline">Terms</a> and{' '}
            <a href="#" className="text-[var(--gold)] hover:underline">Privacy Policy</a>
          </p>

          <p className="mt-6 text-center text-sm text-[var(--text-3)]">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-[var(--gold)] hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
