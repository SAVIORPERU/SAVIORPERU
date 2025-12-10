import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const {
    address,
    agencia,
    clientName,
    clientPhone,
    deliveryCost,
    dni,
    getlocation,
    locationToSend,
    email,
    products,
    totalPrice,
    totalProducts,
    discount
  } = await req.json()

  try {
    const user = await prisma.user.findFirst({ where: { email } })

    if (!user) {
      return NextResponse.json(
        { message: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    const newOrder = await prisma.orders.create({
      data: {
        address,
        agencia,
        clientName,
        clientPhone,
        deliveryCost,
        dni,
        getlocation,
        locationToSend,
        userId: user.id,
        orderItems: {
          create: products.map(
            (p: {
              productoId: number
              quantity: number
              totalPrice: number
              unitPrice: number
            }) => ({
              productoId: p.productoId,
              quantity: p.quantity,
              totalPrice: p.totalPrice,
              unitPrice: p.unitPrice
            })
          )
        },
        totalPrice,
        totalProducts,
        discount
      },
      include: {
        orderItems: {
          include: {
            producto: true // 👈 para devolver también los datos del producto
          }
        }
      }
    })

    return NextResponse.json(
      { message: 'Orden creada', data: newOrder },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creando orden:', error)
    return NextResponse.json(
      { message: 'Error interno al crear orden' },
      { status: 500 }
    )
  }
}
