import { apiRequest } from './client'
import type { Restaurant, MenuItem } from '../types/restaurant'

export function getRestaurants(): Promise<{ restaurants: Restaurant[] }> {
  return apiRequest('/api/restaurants')
}

export function getRestaurantById(id: string): Promise<{ restaurant: Restaurant }> {
  return apiRequest(`/api/restaurants/${id}`)
}

export function getMenuByRestaurant(
  restaurantId: string
): Promise<{ categories: string[]; items: MenuItem[] }> {
  return apiRequest(`/api/restaurants/${restaurantId}/menu`)
}
