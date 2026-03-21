'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import type { Restaurant } from '@food-app/shared'
import { Navbar } from '@/components/layout/Navbar'
import { RestaurantCard } from '@/components/restaurant/RestaurantCard'
import { Spinner } from '@/components/ui/Spinner'
import { useLocation } from '@/context/LocationContext'
import { useAuth } from '@/context/AuthContext'

const CATEGORIES = [
  { label: 'All',           icon: '🍽️' },
  { label: 'Rice Dishes',   icon: '🍚' },
  { label: 'Soups',         icon: '🍲' },
  { label: 'Swallow',       icon: '🫓' },
  { label: 'Suya & Grills', icon: '🔥' },
  { label: 'Pepper Soup',   icon: '🌶️' },
  { label: 'Snacks',        icon: '🫔' },
  { label: 'Drinks',        icon: '🥤' },
]

const SORT_OPTIONS = [
  { label: 'Recommended', icon: '⭐' },
  { label: 'Popularity',  icon: '🔥' },
  { label: 'Rating',      icon: '★' },
  { label: 'Distance',    icon: '📍' },
]

const DELIVERY_FEES = [
  { label: 'Any',    value: '' },
  { label: 'Free',   value: 'free' },
  { label: '< ₦500', value: '500' },
  { label: '< ₦1k',  value: '1000' },
]

export default function RestaurantsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('q') ?? '')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('Recommended')
  const [showFilter, setShowFilter] = useState(false)
  const { location, openModal } = useLocation()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.replace('/login')
  }, [authLoading, isAuthenticated, router])

  useEffect(() => {
    setSearch(searchParams.get('q') ?? '')
  }, [searchParams])

  useEffect(() => {
    fetch('/api/restaurants')
      .then((r) => r.json())
      .then((data) => setRestaurants(data.restaurants))
      .finally(() => setLoading(false))
  }, [])

  if (authLoading || !isAuthenticated) return null

  const filtered = restaurants.filter((r) => {
    const matchSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'All' || r.cuisine.toLowerCase().includes(category.toLowerCase())
    return matchSearch && matchCat
  })

  return (
    <>
      <Navbar />

      {/* Location bar */}
      <div className="relative z-10 bg-[var(--surface)] border-b border-[var(--border)]">
        <div className="mx-auto max-w-7xl px-4 py-2.5 flex items-center gap-2">
          <svg className="w-4 h-4 text-[var(--gold)] shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-semibold text-[var(--text-2)]">
            Delivering to: <span className="text-[var(--text)]">{location.city}, {location.country}</span>
          </span>
          <button onClick={openModal} className="ml-1 text-xs font-bold text-[var(--gold)] hover:underline transition-colors">
            Change
          </button>
        </div>
      </div>

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-6">

        {/* Search + filter row */}
        <div className="flex gap-3 mb-5">
          <div className="relative flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-3)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search restaurants or dishes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-3)] text-sm focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)] transition-colors"
              style={{ boxShadow: 'var(--shadow-sm)' }}
            />
          </div>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`flex items-center gap-2 px-4 py-3.5 rounded-2xl border text-sm font-bold transition-all ${
              showFilter
                ? 'bg-[var(--gold)] border-[var(--gold)] text-[var(--gold-text)]'
                : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-2)] hover:border-[var(--gold)]/50 hover:text-[var(--gold)]'
            }`}
            style={{ boxShadow: 'var(--shadow-sm)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            Filter
          </button>
        </div>

        {/* Filter panel */}
        {showFilter && (
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 mb-5 grid grid-cols-1 sm:grid-cols-3 gap-5" style={{ boxShadow: 'var(--shadow)' }}>
            {/* Sort by */}
            <div>
              <p className="text-xs font-black text-[var(--text)] uppercase tracking-widest mb-3">Sort by</p>
              <div className="flex flex-col gap-2">
                {SORT_OPTIONS.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => setSort(s.label)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all text-left ${
                      sort === s.label
                        ? 'bg-[var(--gold-bg)] border border-[var(--gold-border)] text-[var(--gold)]'
                        : 'text-[var(--text-2)] hover:bg-[var(--surface-2)]'
                    }`}
                  >
                    <span>{s.icon}</span>
                    <span>{s.label}</span>
                    {sort === s.label && (
                      <svg className="ml-auto w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Restaurant type */}
            <div>
              <p className="text-xs font-black text-[var(--text)] uppercase tracking-widest mb-3">Restaurant</p>
              <div className="flex flex-col gap-2">
                {['All Restaurants', 'Priority Restaurant', 'Small-MSME Restaurants'].map((r) => (
                  <button key={r} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[var(--text-2)] hover:bg-[var(--surface-2)] font-semibold transition-all text-left">
                    <div className="w-4 h-4 rounded border border-[var(--border)] flex items-center justify-center">
                      {r === 'All Restaurants' && <div className="w-2 h-2 rounded bg-[var(--gold)]" />}
                    </div>
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery fee */}
            <div>
              <p className="text-xs font-black text-[var(--text)] uppercase tracking-widest mb-3">Delivery Fee</p>
              <div className="flex flex-col gap-2">
                {DELIVERY_FEES.map((f) => (
                  <button key={f.label} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[var(--text-2)] hover:bg-[var(--surface-2)] font-semibold transition-all text-left">
                    <div className="w-4 h-4 rounded border border-[var(--border)] flex items-center justify-center">
                      {f.value === '' && <div className="w-2 h-2 rounded bg-[var(--gold)]" />}
                    </div>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="sm:col-span-3 flex gap-3 justify-end pt-2 border-t border-[var(--border)]">
              <button
                onClick={() => { setSort('Recommended'); setCategory('All'); setShowFilter(false) }}
                className="px-5 py-2.5 rounded-xl border border-[var(--border)] text-sm font-bold text-[var(--text-2)] hover:border-[var(--gold)]/50 hover:text-[var(--text)] transition-all"
              >
                Reset
              </button>
              <button
                onClick={() => setShowFilter(false)}
                className="px-5 py-2.5 rounded-xl bg-[var(--gold)] text-sm font-bold text-[var(--gold-text)] hover:bg-[var(--gold-hover)] transition-all"
                style={{ boxShadow: 'var(--shadow-gold)' }}
              >
                Apply
              </button>
            </div>
          </div>
        )}

        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-none">
          {CATEGORIES.map((c) => (
            <button
              key={c.label}
              onClick={() => setCategory(c.label)}
              className={`flex items-center gap-2 shrink-0 rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all ${
                category === c.label
                  ? 'bg-[var(--gold)] text-[var(--gold-text)]'
                  : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text-2)] hover:border-[var(--gold)]/50 hover:text-[var(--text)]'
              }`}
              style={{ boxShadow: 'var(--shadow-sm)' }}
            >
              <span>{c.icon}</span>
              <span>{c.label}</span>
            </button>
          ))}
        </div>

        {/* Count + sort display */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-[var(--text-3)]">
            {loading ? '' : (
              <><span className="font-bold text-[var(--text)]">{filtered.length}</span> restaurant{filtered.length !== 1 ? 's' : ''} found</>
            )}
          </p>
          <p className="text-xs font-semibold text-[var(--text-3)]">
            Sorted by: <span className="text-[var(--gold)]">{sort}</span>
          </p>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Spinner className="h-8 w-8 text-[var(--gold)]" />
            <p className="text-sm text-[var(--text-3)]">Finding restaurants near you...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center">
            <div className="w-20 h-20 mx-auto bg-[var(--surface)] border border-[var(--border)] rounded-2xl flex items-center justify-center mb-4">
              <span className="text-4xl">🍽️</span>
            </div>
            <p className="text-lg font-bold text-[var(--text)]">No restaurants found</p>
            <p className="text-sm text-[var(--text-3)] mt-1">Try a different search or remove filters</p>
            <button
              onClick={() => { setSearch(''); setCategory('All') }}
              className="mt-5 px-6 py-3 bg-[var(--gold)] hover:bg-[var(--gold-hover)] rounded-xl text-sm font-black text-[var(--gold-text)] transition-colors"
              style={{ boxShadow: 'var(--shadow-gold)' }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>
        )}
      </main>
    </>
  )
}
