import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth-middleware'
import { orders, getNextOrderId } from '@/data/orders'
import { restaurants } from '@/data/restaurants'
import type { Order } from '@food-app/shared'

export const GET = withAuth(async (_req: NextRequest, userId: string) => {
  const userOrders = orders.filter((o) => o.userId === userId)
  return NextResponse.json({ orders: userOrders.reverse() })
})

export const POST = withAuth(async (req: NextRequest, userId: string) => {
  const { restaurantId, items, deliveryFee } = await req.json()

  if (!restaurantId || !items || items.length === 0) {
    return NextResponse.json({ error: 'restaurantId and items are required' }, { status: 400 })
  }

  const restaurant = restaurants.find((r) => r.id === restaurantId)
  if (!restaurant) {
    return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 })
  }

  const subtotal = items.reduce(
    (sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity,
    0
  )
  const fee = deliveryFee ?? restaurant.deliveryFee
  const total = subtotal + fee

  const order: Order = {
    id: getNextOrderId(),
    userId,
    restaurantId,
    restaurantName: restaurant.name,
    items,
    subtotal: Math.round(subtotal * 100) / 100,
    deliveryFee: fee,
    total: Math.round(total * 100) / 100,
    status: 'placed',
    placedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    estimatedDelivery: new Date(Date.now() + 35 * 60 * 1000).toISOString(),
  }

  orders.push(order)
  return NextResponse.json({ order }, { status: 201 })
})
