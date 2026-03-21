import { NextRequest, NextResponse } from 'next/server'
import { withAdmin } from '@/lib/auth-middleware'
import { submissions } from '@/data/restaurant-submissions'

export const GET = withAdmin(async (_req: NextRequest) => {
  const sorted = [...submissions].sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  )
  return NextResponse.json({ submissions: sorted })
})
