// lib/admin.ts (solo si usas Server Actions o direct DB access)
import prisma from './prisma'

export async function getIsAdmin(userId: string): Promise<boolean> {
  try {
    console.log('Checking admin for userId:', userId)
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { role: true }
    })
    console.log('Found user:', user)

    // Si no existe usuario, no es admin
    if (!user) return false

    return user.role === 'ADMIN'
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}
