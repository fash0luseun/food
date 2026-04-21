'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import { useLocation } from '@/context/LocationContext'
import { useTheme } from '@/context/ThemeContext'
import { Logo } from '@/components/ui/Logo'

// ── Tiny theme-cycle button ──────────────────────────────────
function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const next = theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system'
  const icons = {
    system: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    light: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 110 14A7 7 0 0112 5z" />
      </svg>
    ),
    dark: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    ),
  }
  return (
    <button
      onClick={() => setTheme(next)}
      title={`Theme: ${theme} — click to switch`}
      className="flex items-center justify-center w-9 h-9 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--gold)] hover:text-[var(--gold)] text-[var(--text-2)] transition-all"
    >
      {icons[theme]}
    </button>
  )
}

// ── Navbar ───────────────────────────────────────────────────
export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const { totalItems } = useCart()
  const { location, openModal } = useLocation()
  const router = useRouter()
  const [navSearch, setNavSearch] = useState('')

  function handleNavSearch(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && navSearch.trim()) {
      router.push(`/restaurants?q=${encodeURIComponent(navSearch.trim())}`)
      setNavSearch('')
    }
  }

  function handleLogout() {
    logout()
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg-nav)] backdrop-blur-md" style={{ boxShadow: 'var(--shadow-sm)' }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 gap-4">

        {/* Logo + name */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <Logo size={36} />
          <div className="hidden sm:block leading-none">
            <span className="text-xl font-black text-[var(--text)] tracking-tight">
              D<span className="text-[var(--gold)]">&</span>D
            </span>
            <p className="text-[10px] text-[var(--text-3)] font-medium tracking-widest uppercase">Premium Delivery</p>
          </div>
        </Link>

        {/* Location selector */}
        <button
          onClick={openModal}
          className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--gold)] transition-all text-sm text-[var(--text-2)] max-w-xs group"
        >
          <span className="text-base shrink-0">{location.flag}</span>
          <span className="truncate font-medium">{location.city}</span>
          <svg className="w-3 h-3 text-[var(--text-3)] shrink-0 group-hover:text-[var(--gold)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Search bar */}
        <div className="flex-1 max-w-md hidden sm:block">
          <div className="relative">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search Nigerian food or restaurants..."
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              onKeyDown={handleNavSearch}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--text)] placeholder-[var(--text-3)] focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)] transition-colors"
            />
          </div>
        </div>

        {/* Actions */}
        <nav className="flex items-center gap-2">

          {/* Mobile location pin */}
          <button
            onClick={openModal}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--gold)] transition-colors"
          >
            <svg className="w-4 h-4 text-[var(--gold)]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Settings gear */}
          <Link
            href="/settings"
            title="Settings"
            className="flex items-center justify-center w-9 h-9 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--gold)] hover:text-[var(--gold)] text-[var(--text-2)] transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </Link>

          {isAuthenticated ? (
            <>
              <span className="hidden lg:block text-sm text-[var(--text-2)] font-medium">
                Hi, <span className="text-[var(--text)]">{user?.name.split(' ')[0]}</span>
              </span>

              {user?.role === 'admin' && (
                <Link
                  href="/admin"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold text-[var(--gold)] bg-[var(--gold-bg)] border border-[var(--gold-border)] hover:bg-[var(--gold)]/20 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Admin
                </Link>
              )}

              <Link
                href="/menu"
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-[var(--text-2)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Menu
              </Link>

              <Link
                href="/orders"
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-[var(--text-2)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Orders
              </Link>

              <Link
                href="/cart"
                className="relative flex items-center gap-2 px-4 py-2 bg-[var(--gold)] hover:bg-[var(--gold-hover)] rounded-xl text-sm font-black text-[var(--gold-text)] transition-colors"
                style={{ boxShadow: 'var(--shadow-gold)' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="hidden sm:block">Cart</span>
                {totalItems > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--gold-text)] text-xs font-black text-[var(--gold)]">
                    {totalItems}
                  </span>
                )}
              </Link>

              <button
                onClick={handleLogout}
                className="hidden sm:block px-3 py-2 rounded-xl text-sm font-medium text-[var(--text-3)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl text-sm font-semibold text-[var(--text-2)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-all"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 bg-[var(--gold)] hover:bg-[var(--gold-hover)] rounded-xl text-sm font-black text-[var(--gold-text)] transition-colors"
                style={{ boxShadow: 'var(--shadow-gold)' }}
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
