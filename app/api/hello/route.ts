import { currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const user = await currentUser()
  console.log('API /api/hello called, current user:', user)
  return NextResponse.json(
    { message: 'Hello from API', timestamp: new Date().toISOString() },
    { status: 200 }
  )
}
