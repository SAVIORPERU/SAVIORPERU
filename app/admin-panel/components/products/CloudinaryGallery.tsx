'use client'

import React, { useState, useEffect } from 'react'
import { MdClose, MdDelete, MdCheckCircle } from 'react-icons/md'
import { toast } from 'sonner'

interface CloudinaryGalleryProps {
  onClose: () => void
  onSelectImages: (images: string[]) => void
  maxSeleted: number
}

interface CloudinaryImage {
  public_id: string
  secure_url: string
  created_at: string
  bytes: number
  format: string
}

const CloudinaryGallery: React.FC<CloudinaryGalleryProps> = ({
  onClose,
  onSelectImages,
  maxSeleted
}) => {
  const [cloudinaryImages, setCloudinaryImages] = useState<CloudinaryImage[]>(
    []
  )
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch imágenes de Cloudinary
  const fetchCloudinaryImages = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/cloudinary-list')
      if (!response.ok) throw new Error('Error al obtener imágenes')
      const result = await response.json()
      setCloudinaryImages(result.resources)
    } catch (error) {
      console.error('Error fetching cloudinary images:', error)
      toast.error('No se pudieron cargar las imágenes')
    } finally {
      setLoading(false)
    }
  }

  console.log('se abro galeria')
  useEffect(() => {
    fetchCloudinaryImages()
  }, [])

  // Seleccionar/deseleccionar imagen
  const toggleImageSelection = (imageUrl: string) => {
    if (selectedImages.includes(imageUrl)) {
      setSelectedImages((prev) => prev.filter((url) => url !== imageUrl))
    } else if (selectedImages.length < maxSeleted) {
      setSelectedImages((prev) => [...prev, imageUrl])
    } else {
      toast.warning('Solo puedes seleccionar hasta 2 imágenes')
    }
  }

  // Eliminar imagen de Cloudinary
  const deleteImage = async (imageUrl: string) => {
    if (!confirm('¿Estás seguro de eliminar esta imagen permanentemente?'))
      return

    try {
      const response = await fetch('/api/delete-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl })
      })

      if (!response.ok) throw new Error()

      setCloudinaryImages((prev) =>
        prev.filter((img) => img.secure_url !== imageUrl)
      )
      setSelectedImages((prev) => prev.filter((url) => url !== imageUrl))
      toast.success('Imagen eliminada exitosamente')
    } catch (error) {
      console.error('Error deleting image:', error)
      toast.error('Error al eliminar la imagen')
    }
  }

  // Usar imágenes seleccionadas
  const handleUseSelectedImages = () => {
    console.log('boton seleccionar', selectedImages)

    if (selectedImages.length === 0) {
      toast.warning('Selecciona al menos una imagen')
      return
    }
    onSelectImages(selectedImages)
    onClose()
    toast.success('Imágenes seleccionadas')
  }

  console.log('maxSeleted', maxSeleted)

  return (
    <div className='fixed inset-0 z-[60] flex items-center justify-center p-4 backdrop-blur-sm'>
      <div className='w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200 dark:bg-gray-800'>
        {/* Header */}
        <div className='flex items-center justify-between border-b p-6 dark:border-gray-700'>
          <h3 className='text-xl font-bold dark:text-white'>
            Galería de Imágenes
          </h3>
          <div className='flex items-center gap-4'>
            <span className='text-sm text-gray-500 dark:text-gray-400'>
              {selectedImages.length}/{maxSeleted} seleccionadas
            </span>
            <button
              onClick={onClose}
              className='rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400'
            >
              <MdClose size={24} />
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className='overflow-y-auto p-6 flex-1'>
          {loading ? (
            <div className='flex justify-center py-12'>
              <div className='h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent'></div>
            </div>
          ) : cloudinaryImages.length === 0 ? (
            <div className='text-center py-12 text-gray-500 dark:text-gray-400'>
              No hay imágenes en la galería 123
            </div>
          ) : (
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
              {cloudinaryImages.map((image) => (
                <ImageCard
                  key={image.public_id}
                  image={image}
                  isSelected={selectedImages.includes(image.secure_url)}
                  onSelect={() => toggleImageSelection(image.secure_url)}
                  onDelete={() => deleteImage(image.secure_url)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='border-t p-6 bg-gray-50 dark:bg-gray-700/30 dark:border-gray-700 flex justify-between items-center'>
          <button
            onClick={fetchCloudinaryImages}
            className='px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
          >
            Actualizar galería
          </button>
          <div className='flex gap-3'>
            <button
              onClick={onClose}
              className='px-6 py-2.5 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors'
            >
              Cancelar
            </button>
            <button
              onClick={handleUseSelectedImages}
              disabled={selectedImages.length === 0}
              className='px-6 py-2.5 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            >
              Usar Imágenes Seleccionadas
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente interno para tarjeta de imagen
interface ImageCardProps {
  image: CloudinaryImage
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
}

const ImageCard: React.FC<ImageCardProps> = ({
  image,
  isSelected,
  onSelect,
  onDelete
}) => (
  <div
    className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
      isSelected
        ? 'border-blue-500 ring-2 ring-blue-500/20'
        : 'border-gray-200 dark:border-gray-700'
    }`}
    onClick={onSelect}
  >
    <img
      src={image.secure_url}
      alt={image.public_id}
      className='h-40 w-full object-cover'
    />
    <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity'>
      <div className='absolute bottom-2 left-2 right-2'>
        <p className='text-xs text-white truncate'>
          {image.public_id.split('/').pop()}
        </p>
        <p className='text-xs text-gray-300'>
          {new Date(image.created_at).toLocaleDateString()}
        </p>
      </div>
    </div>
    {isSelected && (
      <div className='absolute top-2 right-2'>
        <MdCheckCircle className='text-blue-500 text-2xl' />
      </div>
    )}
    <button
      onClick={(e) => {
        e.stopPropagation()
        onDelete()
      }}
      className='absolute top-2 left-2 rounded-full bg-red-500 p-1.5 text-white hover:bg-red-600 transition-colors'
    >
      <MdDelete size={14} />
    </button>
  </div>
)

export default CloudinaryGallery
