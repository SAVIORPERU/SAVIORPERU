import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Esquema de validación
const updateCuponSchema = z.object({
  codigoCupon: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[a-zA-Z0-9-_]+$/)
    .optional(),
  mostrarCupon: z.boolean().optional()
})

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { message: 'ID de cupón inválido' },
        { status: 400 }
      )
    }

    // Verificar si el cupón existe
    const existingCupon = await prisma.cupon.findUnique({
      where: { id }
    })

    if (!existingCupon) {
      return NextResponse.json(
        { message: 'Cupón no encontrado' },
        { status: 404 }
      )
    }

    // Obtener y validar datos
    const body = await req.json()
    const validatedData = updateCuponSchema.parse(body)

    // Verificar duplicado de código (si se está actualizando el código)
    if (
      validatedData.codigoCupon &&
      validatedData.codigoCupon !== existingCupon.codigoCupon
    ) {
      const duplicate = await prisma.cupon.findFirst({
        where: {
          codigoCupon: {
            equals: validatedData.codigoCupon,
            mode: 'insensitive'
          },
          NOT: { id }
        }
      })

      if (duplicate) {
        return NextResponse.json(
          { message: 'Ya existe otro cupón con ese código' },
          { status: 409 }
        )
      }
    }

    // Actualizar cupón
    const updatedCupon = await prisma.cupon.update({
      where: { id },
      data: {
        codigoCupon: validatedData.codigoCupon,
        mostrarCupon: validatedData.mostrarCupon,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      message: 'Cupón actualizado exitosamente',
      data: updatedCupon
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Datos inválidos', errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Error actualizando cupón:', error)
    return NextResponse.json(
      { message: 'Error interno al actualizar cupón' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { message: 'ID de cupón inválido' },
        { status: 400 }
      )
    }

    // Verificar si el cupón existe
    const existingCupon = await prisma.cupon.findUnique({
      where: { id }
    })

    if (!existingCupon) {
      return NextResponse.json(
        { message: 'Cupón no encontrado' },
        { status: 404 }
      )
    }

    // Eliminar cupón
    await prisma.cupon.delete({
      where: { id }
    })

    return NextResponse.json({
      message: 'Cupón eliminado exitosamente',
      deletedId: id,
      deletedCode: existingCupon.codigoCupon
    })
  } catch (error) {
    console.error('Error eliminando cupón:', error)
    return NextResponse.json(
      { message: 'Error interno al eliminar cupón' },
      { status: 500 }
    )
  }
}
