import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { products } from './products' // 👈 tu archivo con productos iniciales
import { Prisma } from '@/app/generated/prisma/client'
import { z } from 'zod'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const pageSize = 15
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

// Esquema de validación para actualizar producto
const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  estado: z.string().optional(),
  size: z.string().optional().nullable(),
  price: z.number().positive().optional(),
  image: z.string().url().optional(),
  image2: z.string().url().optional().nullable(),
  stock: z.number().int().min(0).optional(),
  destacado: z.boolean().optional()
})

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { message: 'ID de producto inválido' },
        { status: 400 }
      )
    }

    // Verificar si el producto existe
    const existingProduct = await prisma.productos.findUnique({
      where: { id }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { message: 'Producto no encontrado' },
        { status: 404 }
      )
    }

    // Obtener y validar datos
    const body = await req.json()
    const validatedData = updateProductSchema.parse(body)

    // Actualizar producto
    const updatedProduct = await prisma.productos.update({
      where: { id },
      data: {
        name: validatedData.name,
        category: validatedData.category,
        estado: validatedData.estado,
        size: validatedData.size,
        price: validatedData.price,
        image: validatedData.image,
        image2: validatedData.image2,
        stock: validatedData.stock,
        updatedAt: new Date()
      }
    })

    // Manejar producto destacado
    if (validatedData.destacado !== undefined) {
      const existingDestacado = await prisma.productosDestacados.findUnique({
        where: { productoId: id }
      })

      if (validatedData.destacado && !existingDestacado) {
        // Agregar a destacados
        await prisma.productosDestacados.create({
          data: { productoId: id }
        })
      } else if (!validatedData.destacado && existingDestacado) {
        // Quitar de destacados
        await prisma.productosDestacados.delete({
          where: { productoId: id }
        })
      }
    }

    return NextResponse.json({
      message: 'Producto actualizado exitosamente',
      data: updatedProduct
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Datos inválidos', errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Error actualizando producto:', error)
    return NextResponse.json(
      { message: 'Error interno al actualizar producto' },
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
        { message: 'ID de producto inválido' },
        { status: 400 }
      )
    }

    // Verificar si el producto existe
    const existingProduct = await prisma.productos.findUnique({
      where: { id },
      include: {
        orderItems: {
          take: 1 // Solo necesitamos saber si hay al menos una
        },
        destacados: true
      }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { message: 'Producto no encontrado' },
        { status: 404 }
      )
    }

    // Verificar si el producto tiene órdenes asociadas
    if (existingProduct.orderItems.length > 0) {
      return NextResponse.json(
        {
          message:
            'No se puede eliminar el producto porque tiene órdenes asociadas',
          suggestion:
            'En su lugar, puedes marcarlo como "No disponible" cambiando el estado'
        },
        { status: 400 }
      )
    }

    // Si el producto está en destacados, eliminar esa relación primero
    if (existingProduct.destacados.length > 0) {
      await prisma.productosDestacados.delete({
        where: { productoId: id }
      })
    }

    // Eliminar producto
    await prisma.productos.delete({
      where: { id }
    })

    return NextResponse.json({
      message: 'Producto eliminado exitosamente',
      deletedId: id
    })
  } catch (error) {
    console.error('Error eliminando producto:', error)

    // Manejar errores de integridad referencial
    if (
      error instanceof Error &&
      error.message.includes('Foreign key constraint')
    ) {
      return NextResponse.json(
        {
          message:
            'No se puede eliminar el producto porque está referenciado en otras tablas',
          suggestion: 'Considera desactivarlo en lugar de eliminarlo'
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: 'Error interno al eliminar producto' },
      { status: 500 }
    )
  }
}
