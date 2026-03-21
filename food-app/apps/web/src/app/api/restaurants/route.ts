import { NextResponse } from 'next/server'
import { restaurants } from '@/data/restaurants'

export function GET() {
  return NextResponse.json({ restaurants })
}
