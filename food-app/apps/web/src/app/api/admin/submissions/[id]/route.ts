import { NextRequest, NextResponse } from 'next/server'
import { withAdmin } from '@/lib/auth-middleware'
import { submissions } from '@/data/restaurant-submissions'
import { restaurants } from '@/data/restaurants'
import type { Restaurant } from '@food-app/shared'

let nextRestaurantId = 5

export const PATCH = withAdmin(async (req: NextRequest) => {
  const url = new URL(req.url)
  const id = url.pathname.split('/').at(-1)!

  const submission = submissions.find((s) => s.id === id)
  if (!submission) {
    return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
  }
  if (submission.status !== 'pending') {
    return NextResponse.json({ error: 'Submission has already been reviewed' }, { status: 409 })
  }

  const { action, adminNote } = await req.json()
  if (action !== 'approve' && action !== 'reject') {
    return NextResponse.json({ error: 'action must be "approve" or "reject"' }, { status: 400 })
  }

  submission.status = action === 'approve' ? 'approved' : 'rejected'
  submission.adminNote = adminNote ?? ''
  submission.reviewedAt = new Date().toISOString()

  if (action === 'approve') {
    const newRestaurant: Restaurant = {
      id: `r${nextRestaurantId++}`,
      name: submission.name,
      description: submission.description,
      cuisine: submission.cuisine,
      rating: 0,
      reviewCount: 0,
      deliveryTime: '30–50 min',
      deliveryFee: 1.99,
      minimumOrder: 10,
      imageUrl: submission.imageUrl || 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80',
      isOpen: true,
      address: submission.address,
      categories: submission.categories.length > 0 ? submission.categories : ['General'],
    }
    restaurants.push(newRestaurant)
  }

  return NextResponse.json({ submission })
})
