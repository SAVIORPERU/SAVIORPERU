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

export async function GET(req: NextRequest) {
  try {
    // 🔹 Leer parámetros de query
    const { searchParams } = new URL(req.url)

    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)

    // Filtros opcionales
    const status = searchParams.get('status') // ejemplo: "Pendiente", "Completado"
    const clientName = searchParams.get('clientName')
    const email = searchParams.get('email')
    console.log('email to response ==>', email)
    const minTotal = searchParams.get('minTotal')
    const maxTotal = searchParams.get('maxTotal')

    // 🔹 Construir objeto where dinámico
    const where: any = {}

    if (status) {
      where.status = status
    }

    if (clientName) {
      where.clientName = { contains: clientName, mode: 'insensitive' }
    }

    if (email) {
      where.user = { email: { contains: email, mode: 'insensitive' } }
    }

    if (minTotal || maxTotal) {
      where.totalPrice = {}
      if (minTotal) where.totalPrice.gte = parseFloat(minTotal)
      if (maxTotal) where.totalPrice.lte = parseFloat(maxTotal)
    }

    // 🔹 Calcular skip y take para paginación
    const skip = (page - 1) * limit
    const take = limit

    // 🔹 Consultar órdenes con Prisma
    const [orders, total] = await Promise.all([
      prisma.orders.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          user: true,
          orderItems: {
            include: {
              producto: true
            }
          }
        }
      }),
      prisma.orders.count({ where })
    ])

    return NextResponse.json({
      data: orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error obteniendo órdenes:', error)
    return NextResponse.json(
      { message: 'Error interno al obtener órdenes' },
      { status: 500 }
    )
  }
}
