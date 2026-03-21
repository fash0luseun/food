
import bcrypt from 'bcryptjs'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

export type UserRole = 'user' | 'admin'

export interface StoredUser {
  id: string
  name: string
  email: string
  passwordHash: string
  role: UserRole
  createdAt: string
}

// Admin credentials: admin@dandd.ng / Admin@DD2025
const ADMIN_HASH = bcrypt.hashSync('Admin@DD2025', 10)

const SEED_USERS: StoredUser[] = [
  {
    id: 'u0',
    name: 'D&D Owner',
    email: 'admin@dandd.ng',
    passwordHash: ADMIN_HASH,
    role: 'admin',
    createdAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'u1',
    name: 'Demo User',
    email: 'demo@example.com',
    // bcryptjs hash of "password123"
    passwordHash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    role: 'user',
    createdAt: '2024-01-01T00:00:00.000Z',
  },
]

const DATA_DIR = join(process.cwd(), 'data')
const USERS_FILE = join(DATA_DIR, 'users.json')

function loadUsers(): StoredUser[] {
  try {
    if (existsSync(USERS_FILE)) {
      const raw = readFileSync(USERS_FILE, 'utf-8')
      const parsed = JSON.parse(raw) as StoredUser[]
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {
    // fall through to seed data
  }
  return [...SEED_USERS]
}

export const users: StoredUser[] = loadUsers()

export function saveUsers(): void {
  try {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })
    writeFileSync(USERS_FILE, JSON.stringify(users, null, 2))
  } catch (err) {
    console.error('Failed to save users:', err)
  }
}

export function getNextUserId(): string {
  const maxNum = users.reduce((max, u) => {
    const n = parseInt(u.id.replace('u', ''), 10)
    return isNaN(n) ? max : Math.max(max, n)
  }, -1)
  return `u${maxNum + 1}`
}
