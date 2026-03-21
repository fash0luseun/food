import { NextRequest, NextResponse } from 'next/server'
import { restaurants } from '@/data/restaurants'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const restaurant = restaurants.find((r) => r.id === id)
  if (!restaurant) {
    return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 })
  }
  return NextResponse.json({ restaurant })
}
