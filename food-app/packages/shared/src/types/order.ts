export type OrderStatus =
  | 'placed'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'

export interface OrderItem {
  menuItemId: string
  name: string
  price: number
  quantity: number
}

export interface Order {
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

export interface PlaceOrderRequest {
  restaurantId: string
  items: OrderItem[]
  deliveryFee: number
}
