import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { products } from './products' // 👈 tu archivo con productos iniciales
import { Prisma } from '@/app/generated/prisma/client'
import { z } from 'zod'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const pageSize = 16
    const filter = searchParams.get('filter') || ''
    const sort = searchParams.get('sort') || ''

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

      // Calcular estadísticas para productos iniciales
      const initialProductsDetails = {
        totalInventoryAmount: products.reduce((sum, product) => {
          return sum + (Number(product.price) || 0) * (product.stock || 0)
        }, 0),
        notAvailable: products.filter((p) => p.estado === 'NO DISPONIBLE')
          .length,
        totalStock: products.reduce(
          (sum, product) => sum + (product.stock || 0),
          0
        ),
        totalProducts: products.length
      }

      return NextResponse.json(
        {
          message: 'Initial products created',
          data: initialProducts,
          pagination: {
            page,
            pageSize,
            totalPages: Math.ceil(products.length / pageSize),
            totalCount: products.length
          },
          productsDetails: initialProductsDetails
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

    // Obtener estadísticas de TODOS los productos (sin paginación)
    const allProducts = await prisma.productos.findMany({
      where: {
        OR: [
          { name: { contains: filter, mode: 'insensitive' } },
          { category: { contains: filter, mode: 'insensitive' } }
        ]
      }
    })

    // Calcular las estadísticas
    const productsDetails = {
      totalInventoryAmount: allProducts.reduce((sum, product) => {
        // Solo sumar productos DISPONIBLES al valor del inventario
        if (product.estado === 'DISPONIBLE') {
          return sum + (Number(product.price) || 0) * (product.stock || 0)
        }
        return sum
      }, 0),
      notAvailable: allProducts.filter((p) => p.estado === 'NO DISPONIBLE')
        .length,
      totalStock: allProducts.reduce(
        (sum, product) => sum + (product.stock || 0),
        0
      ),
      totalProducts: allProducts.length
    }

    // Contador para paginación (solo productos que coinciden con el filtro)
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
        },
        productsDetails // Nueva propiedad añadida
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

// Esquema de validación para producto
const createProductSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  category: z.string().min(1, 'La categoría es requerida'),
  estado: z.string().default('Disponible'),
  size: z.string().optional(),
  price: z.number().positive('El precio debe ser mayor a 0'),
  image: z.string().url('La imagen debe ser una URL válida'),
  image2: z
    .string()
    .url('La segunda imagen debe ser una URL válida')
    .optional()
    .nullable(),
  stock: z.number().int().min(0, 'El stock no puede ser negativo').default(1),
  destacado: z.boolean().default(false) // Para marcar como destacado automáticamente
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validatedData = createProductSchema.parse(body)

    // Crear producto
    const product = await prisma.productos.create({
      data: {
        name: validatedData.name,
        category: validatedData.category,
        estado: validatedData.estado,
        size: validatedData.size,
        price: validatedData.price,
        image: validatedData.image,
        image2: validatedData.image2,
        stock: validatedData.stock
      }
    })

    // Si el producto debe ser destacado, crear relación
    if (validatedData.destacado) {
      await prisma.productosDestacados.create({
        data: {
          productoId: product.id
        }
      })
    }

    return NextResponse.json(
      {
        message: 'Producto creado exitosamente',
        data: product
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

    // Verificar si es error de duplicado (aunque no tienes unique en name)
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { message: 'Ya existe un producto con ese nombre' },
        { status: 409 }
      )
    }

    console.error('Error creando producto:', error)
    return NextResponse.json(
      { message: 'Error interno al crear producto' },
      { status: 500 }
    )
  }
}
