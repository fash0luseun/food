import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth-middleware'
import { orders } from '@/data/orders'
import type { OrderStatus } from '@food-app/shared'

function deriveStatus(placedAt: string, storedStatus: OrderStatus): OrderStatus {
  // Already terminal
  if (storedStatus === 'delivered' || storedStatus === 'cancelled') {
    return storedStatus
  }
  const elapsed = Date.now() - new Date(placedAt).getTime()
  if (elapsed < 30_000) return 'placed'
  if (elapsed < 90_000) return 'preparing'
  if (elapsed < 150_000) return 'out_for_delivery'
  return 'delivered'
}

export const GET = withAuth(async (req: NextRequest, userId: string) => {
  const url = new URL(req.url)
  const id = url.pathname.split('/').at(-1)!

  const order = orders.find((o) => o.id === id)
  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }
  if (order.userId !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const liveStatus = deriveStatus(order.placedAt, order.status)
  return NextResponse.json({ order: { ...order, status: liveStatus } })
})

// allow the user to cancel their order if it hasn't already finished
export const DELETE = withAuth(async (req: NextRequest, userId: string) => {
  const url = new URL(req.url)
  const id = url.pathname.split('/').at(-1)!

  const order = orders.find((o) => o.id === id)
  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }
  if (order.userId !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // can't cancel an order that's already delivered or already cancelled
  if (order.status === 'delivered' || order.status === 'cancelled') {
    return NextResponse.json(
      { error: 'Cannot cancel order' },
      { status: 400 }
    )
  }

  order.status = 'cancelled'
  order.updatedAt = new Date().toISOString()

  return NextResponse.json({ order })
})
