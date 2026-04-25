import { NextRequest, NextResponse } from 'next/server'

// All routes that require authentication (client-side guard handles actual redirect)
const PUBLIC_PATHS = ['/login', '/signup', '/api']

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p))
  if (isPublic) return NextResponse.next()
  // All other routes are protected — actual enforcement is done client-side via AuthContext
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
