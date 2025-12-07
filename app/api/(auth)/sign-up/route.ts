import { currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const user = await currentUser()
  console.log(
    'API /api/hello called, current user:',
    user?.firstName,
    user?.lastName,
    user?.emailAddresses,
    user?.id
  )
  // Obtener información (ej: lista de usuarios)
  return NextResponse.redirect(new URL('/', req.url))
}
