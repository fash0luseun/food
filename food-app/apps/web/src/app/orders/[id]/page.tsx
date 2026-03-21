'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import type { Order, OrderStatus } from '@food-app/shared'
import { cancelOrder } from '@food-app/shared'
import { useAuth } from '@/context/AuthContext'
import { Navbar } from '@/components/layout/Navbar'
import { Spinner } from '@/components/ui/Spinner'
import { formatPrice, formatDate } from '@/lib/utils'

const STEPS: { status: OrderStatus; label: string; icon: string }[] = [
  { status: 'placed',           label: 'Order Placed',    icon: '✅' },
  { status: 'preparing',        label: 'Preparing',       icon: '👨‍🍳' },
  { status: 'out_for_delivery', label: 'On the way',      icon: '🛵' },
  { status: 'delivered',        label: 'Delivered',       icon: '🎉' },
]

const STATUS_COLOR: Record<string, string> = {
  placed:           'text-blue-500  bg-blue-500/10  border-blue-500/30',
  preparing:        'text-[var(--gold)] bg-[var(--gold-bg)] border-[var(--gold-border)]',
  out_for_delivery: 'text-blue-500  bg-blue-500/10  border-blue-500/30',
  delivered:        'text-green-600 bg-green-500/10 border-green-500/30',
  cancelled:        'text-red-500   bg-red-500/10   border-red-500/30',
}

function getStepIndex(status: OrderStatus) {
  return STEPS.findIndex((s) => s.status === status)
}

export default function OrderTrackingPage() {
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated, isLoading, token } = useAuth()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchOrder = useCallback(async () => {
    const res = await fetch(`/api/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    if (data.order) setOrder(data.order)
  }, [id, token])

  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated) { router.replace('/login'); return }
    fetchOrder().finally(() => setLoading(false))
  }, [isAuthenticated, isLoading, fetchOrder, router])

  useEffect(() => {
    if (!order || order.status === 'delivered' || order.status === 'cancelled') return
    const interval = setInterval(fetchOrder, 5000)
    return () => clearInterval(interval)
  }, [order, fetchOrder])

  if (isLoading || loading) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Spinner className="h-8 w-8 text-[var(--gold)]" />
          <p className="text-sm text-[var(--text-3)]">Loading your order...</p>
        </div>
      </>
    )
  }

  if (!order) {
    return (
      <>
        <Navbar />
        <div className="py-20 text-center text-[var(--text-3)]">Order not found.</div>
      </>
    )
  }

  const stepIndex = getStepIndex(order.status as OrderStatus)
  const statusColorClass = STATUS_COLOR[order.status] ?? STATUS_COLOR['placed']

  const canCancel = ['placed', 'preparing', 'out_for_delivery'].includes(order.status)
  const handleCancel = async () => {
    if (!order) return
    if (!confirm('Are you sure you want to cancel this order?')) return
    try {
      const res = await cancelOrder(order.id)
      if (res.order) {
        setOrder(res.order)
      }
    } catch (err) {
      console.error(err)
      alert('Failed to cancel order')
    }
  }

  return (
    <>
      <Navbar />
      <main className="relative z-10 mx-auto max-w-2xl px-4 py-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-[var(--text)]">Order Tracking</h1>
            <p className="text-sm text-[var(--text-3)] mt-0.5">#{order.id} · {order.restaurantName}</p>
          </div>
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border ${statusColorClass}`}>
            {STEPS.find((s) => s.status === order.status)?.label ?? order.status}
          </span>
        </div>

        {/* Progress stepper */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 mb-4" style={{ boxShadow: 'var(--shadow-sm)' }}>

          {/* Step circles + connector lines */}
          <div className="flex items-center">
            {STEPS.map((step, i) => {
              const done   = i <= stepIndex
              const active = i === stepIndex
              return (
                <div key={step.status} className="flex items-center flex-1 last:flex-none">
                  {/* Circle */}
                  <div className="flex flex-col items-center shrink-0">
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center text-xl border-2 transition-all ${
                        active
                          ? 'border-[var(--gold)] bg-[var(--gold-bg)] ring-4 ring-[var(--gold)]/20'
                          : done
                          ? 'border-[var(--gold)] bg-[var(--gold-bg)]'
                          : 'border-[var(--border)] bg-[var(--surface-2)]'
                      }`}
                    >
                      {step.icon}
                    </div>
                  </div>
                  {/* Connector */}
                  {i < STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-1 rounded-full transition-colors ${
                      i < stepIndex ? 'bg-[var(--gold)]' : 'bg-[var(--border)]'
                    }`} />
                  )}
                </div>
              )
            })}
          </div>

          {/* Labels row — separate from circles so they don't crowd the connector */}
          <div className="flex mt-3">
            {STEPS.map((step, i) => {
              const done = i <= stepIndex
              return (
                <div key={step.status} className="flex-1 flex flex-col items-center px-1">
                  <span className={`text-[11px] font-semibold text-center leading-tight ${
                    done ? 'text-[var(--gold)]' : 'text-[var(--text-3)]'
                  }`}>
                    {step.label}
                  </span>
                </div>
              )
            })}
          </div>

          {/* ETA / delivered message */}
          <div className="mt-5 pt-4 border-t border-[var(--border)] text-center">
            {order.status === 'delivered' ? (
              <p className="text-sm font-bold text-green-600 dark:text-green-400">
                🎉 Your order has been delivered!
              </p>
            ) : order.status === 'cancelled' ? (
              <p className="text-sm font-bold text-red-500">Order was cancelled.</p>
            ) : (
              <p className="text-sm text-[var(--text-3)]">
                Estimated delivery: <span className="font-semibold text-[var(--text)]">{formatDate(order.estimatedDelivery)}</span>
              </p>
            )}
          </div>
        </div>

        {/* Order items */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 mb-4" style={{ boxShadow: 'var(--shadow-sm)' }}>
          <h2 className="font-bold text-[var(--text)] mb-3">Items</h2>
          <div className="flex flex-col gap-2 text-sm">
            {order.items.map((item) => (
              <div key={item.menuItemId} className="flex justify-between text-[var(--text-2)]">
                <span><span className="font-semibold text-[var(--text)]">{item.quantity}×</span> {item.name}</span>
                <span className="font-semibold text-[var(--text)]">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="border-t border-[var(--border)] mt-2 pt-3 flex flex-col gap-2 text-sm text-[var(--text-2)]">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
              <div className="flex justify-between"><span>Delivery</span><span>{formatPrice(order.deliveryFee)}</span></div>
              <div className="flex justify-between font-black text-[var(--text)] text-base pt-1">
                <span>Total</span><span className="text-[var(--gold)]">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-[var(--text-3)] text-center mb-6">
          Placed {formatDate(order.placedAt)}
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => router.push('/orders')}
            className="flex-1 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)] text-sm font-semibold text-[var(--text)] transition-colors"
          >
            All Orders
          </button>
          {canCancel && (
            <button
              onClick={handleCancel}
              className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-sm font-bold text-white transition-colors"
            >
              Cancel Order
            </button>
          )}
          <button
            onClick={() => router.push('/restaurants')}
            className="flex-1 py-3 rounded-xl bg-[var(--gold)] hover:bg-[var(--gold-hover)] text-sm font-bold text-[var(--gold-text)] transition-colors"
            style={{ boxShadow: 'var(--shadow-gold)' }}
          >
            Order Again
          </button>
        </div>
      </main>
    </>
  )
}
