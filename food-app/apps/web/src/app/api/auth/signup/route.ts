import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { users, getNextUserId, saveUsers } from '@/data/users'
import { signToken } from '@/lib/jwt'

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json()

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
  }
  if (password.length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
  }

  const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
  if (existing) {
    return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const newUser = {
    id: getNextUserId(),
    name,
    email: email.toLowerCase(),
    passwordHash,
    role: 'user' as const,
    createdAt: new Date().toISOString(),
  }
  users.push(newUser)
  saveUsers()

  const token = signToken({ userId: newUser.id, email: newUser.email })
  return NextResponse.json({
    token,
    user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, createdAt: newUser.createdAt },
  })
}
