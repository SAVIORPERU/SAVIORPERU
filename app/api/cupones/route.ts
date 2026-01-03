import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '20', 10)
    const search = searchParams.get('search') || ''
    const mostrarCupon = searchParams.get('mostrarCupon')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Construir filtros
    const where: any = {}

    if (search) {
      where.codigoCupon = { contains: search, mode: 'insensitive' }
    }

    if (mostrarCupon !== null) {
      where.mostrarCupon = mostrarCupon === 'true'
    }

    // Ordenamiento
    const orderBy: any = {}
    if (sortBy === 'codigo') {
      orderBy.codigoCupon = sortOrder
    } else if (sortBy === 'mostrar') {
      orderBy.mostrarCupon = sortOrder
    } else if (sortBy === 'createdAt') {
      orderBy.createdAt = sortOrder
    } else if (sortBy === 'updatedAt') {
      orderBy.updatedAt = sortOrder
    } else {
      orderBy.createdAt = 'desc'
    }

    // Paginación
    const skip = (page - 1) * limit
    const take = limit

    // Obtener cupones
    const [cupones, total] = await Promise.all([
      prisma.cupon.findMany({
        where,
        skip,
        take,
        orderBy,
        select: {
          id: true,
          codigoCupon: true,
          mostrarCupon: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      prisma.cupon.count({ where })
    ])

    // Calcular estadísticas
    const stats = {
      totalCupones: total,
      activos: await prisma.cupon.count({
        where: { ...where, mostrarCupon: true }
      }),
      inactivos: await prisma.cupon.count({
        where: { ...where, mostrarCupon: false }
      })
      // Aquí podrías agregar estadísticas de uso si tuvieras una tabla de uso de cupones
      // usosTotales: await contarUsosDeCupones(),
      // usosUltimoMes: await contarUsosUltimoMes()
    }

    return NextResponse.json({
      message: 'Cupones obtenidos exitosamente',
      data: {
        cupones,
        stats
      },
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      filters: {
        search,
        mostrarCupon,
        sortBy,
        sortOrder
      }
    })
  } catch (error) {
    console.error('Error obteniendo cupones:', error)
    return NextResponse.json(
      { message: 'Error interno al obtener cupones' },
      { status: 500 }
    )
  }
}

// Esquema de validación
const createCuponSchema = z.object({
  codigoCupon: z
    .string()
    .min(3, 'El código debe tener al menos 3 caracteres')
    .max(50, 'El código es muy largo')
    .regex(/^[a-zA-Z0-9-_]+$/, 'Solo letras, números, guiones y guiones bajos'),
  mostrarCupon: z.boolean().default(true)
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validatedData = createCuponSchema.parse(body)

    // Verificar si ya existe un cupón con ese código
    const existingCupon = await prisma.cupon.findFirst({
      where: {
        codigoCupon: {
          equals: validatedData.codigoCupon,
          mode: 'insensitive'
        }
      }
    })

    if (existingCupon) {
      return NextResponse.json(
        { message: 'Ya existe un cupón con ese código' },
        { status: 409 }
      )
    }

    // Crear cupón
    const cupon = await prisma.cupon.create({
      data: {
        codigoCupon: validatedData.codigoCupon,
        mostrarCupon: validatedData.mostrarCupon
      }
    })

    return NextResponse.json(
      {
        message: 'Cupón creado exitosamente',
        data: cupon
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Datos inválidos', errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creando cupón:', error)
    return NextResponse.json(
      { message: 'Error interno al crear cupón' },
      { status: 500 }
    )
  }
}
