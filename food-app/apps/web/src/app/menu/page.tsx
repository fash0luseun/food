'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { MenuItem } from '@food-app/shared'
import { Navbar } from '@/components/layout/Navbar'
import { MenuItemCard } from '@/components/restaurant/MenuItemCard'
import { Spinner } from '@/components/ui/Spinner'
import { useAuth } from '@/context/AuthContext'

const TRIBES = ['All', 'Yoruba', 'Igbo', 'Hausa', 'Efik', 'Urhobo', 'Ijaw']

const TRIBE_META: Record<string, { color: string; flag: string; region: string }> = {
  Yoruba:  { color: 'bg-green-500',  flag: '🟢', region: 'South-West' },
  Igbo:    { color: 'bg-blue-500',   flag: '🔵', region: 'South-East' },
  Hausa:   { color: 'bg-orange-500', flag: '🟠', region: 'North' },
  Efik:    { color: 'bg-purple-500', flag: '🟣', region: 'Cross River' },
  Urhobo:  { color: 'bg-teal-500',   flag: '🩵', region: 'Delta State' },
  Ijaw:    { color: 'bg-red-500',    flag: '🔴', region: 'Bayelsa / Rivers' },
}

const TRIBE_ACTIVE: Record<string, string> = {
  Yoruba: 'bg-green-500 text-white border-green-500',
  Igbo:   'bg-blue-500 text-white border-blue-500',
  Hausa:  'bg-orange-500 text-white border-orange-500',
  Efik:   'bg-purple-500 text-white border-purple-500',
  Urhobo: 'bg-teal-500 text-white border-teal-500',
  Ijaw:   'bg-red-500 text-white border-red-500',
}

export default function NigerianMenuPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [allItems, setAllItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTribe, setActiveTribe] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.replace('/login')
  }, [authLoading, isAuthenticated, router])

  useEffect(() => {
    // Fetch menu items from all restaurants
    const restaurantIds = ['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7']
    Promise.all(
      restaurantIds.map((id) =>
        fetch(`/api/restaurants/${id}/menu`)
          .then((r) => r.json())
          .then((d) => (d.items ?? []) as MenuItem[])
          .catch(() => [] as MenuItem[])
      )
    )
      .then((results) => setAllItems(results.flat()))
      .finally(() => setLoading(false))
  }, [])

  if (authLoading || !isAuthenticated) return null

  const filtered = allItems.filter((item) => {
    const matchTribe = activeTribe === 'All' || item.tribe === activeTribe
    const matchSearch =
      !search ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.tribe ?? '').toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
    return matchTribe && matchSearch && item.isAvailable
  })

  // Group by tribe for the "All" view
  const grouped = TRIBES.filter((t) => t !== 'All').reduce<Record<string, MenuItem[]>>((acc, tribe) => {
    const items = filtered.filter((i) => i.tribe === tribe)
    if (items.length) acc[tribe] = items
    return acc
  }, {})

  const tribeCounts = TRIBES.slice(1).reduce<Record<string, number>>((acc, t) => {
    acc[t] = allItems.filter((i) => i.tribe === t && i.isAvailable).length
    return acc
  }, {})

  return (
    <>
      <Navbar />
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-[var(--text)]">
            Nigerian Tribes <span className="text-[var(--gold)]">Menu</span>
          </h1>
          <p className="text-sm text-[var(--text-3)] mt-1">
            Authentic dishes from 6 tribes across Nigeria — order your heritage
          </p>
        </div>

        {/* Tribe legend cards */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-6">
          {TRIBES.slice(1).map((tribe) => {
            const meta = TRIBE_META[tribe]
            return (
              <button
                key={tribe}
                onClick={() => setActiveTribe(tribe === activeTribe ? 'All' : tribe)}
                className={`flex flex-col items-center gap-1 py-3 px-2 rounded-2xl border text-center transition-all ${
                  activeTribe === tribe
                    ? `${TRIBE_ACTIVE[tribe]} shadow-lg scale-105`
                    : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-2)] hover:border-[var(--gold)]/40'
                }`}
              >
                <span className="text-2xl">{meta.flag}</span>
                <span className="text-xs font-black leading-tight">{tribe}</span>
                <span className={`text-[10px] font-semibold ${activeTribe === tribe ? 'opacity-80' : 'text-[var(--text-3)]'}`}>
                  {meta.region}
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  activeTribe === tribe ? 'bg-white/20' : 'bg-[var(--surface-2)] text-[var(--text-3)]'
                }`}>
                  {tribeCounts[tribe] ?? 0} dishes
                </span>
              </button>
            )
          })}
        </div>

        {/* Search + tribe filter pills */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search dishes, tribes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-3)] text-sm focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)] transition-colors"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {TRIBES.map((tribe) => (
              <button
                key={tribe}
                onClick={() => setActiveTribe(tribe)}
                className={`shrink-0 px-4 py-2.5 rounded-xl border text-sm font-bold transition-all ${
                  activeTribe === tribe
                    ? tribe === 'All'
                      ? 'bg-[var(--gold)] border-[var(--gold)] text-[var(--gold-text)]'
                      : `${TRIBE_ACTIVE[tribe]}`
                    : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-2)] hover:border-[var(--gold)]/40'
                }`}
              >
                {tribe}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Spinner className="h-8 w-8 text-[var(--gold)]" />
            <p className="text-sm text-[var(--text-3)]">Loading Nigerian menu...</p>
          </div>
        ) : activeTribe !== 'All' ? (
          /* Single tribe grid */
          <>
            <div className="flex items-center gap-3 mb-5">
              <div className={`w-3 h-3 rounded-full ${TRIBE_META[activeTribe]?.color}`} />
              <h2 className="text-xl font-black text-[var(--text)]">{activeTribe} Cuisine</h2>
              <span className="text-sm text-[var(--text-3)]">· {TRIBE_META[activeTribe]?.region}</span>
              <span className="ml-auto text-sm font-bold text-[var(--text-3)]">{filtered.length} dishes</span>
            </div>
            {filtered.length === 0 ? (
              <div className="py-16 text-center text-[var(--text-3)]">No dishes found.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((item) => (
                  <MenuItemCard key={item.id} item={item} restaurantId={item.restaurantId} variant="grid" />
                ))}
              </div>
            )}
          </>
        ) : (
          /* All tribes — grouped sections */
          <div className="flex flex-col gap-10">
            {Object.entries(grouped).map(([tribe, items]) => (
              <section key={tribe}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-3 h-3 rounded-full ${TRIBE_META[tribe]?.color}`} />
                  <h2 className="text-lg font-black text-[var(--text)]">{tribe} Cuisine</h2>
                  <span className="text-sm text-[var(--text-3)]">· {TRIBE_META[tribe]?.region}</span>
                  <button
                    onClick={() => setActiveTribe(tribe)}
                    className="ml-auto text-xs font-bold text-[var(--gold)] hover:underline"
                  >
                    See all →
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {items.slice(0, 4).map((item) => (
                    <MenuItemCard key={item.id} item={item} restaurantId={item.restaurantId} variant="grid" />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
