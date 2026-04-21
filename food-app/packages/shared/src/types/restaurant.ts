export interface Restaurant {
  id: string
  name: string
  description: string
  cuisine: string
  rating: number
  reviewCount: number
  deliveryTime: string
  deliveryFee: number
  minimumOrder: number
  imageUrl: string
  isOpen: boolean
  address: string
  categories: string[]
}

export interface MenuItem {
  id: string
  restaurantId: string
  category: string
  name: string
  description: string
  price: number
  imageUrl: string
  isAvailable: boolean
  tribe?: string
}
