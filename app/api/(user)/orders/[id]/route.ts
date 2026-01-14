import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Esquema de validación para actualizar orden
const updateOrderSchema = z.object({
  status: z
    .enum(['Pendiente', 'Pagado', 'Enviado', 'Entregado', 'Cancelado'])
    .optional(),
  address: z.string().optional(),
  agencia: z.string().optional(),
  clientPhone: z.string().optional(),
  deliveryCost: z.number().min(0).optional(),
  discount: z.number().min(0).max(100).optional()
})

// GET: Obtener detalle de una orden
// 1. GET: Obtener detalle
// 1. GET: Obtener detalle
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Cambiado a Promise
) {
  try {
    const { id: idParam } = await params // Esperamos los params
    const id = parseInt(idParam)

    if (isNaN(id))
      return NextResponse.json({ message: 'ID inválido' }, { status: 400 })

    const order = await prisma.orders.findUnique({
      where: { id },
      include: {
        user: true,
        orderItems: { include: { producto: true } }
      }
    })

    if (!order)
      return NextResponse.json(
        { message: 'Orden no encontrada' },
        { status: 404 }
      )

    return NextResponse.json({ data: order })
  } catch (error) {
    return NextResponse.json({ message: 'Error interno' }, { status: 500 })
  }
}

// 2. PUT: Actualizar orden
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Cambiado a Promise
) {
  try {
    const { id: idParam } = await params // Esperamos los params
    const id = parseInt(idParam)

    if (isNaN(id))
      return NextResponse.json({ message: 'ID inválido' }, { status: 400 })

    const body = await req.json()
    const validatedData = updateOrderSchema.parse(body)

    const updatedOrder = await prisma.orders.update({
      where: { id },
      data: validatedData,
      include: { orderItems: { include: { producto: true } } }
    })

    return NextResponse.json({ message: 'Actualizado', data: updatedOrder })
  } catch (error) {
    if (error instanceof z.ZodError)
      return NextResponse.json({ errors: error.errors }, { status: 400 })
    return NextResponse.json(
      { message: 'Error al actualizar' },
      { status: 500 }
    )
  }
}

// 3. DELETE: Eliminar orden
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Cambiado a Promise
) {
  try {
    const { id: idParam } = await params // Esperamos los params
    const id = parseInt(idParam)

    if (isNaN(id))
      return NextResponse.json({ message: 'ID inválido' }, { status: 400 })

    await prisma.orders.delete({ where: { id } })

    return NextResponse.json({ message: 'Orden eliminada correctamente' })
  } catch (error) {
    return NextResponse.json({ message: 'Error al eliminar' }, { status: 500 })
  }
}
