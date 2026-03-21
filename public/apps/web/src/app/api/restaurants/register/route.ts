import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth-middleware'
import { submissions, getNextSubmissionId } from '@/data/restaurant-submissions'
import { users } from '@/data/users'

export const POST = withAuth(async (req: NextRequest, userId: string) => {
  const user = users.find((u) => u.id === userId)
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const body = await req.json()
  const { ownerName, ownerPhone, name, description, cuisine, address, categories, imageUrl } = body

  if (!name || !description || !cuisine || !address || !ownerName || !ownerPhone) {
    return NextResponse.json({ error: 'All required fields must be filled' }, { status: 400 })
  }

  // Prevent duplicate pending submissions from same user for same restaurant name
  const existing = submissions.find(
    (s) => s.submittedBy === userId && s.name.toLowerCase() === name.toLowerCase() && s.status === 'pending'
  )
  if (existing) {
    return NextResponse.json({ error: 'You already have a pending submission for this restaurant' }, { status: 409 })
  }

  const submission = {
    id: getNextSubmissionId(),
    submittedBy: userId,
    ownerName,
    ownerEmail: user.email,
    ownerPhone,
    name,
    description,
    cuisine,
    address,
    categories: Array.isArray(categories) ? categories : [],
    imageUrl: imageUrl ?? '',
    status: 'pending' as const,
    adminNote: '',
    submittedAt: new Date().toISOString(),
    reviewedAt: null,
  }

  submissions.push(submission)
  return NextResponse.json({ submission }, { status: 201 })
})
