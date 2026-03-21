import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth-middleware'
import { users } from '@/data/users'

export const GET = withAuth(async (_req: NextRequest, userId: string) => {
  const user = users.find((u) => u.id === userId)
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }
  return NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt },
  })
})
