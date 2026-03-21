import type { Order } from '@food-app/shared'

// In-memory order store — mutable (POST /api/orders pushes here)
export const orders: Order[] = [
  {
    id: 'o1',
    userId: 'u1',
    restaurantId: 'r1',
    restaurantName: 'Burger Palace',
    items: [
      { menuItemId: 'm1', name: 'Classic Cheeseburger', price: 9.99, quantity: 2 },
      { menuItemId: 'm4', name: 'Crispy Fries', price: 3.99, quantity: 1 },
    ],
    subtotal: 23.97,
    deliveryFee: 1.99,
    total: 25.96,
    status: 'delivered',
    placedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
    estimatedDelivery: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 25 * 60 * 1000).toISOString(),
  },
]

let nextOrderId = 2

export function getNextOrderId(): string {
  return `o${nextOrderId++}`
}
