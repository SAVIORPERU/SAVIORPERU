import { v2 as cloudinary } from 'cloudinary'
import { NextResponse } from 'next/server'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const nextCursor = searchParams.get('next_cursor')

    // Lista todas las imágenes de tu cuenta
    const result = await cloudinary.search
      .expression('resource_type:image') // Solo imágenes
      .sort_by('created_at', 'desc') // Más recientes primero
      .max_results(30) // Límite por página
      .next_cursor(nextCursor || undefined)
      .execute()

    return NextResponse.json({
      resources: result.resources,
      next_cursor: result.next_cursor,
      total_count: result.total_count
    })
  } catch (error) {
    console.error('Error listing images:', error)
    return NextResponse.json(
      { error: 'Failed to list images' },
      { status: 500 }
    )
  }
}
