'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import { Navbar } from '@/components/layout/Navbar'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const { items, totalItems, subtotal, increment, decrement, removeItem } = useCart()
  const router = useRouter()

  if (isLoading) return null
  if (!isAuthenticated) { router.replace('/login'); return null }

  const DELIVERY_FEE = 1.99
  const SERVICE_FEE = 0
  const total = subtotal + DELIVERY_FEE + SERVICE_FEE

  return (
    <>
      <Navbar />
      <main className="relative z-10 mx-auto max-w-2xl px-4 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/restaurants" className="flex items-center justify-center w-9 h-9 bg-[var(--surface)] border border-[var(--border)] rounded-xl hover:border-[var(--gold)]/50 transition-colors">
            <svg className="w-4 h-4 text-[var(--text)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-black text-[var(--text)]">My Cart</h1>
            {totalItems > 0 && (
              <p className="text-xs text-[var(--text-3)] mt-0.5">{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
            )}
          </div>
        </div>

        {totalItems === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 bg-[var(--surface)] border border-[var(--border)] rounded-full flex items-center justify-center mb-5">
              <span className="text-5xl">🛒</span>
            </div>
            <h2 className="text-xl font-bold text-[var(--text)]">Your cart is empty</h2>
            <p className="text-sm text-[var(--text-3)] mt-2">You don&apos;t have any food at this time</p>
            <button
              onClick={() => router.push('/restaurants')}
              className="mt-6 px-8 py-3 bg-[var(--gold)] hover:bg-[var(--gold-hover)] rounded-2xl text-sm font-black text-[var(--gold-text)] transition-colors"
              style={{ boxShadow: 'var(--shadow-gold)' }}
            >
              Browse Restaurants
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">

            {/* Items */}
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden" style={{ boxShadow: 'var(--shadow-sm)' }}>
              {items.map((item, idx) => (
                <div
                  key={item.menuItemId}
                  className={`flex items-center gap-4 p-4 ${idx < items.length - 1 ? 'border-b border-[var(--border-subtle)]' : ''}`}
                >
                  {/* Image */}
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[var(--gold-bg)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[var(--text)] truncate">{item.name}</p>
                    <p className="text-sm font-black text-[var(--gold)] mt-0.5">{formatPrice(item.price)}</p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decrement(item.menuItemId)}
                      className="flex h-8 w-8 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--text-2)] hover:border-[var(--gold)]/50 hover:text-[var(--gold)] transition-colors font-bold"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm font-black text-[var(--text)]">{item.quantity}</span>
                    <button
                      onClick={() => increment(item.menuItemId)}
                      className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--gold)] hover:bg-[var(--gold-hover)] text-[var(--gold-text)] font-bold transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex flex-col items-end gap-1 ml-1">
                    <span className="text-sm font-black text-[var(--text)]">{formatPrice(item.price * item.quantity)}</span>
                    <button
                      onClick={() => removeItem(item.menuItemId)}
                      className="text-xs text-[var(--text-3)] hover:text-red-400 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo code */}
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4" style={{ boxShadow: 'var(--shadow-sm)' }}>
              <p className="text-xs font-bold text-[var(--text-2)] uppercase tracking-widest mb-3">Promo Code</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-3)] text-sm focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)] transition-colors"
                />
                <button className="px-5 py-2.5 bg-[var(--gold)] hover:bg-[var(--gold-hover)] text-[var(--gold-text)] rounded-xl text-sm font-bold transition-all">
                  Apply
                </button>
              </div>
            </div>

            {/* Order summary */}
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5" style={{ boxShadow: 'var(--shadow-sm)' }}>
              <h2 className="font-black text-[var(--text)] mb-4">Order Summary</h2>
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between text-[var(--text-2)]">
                  <span>Subtotal</span><span className="font-semibold text-[var(--text)]">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[var(--text-2)]">
                  <span>Delivery Fee</span><span className="font-semibold text-[var(--text)]">{formatPrice(DELIVERY_FEE)}</span>
                </div>
                <div className="flex justify-between text-[var(--text-2)]">
                  <span>Service Fee</span><span className="font-semibold text-[var(--gold)]">Free</span>
                </div>
                <div className="border-t border-[var(--border)] pt-3 flex justify-between font-black text-[var(--text)] text-base">
                  <span>Total</span>
                  <span className="text-[var(--gold)]">{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            {/* Checkout button */}
            <button
              onClick={() => router.push('/checkout')}
              className="w-full py-4 bg-[var(--gold)] hover:bg-[var(--gold-hover)] rounded-2xl text-base font-black text-[var(--gold-text)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              style={{ boxShadow: 'var(--shadow-gold)' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              Go to Checkout — {formatPrice(total)}
            </button>

          </div>
        )}
      </main>
    </>
  )
}
