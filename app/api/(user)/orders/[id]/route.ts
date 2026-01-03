import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { message: 'ID de orden inválido' },
        { status: 400 }
      )
    }

    const order = await prisma.orders.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            dni: true
          }
        },
        orderItems: {
          include: {
            producto: {
              select: {
                id: true,
                name: true,
                price: true,
                image: true,
                category: true
              }
            }
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json(
        { message: 'Orden no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'Orden obtenida exitosamente',
      data: order
    })
  } catch (error) {
    console.error('Error obteniendo orden:', error)
    return NextResponse.json(
      { message: 'Error interno al obtener orden' },
      { status: 500 }
    )
  }
}

// Esquema de validación para actualizar orden
const updateOrderSchema = z.object({
  status: z
    .enum(['Pendiente', 'Completado', 'Entregado', 'Cancelado'])
    .optional(),
  address: z.string().optional(),
  agencia: z.string().optional(),
  clientPhone: z.string().optional(),
  deliveryCost: z.number().min(0).optional(),
  discount: z.number().min(0).max(100).optional()
  // Puedes agregar más campos según necesites
})

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { message: 'ID de orden inválido' },
        { status: 400 }
      )
    }

    // Verificar si la orden existe
    const existingOrder = await prisma.orders.findUnique({
      where: { id }
    })

    if (!existingOrder) {
      return NextResponse.json(
        { message: 'Orden no encontrada' },
        { status: 404 }
      )
    }

    // Obtener y validar datos
    const body = await req.json()
    const validatedData = updateOrderSchema.parse(body)

    // Actualizar la orden
    const updatedOrder = await prisma.orders.update({
      where: { id },
      data: validatedData,
      include: {
        orderItems: {
          include: {
            producto: true
          }
        }
      }
    })

    // Si el estado cambia a Completado/Entregado, podrías:
    // - Enviar email de confirmación
    // - Actualizar inventario
    // - Registrar en historial

    return NextResponse.json({
      message: 'Orden actualizada exitosamente',
      data: updatedOrder
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Datos inválidos', errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Error actualizando orden:', error)
    return NextResponse.json(
      { message: 'Error interno al actualizar orden' },
      { status: 500 }
    )
  }
}
