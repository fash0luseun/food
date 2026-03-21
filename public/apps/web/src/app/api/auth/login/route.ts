import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { users } from '@/data/users'
import { signToken } from '@/lib/jwt'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
  }

  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
  if (!user) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }

  const token = signToken({ userId: user.id, email: user.email })
  return NextResponse.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt },
  })
}
