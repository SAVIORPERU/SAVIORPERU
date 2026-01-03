import React from 'react'
import OrdersList from './OrdersList'
import { currentUser } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

const OrdersPage = async () => {
  const clerkUser = await currentUser()
  const email = clerkUser?.emailAddresses[0]?.emailAddress

  if (!email) {
    return <div className='p-6'>Por favor, inicia sesión.</div>
  }

  try {
    // 1. Buscamos al usuario en la DB para obtener su ID numérico
    const dbUser = await prisma.user.findUnique({
      where: { email }
    })

    if (!dbUser) {
      return (
        <div className='p-6'>Usuario no encontrado en la base de datos.</div>
      )
    }

    // 2. Consultamos las órdenes directamente (Sin fetch a localhost)
    const rawOrders = await prisma.orders.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: 'desc' },
      include: {
        orderItems: {
          include: {
            producto: true
          }
        }
      }
    })

    // 3. ADAPTACIÓN ESTRICTA PARA OrdersList:
    // Convertimos los tipos de Prisma (Decimal/Date) a los tipos que espera tu componente (String)
    const formattedOrders = rawOrders.map((order) => ({
      ...order,
      createdAt: order.createdAt.toISOString(),
      totalPrice: order.totalPrice.toString(), // OrdersList espera string
      deliveryCost: order.deliveryCost.toString(),
      discount: order.discount.toString(),
      orderItems: order.orderItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        totalPrice: item.totalPrice.toString(),
        producto: {
          name: item.producto.name,
          price: item.producto.price.toString()
        }
      }))
    }))

    // 4. Estructura de paginación tal como la espera tu interface Pagination
    const pagination = {
      total: formattedOrders.length,
      page: 1,
      limit: 10,
      totalPages: Math.ceil(formattedOrders.length / 10) || 1
    }

    return (
      <div className='p-6'>
        <OrdersList orders={formattedOrders as any} pagination={pagination} />
      </div>
    )
  } catch (error) {
    console.error('Error en OrdersPage:', error)
    return <div className='p-6'>Error crítico al cargar órdenes.</div>
  }
}

export default OrdersPage
