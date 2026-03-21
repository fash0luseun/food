'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Restaurant, MenuItem } from '@food-app/shared'
import { Navbar } from '@/components/layout/Navbar'
import { MenuItemCard } from '@/components/restaurant/MenuItemCard'
import { Modal } from '@/components/ui/Modal'
import { Spinner } from '@/components/ui/Spinner'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { formatPrice } from '@/lib/utils'

export default function RestaurantDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [categories, setCategories] = useState<string[]>([])
  const [items, setItems] = useState<MenuItem[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('')
  const [loading, setLoading] = useState(true)

  const { pendingItem, confirmSwitch, cancelSwitch, totalItems, items: cartItems } = useCart()
  const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.replace('/login')
  }, [authLoading, isAuthenticated, router])

  useEffect(() => {
    Promise.all([
      fetch(`/api/restaurants/${id}`).then((r) => r.json()),
      fetch(`/api/restaurants/${id}/menu`).then((r) => r.json()),
    ])
      .then(([rData, mData]) => {
        setRestaurant(rData.restaurant)
        setCategories(mData.categories)
        setItems(mData.items)
        setActiveCategory(mData.categories[0] ?? '')
      })
      .finally(() => setLoading(false))
  }, [id])

  if (authLoading || !isAuthenticated) return null

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Spinner className="h-8 w-8 text-[var(--gold)]" />
          <p className="text-sm text-[var(--text-3)]">Loading menu...</p>
        </div>
      </>
    )
  }

  if (!restaurant) {
    return (
      <>
        <Navbar />
        <div className="py-20 text-center">
          <p className="text-5xl mb-4">🍽️</p>
          <p className="text-lg font-bold text-[var(--text)]">Restaurant not found</p>
          <Link href="/restaurants" className="mt-4 inline-block text-sm text-[var(--gold)] font-semibold hover:underline">
            Back to restaurants
          </Link>
        </div>
      </>
    )
  }

  const visibleItems = items.filter((i) => i.category === activeCategory)

  return (
    <>
      <Navbar />

      {/* Hero banner */}
      <div className="relative z-10 h-64 overflow-hidden bg-[var(--surface)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={restaurant.imageUrl}
          alt={restaurant.name}
          className="h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-black/30 to-transparent" />

        <Link
          href="/restaurants"
          className="absolute top-4 left-4 flex items-center justify-center w-10 h-10 bg-[var(--surface)]/90 border border-[var(--border)] rounded-full hover:border-[var(--gold)]/50 transition-colors backdrop-blur-sm"
        >
          <svg className="w-5 h-5 text-[var(--text)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-black text-white">{restaurant.name}</h1>
              <p className="text-sm text-white/70 mt-0.5">{restaurant.description}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              restaurant.isOpen
                ? 'bg-green-500/20 border border-green-500/40 text-green-400'
                : 'bg-red-500/20 border border-red-500/40 text-red-400'
            }`}>
              {restaurant.isOpen ? 'Open' : 'Closed'}
            </span>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="relative z-10 bg-[var(--surface)] border-b border-[var(--border)] sticky top-16">
        <div className="mx-auto max-w-4xl px-4 py-3 flex items-center gap-5 text-sm text-[var(--text-2)] overflow-x-auto">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[var(--gold)]">★</span>
            <span className="font-bold text-[var(--text)]">{restaurant.rating}</span>
            <span className="text-[var(--text-3)]">({restaurant.reviewCount})</span>
          </div>
          <span className="text-[var(--border)]">|</span>
          <div className="flex items-center gap-1.5 shrink-0">
            <svg className="w-4 h-4 text-[var(--gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{restaurant.deliveryTime}</span>
          </div>
          <span className="text-[var(--border)]">|</span>
          <span className="shrink-0">{formatPrice(restaurant.deliveryFee)} delivery</span>
          <span className="text-[var(--border)]">|</span>
          <span className="shrink-0">Min. {formatPrice(restaurant.minimumOrder)}</span>
        </div>
      </div>

      <main className="relative z-10 mx-auto max-w-4xl px-4 pb-28">

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto py-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 rounded-2xl px-5 py-2 text-sm font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-[var(--gold)] text-[var(--gold-text)]'
                  : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text-2)] hover:border-[var(--gold)]/50 hover:text-[var(--text)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <h2 className="text-lg font-bold text-[var(--text)] mb-3">{activeCategory}</h2>

        <div className="flex flex-col gap-3">
          {visibleItems.map((item) => (
            <MenuItemCard key={item.id} item={item} restaurantId={id} />
          ))}
        </div>
      </main>

      {/* Floating cart */}
      {totalItems > 0 && (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center z-30 px-4">
          <button
            onClick={() => router.push('/cart')}
            className="flex items-center justify-between gap-4 bg-[var(--gold)] hover:bg-[var(--gold-h)] text-[var(--gold-text)] rounded-2xl px-5 py-4 w-full max-w-md shadow-2xl transition-colors active:scale-[0.98]"
          >
            <span className="flex items-center justify-center w-8 h-8 bg-[var(--gold-text)] rounded-xl text-[var(--gold)] font-black text-sm">
              {totalItems}
            </span>
            <span className="font-black flex-1 text-left">View cart</span>
            <span className="font-black">{formatPrice(cartTotal)}</span>
          </button>
        </div>
      )}

      <Modal
        isOpen={!!pendingItem}
        title="Start a new cart?"
        onConfirm={confirmSwitch}
        onCancel={cancelSwitch}
        confirmLabel="Clear & Add"
        cancelLabel="Keep current"
      >
        Your cart has items from another restaurant. Clear it to add items from{' '}
        <strong>{restaurant.name}</strong>?
      </Modal>
    </>
  )
}
