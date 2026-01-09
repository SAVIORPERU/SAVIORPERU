import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { categoriesData } from './categories'

const createCategoriesSchema = z
  .object({
    name: z.string().min(1, 'El nombre es requerido')
  })
  .strip()

export async function POST(req: NextRequest) {
  const body = await req.json()

  // Caso 1: No se envía name → crear categorías por defecto
  if (!body.name) {
    const categories = await prisma.categories.createMany({
      data: categoriesData
    })

    return NextResponse.json(
      {
        message: 'Categorías creadas exitosamente',
        data: categories
      },
      { status: 201 }
    )
  }

  // Caso 2: Se envía name → validar y crear una categoría
  const validateData = createCategoriesSchema.parse(body)

  await prisma.categories.create({
    data: {
      name: validateData.name
    }
  })

  return NextResponse.json(
    {
      message: 'Nueva categoría creada' // ✅ arreglado typo
    },
    { status: 201 }
  )
}
