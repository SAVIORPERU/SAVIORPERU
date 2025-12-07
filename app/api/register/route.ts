import { NextResponse } from 'next/server'

export async function GET() {
  console.log('API /api/users called')
  return NextResponse.json({ message: 'Hello from /api/users' })
}
