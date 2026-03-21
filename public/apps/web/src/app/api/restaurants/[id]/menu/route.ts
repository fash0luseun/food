import { NextRequest, NextResponse } from 'next/server'
import { restaurants } from '@/data/restaurants'
import { menuItems } from '@/data/menu-items'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const restaurant = restaurants.find((r) => r.id === id)
  if (!restaurant) {
    return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 })
  }

  const items = menuItems.filter((m) => m.restaurantId === id)
  const categories = restaurant.categories.filter((cat) =>
    items.some((item) => item.category === cat)
  )

  return NextResponse.json({ categories, items })
}
