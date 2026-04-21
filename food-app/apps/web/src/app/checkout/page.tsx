'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import { Navbar } from '@/components/layout/Navbar'
import { Spinner } from '@/components/ui/Spinner'
import { formatPrice } from '@/lib/utils'

const PAYMENT_METHODS = [
  { id: 'card',     label: 'Card Payment',     icon: '💳', sub: 'Visa · Mastercard via Paystack' },
  { id: 'transfer', label: 'Bank Transfer',    icon: '🏦', sub: 'GTBank · Access · Zenith · First Bank · UBA' },
  { id: 'opay',     label: 'OPay',             icon: '📱', sub: 'Instant payment via OPay wallet' },
  { id: 'kuda',     label: 'Kuda Bank',        icon: '🟢', sub: 'Pay with Kuda mobile banking' },
  { id: 'cash',     label: 'Cash on Delivery', icon: '💵', sub: 'Pay when your order arrives' },
]

const BANKS = [
  { name: 'GTBank',      short: 'GTB',    ussd: '*737#',  url: 'https://www.gtbank.com',           color: '#F15A22', icon: '🏧' },
  { name: 'Access Bank', short: 'Access', ussd: '*901#',  url: 'https://www.accessbankplc.com',    color: '#E3001B', icon: '🔴' },
  { name: 'Zenith Bank', short: 'Zenith', ussd: '*966#',  url: 'https://www.zenithbank.com',       color: '#003087', icon: '🔵' },
  { name: 'First Bank',  short: 'First',  ussd: '*894#',  url: 'https://www.firstbanknigeria.com', color: '#005B99', icon: '🏦' },
  { name: 'UBA',         short: 'UBA',    ussd: '*919#',  url: 'https://www.ubagroup.com',         color: '#D42027', icon: '🔴' },
]

const ADDRESSES = [
  { id: 'home',   label: 'Home',          icon: '🏠', detail: '123 Demo Street, Apt 4B, Lagos' },
  { id: 'office', label: 'My Office',     icon: '🏢', detail: '456 Business Ave, Victoria Island, Lagos' },
  { id: 'apt',    label: 'My Apartment',  icon: '🏡', detail: '789 Lekki Phase 1, Lagos' },
]

export default function CheckoutPage() {
  const { isAuthenticated, isLoading, token } = useAuth()
  const { items, subtotal, restaurantId, clearCart } = useCart()
  const router = useRouter()
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [selectedAddress, setSelectedAddress] = useState('home')

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace('/login')
  }, [isLoading, isAuthenticated, router])

  useEffect(() => {
    if (!isLoading && isAuthenticated && items.length === 0) router.replace('/cart')
  }, [isLoading, isAuthenticated, items.length, router])

  if (isLoading || !isAuthenticated || items.length === 0) return null

  const FREE_DELIVERY_THRESHOLD = 30
  const BASE_DELIVERY_FEE = 1.99
  const freeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD
  const DELIVERY_FEE = freeDelivery ? 0 : BASE_DELIVERY_FEE
  const amountToFree = FREE_DELIVERY_THRESHOLD - subtotal
  const total = subtotal + DELIVERY_FEE

  async function handlePlaceOrder() {
    setError('')
    setPlacing(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          restaurantId,
          deliveryFee: DELIVERY_FEE,
          items: items.map((i) => ({ menuItemId: i.menuItemId, name: i.name, price: i.price, quantity: i.quantity })),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      clearCart()
      router.replace(`/orders/${data.order.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order')
    } finally {
      setPlacing(false)
    }
  }

  const selected = PAYMENT_METHODS.find((p) => p.id === paymentMethod)!

  return (
    <>
      <Navbar />
      <main className="relative z-10 mx-auto max-w-2xl px-4 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/cart" className="flex items-center justify-center w-9 h-9 bg-[var(--surface)] border border-[var(--border)] rounded-xl hover:border-[var(--gold)]/50 transition-colors">
            <svg className="w-4 h-4 text-[var(--text)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-2xl font-black text-[var(--text)]">Checkout</h1>
        </div>

        <div className="flex flex-col gap-4">

          {/* ── Delivery address ── */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5" style={{ boxShadow: 'var(--shadow-sm)' }}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-[var(--text)]">Deliver to</h2>
              <button className="text-xs font-bold text-[var(--gold)] hover:underline">Change</button>
            </div>
            <div className="flex flex-col gap-2">
              {ADDRESSES.map((addr) => (
                <button
                  key={addr.id}
                  onClick={() => setSelectedAddress(addr.id)}
                  className={`flex items-center gap-3 w-full px-3 py-3 rounded-xl border text-left transition-all ${
                    selectedAddress === addr.id
                      ? 'border-[var(--gold)] bg-[var(--gold-bg)]'
                      : 'border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--gold)]/40'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                    selectedAddress === addr.id ? 'bg-[var(--gold)] text-[var(--gold-text)]' : 'bg-[var(--surface)] border border-[var(--border)]'
                  }`}>
                    {addr.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[var(--text)]">{addr.label}</p>
                    <p className="text-xs text-[var(--text-3)] truncate">{addr.detail}</p>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                    selectedAddress === addr.id ? 'border-[var(--gold)] bg-[var(--gold)]' : 'border-[var(--border)]'
                  }`}>
                    {selectedAddress === addr.id && <div className="w-1.5 h-1.5 rounded-full bg-[var(--gold-text)]" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ── Free delivery banner ── */}
          {freeDelivery ? (
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[var(--gold-bg)] border border-[var(--gold-border)]">
              <span className="text-2xl">🎉</span>
              <div>
                <p className="text-sm font-bold text-[var(--gold)]">Free delivery unlocked!</p>
                <p className="text-xs text-[var(--text-3)]">Your order qualifies for free delivery. Enjoy!</p>
              </div>
            </div>
          ) : (
            <div className="px-4 py-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)]" style={{ boxShadow: 'var(--shadow-sm)' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🛵</span>
                  <p className="text-sm font-semibold text-[var(--text)]">
                    Add <span className="text-[var(--gold)]">{formatPrice(amountToFree)}</span> more for free delivery
                  </p>
                </div>
                <span className="text-xs text-[var(--text-3)]">Free over ₦30,000</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[var(--surface-2)] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[var(--gold)] transition-all duration-500"
                  style={{ width: `${Math.min((subtotal / FREE_DELIVERY_THRESHOLD) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* ── Payment method ── */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5" style={{ boxShadow: 'var(--shadow-sm)' }}>
            <h2 className="font-bold text-[var(--text)] mb-4">Payment method</h2>

            {/* Selected display */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--gold-bg)] border border-[var(--gold-border)] mb-4">
              <span className="text-2xl">{selected.icon}</span>
              <div>
                <p className="font-bold text-sm text-[var(--text)]">{selected.label}</p>
                <p className="text-xs text-[var(--text-3)]">{selected.sub}</p>
              </div>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 gap-2">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl border text-left transition-all ${
                    paymentMethod === method.id
                      ? 'border-[var(--gold)] bg-[var(--gold-bg)]'
                      : 'border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--gold)]/50'
                  }`}
                >
                  <span className="text-xl shrink-0">{method.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[var(--text)]">{method.label}</p>
                    <p className="text-xs text-[var(--text-3)] truncate">{method.sub}</p>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                    paymentMethod === method.id
                      ? 'border-[var(--gold)] bg-[var(--gold)]'
                      : 'border-[var(--border)]'
                  }`}>
                    {paymentMethod === method.id && <div className="w-1.5 h-1.5 rounded-full bg-[var(--gold-text)]" />}
                  </div>
                </button>
              ))}
            </div>

            {/* ── Contextual panels ── */}

            {/* Card / Paystack */}
            {paymentMethod === 'card' && (
              <div className="mt-4 p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                <p className="text-sm font-semibold text-[var(--text)] mb-2">Pay securely with Paystack</p>
                <p className="text-xs text-[var(--text-3)] mb-3">
                  Your card details are encrypted and processed by Paystack — Nigeria&apos;s leading payment gateway.
                </p>
                <a
                  href="https://paystack.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--gold)] hover:underline"
                >
                  <span>🔒</span> Learn about Paystack security →
                </a>
              </div>
            )}

            {/* Bank Transfer */}
            {paymentMethod === 'transfer' && (
              <div className="mt-4 p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                <p className="text-sm font-semibold text-[var(--text)] mb-1">Choose your bank to transfer</p>
                <p className="text-xs text-[var(--text-3)] mb-3">
                  Open your bank&apos;s app or dial the USSD code to complete your payment.
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {BANKS.map((bank) => (
                    <a
                      key={bank.name}
                      href={bank.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--gold)]/60 hover:bg-[var(--gold-bg)] transition-all group"
                    >
                      <span className="text-xl shrink-0">{bank.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-[var(--text)] group-hover:text-[var(--gold)] transition-colors">{bank.name}</p>
                        <p className="text-xs text-[var(--text-3)]">Dial {bank.ussd} or use mobile app</p>
                      </div>
                      <svg className="w-4 h-4 text-[var(--text-3)] group-hover:text-[var(--gold)] transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* OPay */}
            {paymentMethod === 'opay' && (
              <div className="mt-4 p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                <p className="text-sm font-semibold text-[var(--text)] mb-1">Pay with OPay</p>
                <p className="text-xs text-[var(--text-3)] mb-3">
                  Use your OPay wallet or app for instant, fee-free payments across Nigeria.
                </p>
                <a
                  href="https://www.opayweb.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-[#1A8917] hover:bg-[#157013] text-white font-semibold text-sm transition-colors"
                >
                  <span>Open OPay</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}

            {/* Kuda */}
            {paymentMethod === 'kuda' && (
              <div className="mt-4 p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                <p className="text-sm font-semibold text-[var(--text)] mb-1">Pay with Kuda</p>
                <p className="text-xs text-[var(--text-3)] mb-3">
                  Transfer from your Kuda account — zero fees, instant confirmation.
                </p>
                <a
                  href="https://www.kuda.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-[#4C1F7A] hover:bg-[#3D1862] text-white font-semibold text-sm transition-colors"
                >
                  <span>Open Kuda</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}

            {/* Cash on Delivery */}
            {paymentMethod === 'cash' && (
              <div className="mt-4 p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💵</span>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text)] mb-1">Pay when it arrives</p>
                    <p className="text-xs text-[var(--text-3)] leading-relaxed">
                      Have exact change ready. Our rider will collect payment at your door on delivery.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Order items ── */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5" style={{ boxShadow: 'var(--shadow-sm)' }}>
            <h2 className="font-bold text-[var(--text)] mb-3">Your order</h2>
            <div className="flex flex-col gap-2.5">
              {items.map((item) => (
                <div key={item.menuItemId} className="flex justify-between text-sm">
                  <span className="text-[var(--text-2)]">
                    <span className="font-semibold text-[var(--text)]">{item.quantity}×</span> {item.name}
                  </span>
                  <span className="font-semibold text-[var(--text)]">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Price summary ── */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5" style={{ boxShadow: 'var(--shadow-sm)' }}>
            <h2 className="font-bold text-[var(--text)] mb-4">Price summary</h2>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between text-[var(--text-2)]">
                <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[var(--text-2)]">
                <span>Delivery fee</span>
                {freeDelivery ? (
                  <span className="flex items-center gap-1.5">
                    <span className="line-through text-[var(--text-3)]">{formatPrice(BASE_DELIVERY_FEE)}</span>
                    <span className="font-bold text-[var(--gold)]">FREE</span>
                  </span>
                ) : (
                  <span>{formatPrice(DELIVERY_FEE)}</span>
                )}
              </div>
              <div className="flex justify-between text-[var(--text-2)]">
                <span>Service fee</span><span>₦0</span>
              </div>
              <div className="border-t border-[var(--border)] pt-3 flex justify-between font-black text-[var(--text)] text-base">
                <span>Total</span><span className="text-[var(--gold)]">{formatPrice(total)}</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400 font-medium">
              {error}
            </div>
          )}

          <button
            onClick={handlePlaceOrder}
            disabled={placing}
            className="w-full py-4 bg-[var(--gold)] hover:bg-[var(--gold-hover)] disabled:opacity-60 rounded-2xl text-base font-black text-[var(--gold-text)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            style={{ boxShadow: 'var(--shadow-gold)' }}
          >
            {placing
              ? <><Spinner className="w-5 h-5 text-[var(--gold-text)]" /> Placing your order...</>
              : `Place order — ${formatPrice(total)}`}
          </button>

          <p className="text-center text-xs text-[var(--text-3)]">
            By placing your order, you agree to our Terms &amp; Conditions
          </p>
        </div>
      </main>
    </>
  )
}
