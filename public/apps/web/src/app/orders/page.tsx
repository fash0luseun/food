'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Navbar } from '@/components/layout/Navbar'
import { Spinner } from '@/components/ui/Spinner'
import { formatPrice, formatDate } from '@/lib/utils'

type OrderStatus = 'placed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled'

interface OrderItem {
  menuItemId: string
  name: string
  price: number
  quantity: number
}

interface Order {
  id: string
  userId: string
  restaurantId: string
  restaurantName: string
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  total: number
  status: OrderStatus
  placedAt: string
  updatedAt: string
  estimatedDelivery: string
}

const STATUS_LABELS: Record<string, string> = {
  placed: 'Order Placed',
  preparing: 'Preparing',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

const STATUS_COLORS: Record<string, string> = {
  placed:           'bg-blue-500/15 text-blue-400 border border-blue-500/25',
  preparing:        'bg-amber-500/15 text-amber-400 border border-amber-500/25',
  out_for_delivery: 'bg-[var(--gold-bg)] text-[var(--gold)] border border-[var(--gold-border)]',
  delivered:        'bg-[var(--gold-bg)] text-[var(--gold)] border border-[var(--gold-border)]',
  cancelled:        'bg-red-500/15 text-red-400 border border-red-500/25',
}

const STATUS_ICONS: Record<string, string> = {
  placed:           '📋',
  preparing:        '👨‍🍳',
  out_for_delivery: '🛵',
  delivered:        '✅',
  cancelled:        '❌',
}

type TabKey = 'active' | 'completed' | 'cancelled'

const TABS: { key: TabKey; label: string; statuses: string[] }[] = [
  { key: 'active',    label: 'Active',    statuses: ['placed', 'preparing', 'out_for_delivery'] },
  { key: 'completed', label: 'Completed', statuses: ['delivered'] },
  { key: 'cancelled', label: 'Cancelled', statuses: ['cancelled'] },
]

async function cancelOrderRequest(id: string, token: string | null): Promise<{ order: Order }> {
  const res = await fetch(`/api/orders/${id}`, {
    method: 'DELETE',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  if (!res.ok) throw new Error('Cancel failed')
  return res.json()
}

export default function OrdersPage() {
  const { isAuthenticated, isLoading, token } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabKey>('active')

  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated) { router.replace('/login'); return }
    fetch('/api/orders', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => setOrders(data.orders ?? []))
      .finally(() => setLoading(false))
  }, [isAuthenticated, isLoading, token, router])

  if (isLoading || loading) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Spinner className="h-8 w-8 text-[var(--gold)]" />
          <p className="text-sm text-[var(--text-3)]">Loading your orders...</p>
        </div>
      </>
    )
  }

  const currentTab = TABS.find((t) => t.key === activeTab)!
  const filtered = orders.filter((o) => currentTab.statuses.includes(o.status))

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/" className="flex items-center justify-center w-9 h-9 bg-[var(--surface)] border border-[var(--border)] rounded-xl hover:border-[var(--gold)]/50 transition-colors">
            <svg className="w-4 h-4 text-[var(--text)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-black text-[var(--text)]">My Orders</h1>
            <p className="text-xs text-[var(--text-3)] mt-0.5">{orders.length} total order{orders.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-1 mb-6" style={{ boxShadow: 'var(--shadow-sm)' }}>
          {TABS.map((tab) => {
            const count = orders.filter((o) => tab.statuses.includes(o.status)).length
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab.key
                    ? 'bg-[var(--gold)] text-[var(--gold-text)]'
                    : 'text-[var(--text-2)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]'
                }`}
              >
                {tab.label}
                {count > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-black ${
                    activeTab === tab.key
                      ? 'bg-white/25 text-white'
                      : 'bg-[var(--gold-bg)] text-[var(--gold)]'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Orders list */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-20 h-20 mx-auto bg-[var(--surface)] border border-[var(--border)] rounded-2xl flex items-center justify-center mb-4">
              <span className="text-4xl">
                {activeTab === 'active' ? '🛵' : activeTab === 'completed' ? '✅' : '❌'}
              </span>
            </div>
            <p className="font-bold text-[var(--text)]">No {activeTab} orders</p>
            <p className="text-sm text-[var(--text-3)] mt-1">
              {activeTab === 'active' ? 'You have no active orders right now' : `No ${activeTab} orders yet`}
            </p>
            {activeTab === 'active' && (
              <button
                onClick={() => router.push('/restaurants')}
                className="mt-6 px-8 py-3 bg-[var(--gold)] hover:bg-[var(--gold-hover)] rounded-2xl text-sm font-black text-[var(--gold-text)] transition-colors"
                style={{ boxShadow: 'var(--shadow-gold)' }}
              >
                Order Now
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((order) => (
              <Link key={order.id} href={`/orders/${order.id}`}>
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 hover:border-[var(--gold)]/50 hover:bg-[var(--surface-2)] transition-all group" style={{ boxShadow: 'var(--shadow-sm)' }}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className="w-12 h-12 bg-[var(--gold-bg)] border border-[var(--gold-border)] rounded-xl flex items-center justify-center text-xl shrink-0">
                        {STATUS_ICONS[order.status]}
                      </div>
                      <div>
                        <h3 className="font-bold text-[var(--text)] group-hover:text-[var(--gold)] transition-colors">
                          {order.restaurantName}
                        </h3>
                        <p className="mt-0.5 text-sm text-[var(--text-3)] line-clamp-1">
                          {order.items.map((i) => `${i.name} ×${i.quantity}`).join(', ')}
                        </p>
                        <p className="mt-1 text-xs text-[var(--text-3)]">{formatDate(order.placedAt)}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${STATUS_COLORS[order.status]}`}>
                        {STATUS_LABELS[order.status]}
                      </span>
                      <span className="text-sm font-black text-[var(--text)]">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar for active orders */}
                  {['placed', 'preparing', 'out_for_delivery'].includes(order.status) && (
                    <div className="mt-3 pt-3 border-t border-[var(--border-subtle)]">
                      <div className="flex items-center gap-2 text-xs text-[var(--text-3)]">
                        {['placed', 'preparing', 'out_for_delivery'].map((s, i) => {
                          const idx = ['placed', 'preparing', 'out_for_delivery'].indexOf(order.status)
                          const done = i <= idx
                          return (
                            <div key={s} className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${done ? 'bg-[var(--gold)]' : 'bg-[var(--border)]'}`} />
                              <span className={done ? 'text-[var(--gold)] font-semibold' : ''}>{STATUS_LABELS[s]}</span>
                              {i < 2 && <div className={`flex-1 h-px w-6 ${done && i < idx ? 'bg-[var(--gold)]' : 'bg-[var(--border)]'}`} />}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                  {['placed', 'preparing', 'out_for_delivery'].includes(order.status) && (
                    <button
                      onClick={async (e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        if (!confirm('Cancel order?')) return
                        try {
                          const res = await cancelOrderRequest(order.id, token)
                          if (res.order) {
                            setOrders((prev) => prev.map((o) => (o.id === order.id ? res.order : o)))
                          }
                        } catch (err) {
                          console.error(err)
                          alert('Unable to cancel')
                        }
                      }}
                      className="mt-2 px-3 py-1 text-xs font-semibold rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                    >
                      Cancel
                    </button>
                  )}                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
