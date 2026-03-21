import { apiRequest } from './client'
import type { Order, PlaceOrderRequest } from '../types/order'

export function placeOrder(data: PlaceOrderRequest): Promise<{ order: Order }> {
  return apiRequest('/api/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function getOrders(): Promise<{ orders: Order[] }> {
  return apiRequest('/api/orders')
}

export function getOrderById(id: string): Promise<{ order: Order }> {
  return apiRequest(`/api/orders/${id}`)
}

export function cancelOrder(id: string): Promise<{ order: Order }> {
  return apiRequest(`/api/orders/${id}`, {
    method: 'DELETE',
  })
}
