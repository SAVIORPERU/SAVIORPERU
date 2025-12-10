import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { products } from './products' // 👈 tu archivo con productos iniciales
import { Prisma } from '@/app/generated/prisma/client'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const pageSize = 15
    const filter = searchParams.get('filter') || ''
    const sort = searchParams.get('sort') || 'name'

    // Definir ordenamiento
    const orderBy: Prisma.ProductosOrderByWithRelationInput =
      sort === 'price-asc'
        ? { price: 'asc' as Prisma.SortOrder }
        : sort === 'price-desc'
        ? { price: 'desc' as Prisma.SortOrder }
        : { name: 'asc' as Prisma.SortOrder }

    // Verificar si existen productos
    const existingCount = await prisma.productos.count()

    if (existingCount === 0) {
      await prisma.productos.createMany({
        data: products
      })

      const initialProducts = await prisma.productos.findMany({
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize
      })

      return NextResponse.json(
        {
          message: 'Initial products created',
          data: initialProducts,
          pagination: {
            page,
            pageSize,
            totalPages: Math.ceil(products.length / pageSize),
            totalCount: products.length
          }
        },
        { status: 201 }
      )
    }

    // Filtros y paginación
    const filteredProducts = await prisma.productos.findMany({
      where: {
        OR: [
          { name: { contains: filter, mode: 'insensitive' } },
          { category: { contains: filter, mode: 'insensitive' } }
        ]
      },
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize
    })

    const totalCount = await prisma.productos.count({
      where: {
        OR: [
          { name: { contains: filter, mode: 'insensitive' } },
          { category: { contains: filter, mode: 'insensitive' } }
        ]
      }
    })

    return NextResponse.json(
      {
        message: 'Products retrieved successfully',
        data: filteredProducts,
        pagination: {
          page,
          pageSize,
          totalPages: Math.ceil(totalCount / pageSize),
          totalCount
        }
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { message: 'Error fetching products' },
      { status: 500 }
    )
  }
}
