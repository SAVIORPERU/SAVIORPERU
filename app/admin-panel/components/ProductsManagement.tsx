'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  MdSearch,
  MdInventory2,
  MdRemoveRedEye,
  MdEdit,
  MdDelete,
  MdClose,
  MdAdd,
  MdStar,
  MdStarBorder,
  MdFilterList,
  MdSort,
  MdImage,
  MdCloudUpload,
  MdPhotoLibrary,
  MdCheckCircle,
  MdCancel,
  MdWarning,
  MdAttachMoney,
  MdLocalShipping,
  MdChevronLeft,
  MdChevronRight,
  MdFirstPage,
  MdLastPage
} from 'react-icons/md'
import { toast } from 'sonner'
import KpiCard from './KpiCard'

// Interfaces
interface Producto {
  id: number
  name: string
  category: string
  estado: string
  size: string | null
  price: number
  image: string
  image2: string | null
  stock: number
  destacados: Array<{ id: number; productoId: number }>
  createdAt: string
  updatedAt: string
}

interface CloudinaryImage {
  public_id: string
  secure_url: string
  created_at: string
  bytes: number
  format: string
}

interface ApiResponse {
  data: Producto[]
  pagination: {
    totalCount: number
    page: number
    pageSize: number
    totalPages: number
  }
  productsDetails: {
    // ← Agrega esta propiedad
    totalInventoryAmount: number
    notAvailable: number
    totalStock: number
    totalProducts: number
  }
}

interface CloudinaryApiResponse {
  resources: CloudinaryImage[]
  next_cursor: string | null
  total_count: number
}

interface KpiData {
  totalProducts: number
  totalStock: number
  noDisponibleCount: number
  inventoryValue: number
}

const ProductsManagement: React.FC = () => {
  // Estados principales
  const [products, setProducts] = useState<Producto[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pagination, setPagination] = useState<ApiResponse['pagination']>({
    totalCount: 0,
    page: 1,
    pageSize: 16,
    totalPages: 0
  })

  // Estados para KPIs
  const [kpiData, setKpiData] = useState<KpiData>({
    totalProducts: 0,
    totalStock: 0,
    noDisponibleCount: 0,
    inventoryValue: 0
  })

  // Estados para filtros y ordenamiento
  const [filter, setFilter] = useState<string>('')
  const [sort, setSort] = useState<string>('')
  const [showFilters, setShowFilters] = useState<boolean>(false)

  // Estados para modales
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null)
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false)
  const [showEditModal, setShowEditModal] = useState<boolean>(false)
  const [isDeleting, setIsDeleting] = useState<number | null>(null)

  // Estados para Cloudinary
  const [showCloudinaryGallery, setShowCloudinaryGallery] =
    useState<boolean>(false)
  const [cloudinaryImages, setCloudinaryImages] = useState<CloudinaryImage[]>(
    []
  )
  const [selectedCloudinaryImages, setSelectedCloudinaryImages] = useState<
    string[]
  >([])
  const [uploadingToCloudinary, setUploadingToCloudinary] =
    useState<boolean>(false)
  const [loadingCloudinaryImages, setLoadingCloudinaryImages] =
    useState<boolean>(false)

  // Estados para formulario
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    estado: 'DISPONIBLE',
    size: '',
    price: 0,
    stock: 1,
    destacado: false,
    image: '',
    image2: ''
  })

  // Estados para subida de imágenes
  const [uploadedImages, setUploadedImages] = useState<string[]>([])

  // Fetch de productos
  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        ...(filter && { filter }),
        ...(sort && { sort })
      })

      const response = await fetch(`/api/products?${queryParams}`)
      if (!response.ok) throw new Error('Error al obtener productos')
      const result: ApiResponse = await response.json()

      setProducts(result.data)
      setPagination(result.pagination)

      // Usar las estadísticas del backend en lugar de calcularlas
      setKpiData({
        totalProducts: result.productsDetails.totalProducts,
        totalStock: result.productsDetails.totalStock,
        noDisponibleCount: result.productsDetails.notAvailable,
        inventoryValue: result.productsDetails.totalInventoryAmount
      })
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('No se pudieron cargar los productos')
    } finally {
      setLoading(false)
    }
  }, [currentPage, filter, sort])

  // Fetch de imágenes de Cloudinary
  const fetchCloudinaryImages = async () => {
    setLoadingCloudinaryImages(true)
    try {
      const response = await fetch('/api/cloudinary-list')
      if (!response.ok) throw new Error('Error al obtener imágenes')
      const result: CloudinaryApiResponse = await response.json()
      setCloudinaryImages(result.resources)
    } catch (error) {
      console.error('Error fetching cloudinary images:', error)
      toast.error('No se pudieron cargar las imágenes')
    } finally {
      setLoadingCloudinaryImages(false)
    }
  }

  // Calcular KPIs
  const calculateKPIs = (productsList: Producto[]) => {
    let totalStock = 0
    let noDisponibleCount = 0
    let inventoryValue = 0

    productsList.forEach((product) => {
      totalStock += product.stock
      if (product.estado === 'NO DISPONIBLE') {
        noDisponibleCount++
      }
      if (product.estado === 'DISPONIBLE') {
        inventoryValue += product.price * product.stock
      }
    })

    setKpiData({
      totalProducts: productsList.length,
      totalStock,
      noDisponibleCount,
      inventoryValue
    })
  }

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Funciones de paginación
  const goToPage = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setCurrentPage(page)
    }
  }

  const goToFirstPage = () => goToPage(1)
  const goToLastPage = () => goToPage(pagination.totalPages)
  const goToNextPage = () => goToPage(currentPage + 1)
  const goToPrevPage = () => goToPage(currentPage - 1)

  const getPageNumbers = () => {
    const totalPages = pagination.totalPages
    const current = currentPage
    const delta = 2
    const range: number[] = []
    const rangeWithDots: (number | string)[] = []
    let l: number

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= current - delta && i <= current + delta)
      ) {
        range.push(i)
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1)
        } else if (i - l !== 1) {
          rangeWithDots.push('...')
        }
      }
      rangeWithDots.push(i)
      l = i
    })

    return rangeWithDots
  }

  // Subir imagen a Cloudinary
  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    if (!file.type.startsWith('image/')) {
      throw new Error('Solo se permiten archivos de imagen')
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'prueba_preset')
    formData.append('folder', 'ecommerce-products')

    const response = await fetch(
      'https://api.cloudinary.com/v1_1/dniekrmqb/image/upload',
      {
        method: 'POST',
        body: formData
      }
    )

    if (!response.ok) {
      throw new Error(`Error al subir imagen: ${response.statusText}`)
    }

    const data = await response.json()
    return data.secure_url
  }

  // Manejar subida de imagen
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadingToCloudinary(true)
    try {
      const imageUrl = await uploadImageToCloudinary(file)
      setUploadedImages((prev) => [...prev, imageUrl])

      // Si hay menos de 2 imágenes subidas, actualizar formData
      if (uploadedImages.length < 2) {
        if (!formData.image) {
          setFormData((prev) => ({ ...prev, image: imageUrl }))
        } else if (!formData.image2) {
          setFormData((prev) => ({ ...prev, image2: imageUrl }))
        }
      }

      toast.success('Imagen subida exitosamente')
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Error al subir la imagen')
    } finally {
      setUploadingToCloudinary(false)
    }
  }

  // Eliminar imagen de Cloudinary
  const deleteCloudinaryImage = async (imageUrl: string) => {
    if (!confirm('¿Estás seguro de eliminar esta imagen permanentemente?'))
      return

    try {
      const response = await fetch('/api/delete-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl })
      })

      if (!response.ok) throw new Error()

      // Actualizar lista de imágenes
      setCloudinaryImages((prev) =>
        prev.filter((img) => img.secure_url !== imageUrl)
      )
      toast.success('Imagen eliminada exitosamente')
    } catch (error) {
      console.error('Error deleting image:', error)
      toast.error('Error al eliminar la imagen')
    }
  }

  // Seleccionar imagen de Cloudinary
  const selectCloudinaryImage = (imageUrl: string) => {
    if (selectedCloudinaryImages.includes(imageUrl)) {
      setSelectedCloudinaryImages((prev) =>
        prev.filter((url) => url !== imageUrl)
      )
    } else if (selectedCloudinaryImages.length < 2) {
      setSelectedCloudinaryImages((prev) => [...prev, imageUrl])
    } else {
      toast.warning('Solo puedes seleccionar hasta 2 imágenes')
    }
  }

  // Usar imágenes seleccionadas
  const useSelectedImages = () => {
    if (selectedCloudinaryImages.length === 0) {
      toast.warning('Selecciona al menos una imagen')
      return
    }

    setFormData((prev) => ({
      ...prev,
      image: selectedCloudinaryImages[0],
      image2: selectedCloudinaryImages[1] || ''
    }))

    setSelectedCloudinaryImages([])
    setShowCloudinaryGallery(false)
    toast.success('Imágenes seleccionadas')
  }

  // Crear producto
  const handleCreateProduct = async () => {
    if (!formData.name || !formData.category || !formData.image) {
      toast.error('Nombre, categoría e imagen principal son requeridos')
      return
    }

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock),
          image2: formData.image2 || null
        })
      })

      if (!response.ok) throw new Error()

      toast.success('Producto creado exitosamente')
      setShowCreateModal(false)
      resetForm()
      fetchProducts()
    } catch (error) {
      console.error('Error creating product:', error)
      toast.error('Error al crear el producto')
    }
  }

  // Actualizar producto
  const handleUpdateProduct = async () => {
    if (!selectedProduct) return

    // Verificar límite de destacados
    if (formData.destacado && !selectedProduct.destacados.length) {
      const destacadosCount = products.filter(
        (p) => p.destacados.length > 0
      ).length
      if (destacadosCount >= 4) {
        toast.warning('Solo puedes tener 4 productos destacados como máximo')
        return
      }
    }

    try {
      const response = await fetch(`/api/products/${selectedProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock),
          image2: formData.image2 || null
        })
      })

      if (!response.ok) throw new Error()

      toast.success('Producto actualizado exitosamente')
      setShowEditModal(false)
      resetForm()
      fetchProducts()
    } catch (error) {
      console.error('Error updating product:', error)
      toast.error('Error al actualizar el producto')
    }
  }

  // Eliminar producto
  const handleDeleteProduct = async (id: number) => {
    if (
      !confirm(
        '¿Estás seguro de eliminar este producto? Esta acción es irreversible.'
      )
    )
      return

    setIsDeleting(id)
    try {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      if (response.ok) {
        toast.success('Producto eliminado exitosamente')
        fetchProducts()
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Error al eliminar el producto')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Error al eliminar el producto')
    } finally {
      setIsDeleting(null)
    }
  }

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      estado: 'DISPONIBLE',
      size: '',
      price: 0,
      stock: 1,
      destacado: false,
      image: '',
      image2: ''
    })
    setUploadedImages([])
  }

  // Abrir modal de edición
  const openEditModal = (product: Producto) => {
    setSelectedProduct(product)
    setFormData({
      name: product.name,
      category: product.category,
      estado: product.estado,
      size: product.size || '',
      price: product.price,
      stock: product.stock,
      destacado: product.destacados?.length > 0,
      image: product.image,
      image2: product.image2 || ''
    })
    setShowEditModal(true)
  }

  return (
    <>
      <main className='flex flex-1 flex-col bg-gray-50 dark:bg-gray-900 pb-12'>
        <div className='mx-auto flex w-full max-w-7xl flex-col gap-8 p-4 lg:p-8'>
          {/* Header & Search */}
          <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
            <div>
              <h2 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white lg:text-3xl'>
                Gestión de Productos
              </h2>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                Administra el inventario y catálogo de tu tienda.
              </p>
            </div>
            <div className='flex gap-3'>
              <div className='relative w-full sm:w-80'>
                <MdSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl dark:text-gray-500' />
                <input
                  type='text'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && setFilter(searchTerm)}
                  className='h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-10 text-sm shadow-sm outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500 dark:focus:ring-blue-500/30'
                  placeholder='Buscar por nombre o categoría...'
                />
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setFilter('')
                    }}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400'
                  >
                    <MdClose />
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className='flex h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'
              >
                <MdFilterList />
                <span className='hidden sm:inline'>Filtros</span>
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className='flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 transition-colors'
              >
                <MdAdd size={20} />
                <span className='hidden sm:inline'>Nuevo Producto</span>
              </button>
            </div>
          </div>

          {/* Panel de Filtros */}
          {showFilters && (
            <div className='rounded-xl border border-gray-200 bg-white p-4 dark:bg-gray-800 dark:border-gray-700'>
              <div className='flex flex-col gap-4 md:flex-row md:items-center'>
                <div className='flex-1'>
                  <label className='mb-2 block text-xs font-bold text-gray-500 dark:text-gray-400'>
                    Ordenar por
                  </label>
                  <div className='flex gap-2'>
                    <button
                      onClick={() => setSort('')}
                      className={`px-3 py-2 rounded-lg text-sm font-medium ${
                        !sort
                          ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      Nombre
                    </button>
                    <button
                      onClick={() => setSort('price-asc')}
                      className={`px-3 py-2 rounded-lg text-sm font-medium ${
                        sort === 'price-asc'
                          ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      Precio: Menor a Mayor
                    </button>
                    <button
                      onClick={() => setSort('price-desc')}
                      className={`px-3 py-2 rounded-lg text-sm font-medium ${
                        sort === 'price-desc'
                          ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      Precio: Mayor a Menor
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setFilter('')
                    setSort('')
                    setSearchTerm('')
                  }}
                  className='text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                >
                  Limpiar filtros
                </button>
              </div>
            </div>
          )}

          {/* KPI Cards */}
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            <KpiCard
              title='Total Productos'
              value={kpiData.totalProducts.toString()}
              trend={`${pagination.totalCount} total`}
              Icon={MdInventory2}
              color='blue'
            />
            <KpiCard
              title='Stock Total'
              value={kpiData.totalStock.toString()}
              trend='En inventario'
              Icon={MdLocalShipping}
              color='indigo'
            />
            <KpiCard
              title='No Disponible'
              value={kpiData.noDisponibleCount.toString()}
              trend='Sin stock'
              Icon={MdWarning}
              color='orange'
            />
            <KpiCard
              title='Valor Inventario'
              value={`S/ ${kpiData.inventoryValue.toFixed(2)}`}
              trend='Productos disponibles'
              Icon={MdAttachMoney}
              color='purple'
            />
          </div>

          {/* Contador de Resultados */}
          <div className='flex items-center justify-between'>
            <div className='text-sm text-gray-600 dark:text-gray-400'>
              Mostrando <span className='font-bold'>{products.length}</span> de{' '}
              <span className='font-bold'>{pagination.totalCount}</span>{' '}
              productos
            </div>
            <div className='text-sm text-gray-600 dark:text-gray-400'>
              Página <span className='font-bold'>{currentPage}</span> de{' '}
              <span className='font-bold'>{pagination.totalPages}</span>
            </div>
          </div>

          {/* Table */}
          <div className='flex flex-col gap-4'>
            <div className='overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700'>
              <div className='overflow-x-auto'>
                <table className='w-full text-left text-sm text-gray-600 dark:text-gray-400'>
                  <thead className='bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-700/50 dark:text-gray-300'>
                    <tr>
                      <th className='px-6 py-4 font-bold'>Imagen</th>
                      <th className='px-6 py-4 font-bold'>Nombre</th>
                      <th className='px-6 py-4 font-bold'>Categoría</th>
                      <th className='px-6 py-4 font-bold'>Estado</th>
                      <th className='px-6 py-4 font-bold'>Precio</th>
                      <th className='px-6 py-4 font-bold'>Stock</th>
                      <th className='px6 py-4 font-bold'>Destacado</th>
                      <th className='px-6 py-4 text-right font-bold'>
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-100 dark:divide-gray-700'>
                    {loading ? (
                      <tr>
                        <td colSpan={8} className='px-6 py-12 text-center'>
                          <div className='flex justify-center'>
                            <div className='h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent'></div>
                          </div>
                        </td>
                      </tr>
                    ) : products.length === 0 ? (
                      <tr>
                        <td
                          colSpan={8}
                          className='px-6 py-12 text-center text-gray-500 dark:text-gray-400'
                        >
                          {filter
                            ? 'No se encontraron productos para la búsqueda'
                            : 'No hay productos. ¡Crea tu primer producto!'}
                        </td>
                      </tr>
                    ) : (
                      products.map((product) => (
                        <tr
                          key={product.id}
                          className={`hover:bg-gray-50/50 transition-colors group dark:hover:bg-gray-700/30 ${
                            isDeleting === product.id
                              ? 'opacity-50 pointer-events-none'
                              : ''
                          }`}
                        >
                          <td className='px-6 py-4'>
                            <div className='flex -space-x-2'>
                              <img
                                src={product.image}
                                alt={product.name}
                                className='h-10 w-10 rounded-lg border-2 border-white dark:border-gray-800 object-cover shadow-sm'
                              />
                              {product.image2 && (
                                <img
                                  src={product.image2}
                                  alt={`${product.name} - 2`}
                                  className='h-10 w-10 rounded-lg border-2 border-white dark:border-gray-800 object-cover shadow-sm'
                                />
                              )}
                            </div>
                          </td>
                          <td className='px-6 py-4'>
                            <div className='flex flex-col'>
                              <span className='font-semibold text-gray-900 dark:text-white'>
                                {product.name}
                              </span>
                              <span className='text-xs text-gray-400 dark:text-gray-500'>
                                {product.size || 'Sin talla'}
                              </span>
                            </div>
                          </td>
                          <td className='px-6 py-4'>
                            <span className='inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300'>
                              {product.category}
                            </span>
                          </td>
                          <td className='px-6 py-4'>
                            <span
                              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
                                product.estado === 'DISPONIBLE'
                                  ? 'bg-emerald-100 text-green-500 dark:bg-green-600 dark:text-emerald-200'
                                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                              }`}
                            >
                              {product.estado}
                            </span>
                          </td>
                          <td className='px-6 py-4 font-bold text-gray-900 dark:text-white'>
                            S/ {Number(product.price).toFixed(2)}
                          </td>
                          <td className='px-6 py-4'>
                            <span
                              className={`text-sm font-medium ${
                                product.stock > 5
                                  ? 'text-green-600 dark:text-green-400'
                                  : product.stock > 0
                                  ? 'text-amber-600 dark:text-amber-400'
                                  : 'text-red-600 dark:text-red-400'
                              }`}
                            >
                              {product.stock} unidades
                            </span>
                          </td>
                          <td className='px-6 py-4'>
                            {product.destacados?.length > 0 ? (
                              <MdStar className='text-amber-500 text-xl' />
                            ) : (
                              <MdStarBorder className='text-gray-300 text-xl dark:text-gray-600' />
                            )}
                          </td>
                          <td className='px-6 py-4 text-right'>
                            <div className='flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all'>
                              <button
                                onClick={() => openEditModal(product)}
                                className='p-2 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 rounded-lg transition-colors'
                              >
                                <MdEdit size={20} />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className='p-2 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 rounded-lg transition-colors'
                              >
                                <MdDelete size={20} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Paginación */}
            {pagination.totalPages > 1 && !loading && (
              <div className='flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 rounded-b-xl'>
                <div className='flex items-center gap-2'>
                  <button
                    onClick={goToFirstPage}
                    disabled={currentPage === 1}
                    className='flex items-center justify-center h-9 w-9 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors'
                    aria-label='Primera página'
                  >
                    <MdFirstPage size={20} />
                  </button>
                  <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className='flex items-center justify-center h-9 w-9 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors'
                    aria-label='Página anterior'
                  >
                    <MdChevronLeft size={20} />
                  </button>
                </div>

                <div className='flex items-center gap-1'>
                  {getPageNumbers().map((pageNum, index) => (
                    <React.Fragment key={index}>
                      {pageNum === '...' ? (
                        <span className='px-3 py-1 text-gray-400 dark:text-gray-500'>
                          ...
                        </span>
                      ) : (
                        <button
                          onClick={() => goToPage(Number(pageNum))}
                          className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white border border-blue-600'
                              : 'border border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <div className='flex items-center gap-2'>
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === pagination.totalPages}
                    className='flex items-center justify-center h-9 w-9 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors'
                    aria-label='Página siguiente'
                  >
                    <MdChevronRight size={20} />
                  </button>
                  <button
                    onClick={goToLastPage}
                    disabled={currentPage === pagination.totalPages}
                    className='flex items-center justify-center h-9 w-9 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors'
                    aria-label='Última página'
                  >
                    <MdLastPage size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal para Crear Producto */}
      {showCreateModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm'>
          <div className='w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200 dark:bg-gray-800'>
            <div className='flex items-center justify-between border-b p-6 dark:border-gray-700'>
              <h3 className='text-xl font-bold dark:text-white'>
                Crear Nuevo Producto
              </h3>
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  resetForm()
                }}
                className='rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400'
              >
                <MdClose size={24} />
              </button>
            </div>

            <div className='overflow-y-auto p-6 flex-1'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {/* Columna Izquierda */}
                <div className='space-y-4'>
                  <div>
                    <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                      Nombre del Producto *
                    </label>
                    <input
                      type='text'
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className='w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                      placeholder='Ej: Camiseta básica'
                    />
                  </div>

                  <div>
                    <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                      Categoría *
                    </label>
                    <input
                      type='text'
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className='w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                      placeholder='Ej: Ropa, Accesorios'
                    />
                  </div>

                  <div>
                    <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                      Talla
                    </label>
                    <input
                      type='text'
                      value={formData.size}
                      onChange={(e) =>
                        setFormData({ ...formData, size: e.target.value })
                      }
                      className='w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                      placeholder='Ej: M, 42, Única'
                    />
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                        Precio (S/) *
                      </label>
                      <input
                        type='number'
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            price: parseFloat(e.target.value) || 0
                          })
                        }
                        step='0.01'
                        min='0'
                        className='w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                        placeholder='0.00'
                      />
                    </div>

                    <div>
                      <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                        Stock *
                      </label>
                      <input
                        type='number'
                        value={formData.stock}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            stock: parseInt(e.target.value) || 0
                          })
                        }
                        min='0'
                        className='w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                        placeholder='0'
                      />
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                        Estado
                      </label>
                      <select
                        value={formData.estado}
                        onChange={(e) =>
                          setFormData({ ...formData, estado: e.target.value })
                        }
                        className='w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                      >
                        <option value='DISPONIBLE'>Disponible</option>
                        <option value='NO DISPONIBLE'>No Disponible</option>
                      </select>
                    </div>

                    <div className='flex items-center'>
                      <div className='mt-6'>
                        <label className='flex items-center gap-2'>
                          <input
                            type='checkbox'
                            checked={formData.destacado}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                destacado: e.target.checked
                              })
                            }
                            className='rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700'
                          />
                          <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                            Destacado
                          </span>
                        </label>
                        {formData.destacado && (
                          <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
                            Máximo 4 productos destacados
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Columna Derecha - Imágenes */}
                <div className='space-y-4'>
                  <div>
                    <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                      Imágenes del Producto
                    </label>
                    <p className='mb-3 text-xs text-gray-500 dark:text-gray-400'>
                      Sube hasta 2 imágenes (primera imagen es obligatoria)
                    </p>

                    {/* Botones para subir imágenes */}
                    <div className='flex gap-3 mb-4'>
                      <div>
                        <input
                          type='file'
                          id='image-upload'
                          accept='image/*'
                          onChange={handleImageUpload}
                          className='hidden'
                          disabled={uploadingToCloudinary}
                        />
                        <label
                          htmlFor='image-upload'
                          className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium cursor-pointer transition-colors ${
                            uploadingToCloudinary
                              ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                              : 'bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50'
                          }`}
                        >
                          <MdCloudUpload />
                          {uploadingToCloudinary
                            ? 'Subiendo...'
                            : 'Subir Imagen'}
                        </label>
                      </div>

                      <button
                        onClick={() => {
                          fetchCloudinaryImages()
                          setShowCloudinaryGallery(true)
                        }}
                        className='flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors'
                      >
                        <MdPhotoLibrary />
                        Galería
                      </button>
                    </div>

                    {/* Vista previa de imágenes */}
                    <div className='grid grid-cols-2 gap-4'>
                      {/* Imagen principal */}
                      <div className='relative'>
                        <div className='aspect-square rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 overflow-hidden bg-gray-50 dark:bg-gray-700/50'>
                          {formData.image ? (
                            <img
                              src={formData.image}
                              alt='Imagen principal'
                              className='h-full w-full object-cover'
                            />
                          ) : (
                            <div className='flex h-full items-center justify-center'>
                              <MdImage className='text-gray-400 dark:text-gray-500 text-4xl' />
                            </div>
                          )}
                        </div>
                        <div className='mt-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400'>
                          Imagen Principal
                        </div>
                        {formData.image && (
                          <button
                            onClick={() =>
                              setFormData({ ...formData, image: '' })
                            }
                            className='absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600'
                          >
                            <MdClose size={14} />
                          </button>
                        )}
                      </div>

                      {/* Imagen secundaria */}
                      <div className='relative'>
                        <div className='aspect-square rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 overflow-hidden bg-gray-50 dark:bg-gray-700/50'>
                          {formData.image2 ? (
                            <img
                              src={formData.image2}
                              alt='Imagen secundaria'
                              className='h-full w-full object-cover'
                            />
                          ) : (
                            <div className='flex h-full items-center justify-center'>
                              <MdImage className='text-gray-400 dark:text-gray-500 text-4xl' />
                            </div>
                          )}
                        </div>
                        <div className='mt-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400'>
                          Imagen Secundaria (Opcional)
                        </div>
                        {formData.image2 && (
                          <button
                            onClick={() =>
                              setFormData({ ...formData, image2: '' })
                            }
                            className='absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600'
                          >
                            <MdClose size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Imágenes recién subidas */}
                    {uploadedImages.length > 0 && (
                      <div className='mt-4'>
                        <p className='mb-2 text-xs font-medium text-gray-500 dark:text-gray-400'>
                          Imágenes subidas recientemente:
                        </p>
                        <div className='flex flex-wrap gap-2'>
                          {uploadedImages.map((url, index) => (
                            <div key={index} className='relative'>
                              <img
                                src={url}
                                alt={`Subida ${index + 1}`}
                                className='h-16 w-16 rounded-lg object-cover border'
                              />
                              <button
                                onClick={() => {
                                  if (formData.image === url)
                                    setFormData({ ...formData, image: '' })
                                  if (formData.image2 === url)
                                    setFormData({ ...formData, image2: '' })
                                  setUploadedImages((prev) =>
                                    prev.filter((img) => img !== url)
                                  )
                                }}
                                className='absolute -top-1 -right-1 rounded-full bg-red-500 p-0.5 text-white hover:bg-red-600'
                              >
                                <MdClose size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className='border-t p-6 bg-gray-50 dark:bg-gray-700/30 dark:border-gray-700 flex justify-between items-center'>
              <div className='text-sm text-gray-500 dark:text-gray-400'>
                Los campos marcados con * son obligatorios
              </div>
              <div className='flex gap-3'>
                <button
                  onClick={() => {
                    setShowCreateModal(false)
                    resetForm()
                  }}
                  className='px-6 py-2.5 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors'
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateProduct}
                  disabled={
                    !formData.name || !formData.category || !formData.image
                  }
                  className='px-6 py-2.5 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                >
                  Crear Producto
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Editar Producto */}
      {showEditModal && selectedProduct && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm'>
          <div className='w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200 dark:bg-gray-800'>
            <div className='flex items-center justify-between border-b p-6 dark:border-gray-700'>
              <h3 className='text-xl font-bold dark:text-white'>
                Editar Producto #{selectedProduct.id}
              </h3>
              <button
                onClick={() => {
                  setShowEditModal(false)
                  resetForm()
                }}
                className='rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400'
              >
                <MdClose size={24} />
              </button>
            </div>

            <div className='overflow-y-auto p-6 flex-1'>
              {/* Mismo formulario que crear, pero con datos precargados */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-4'>
                  <div>
                    <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                      Nombre del Producto *
                    </label>
                    <input
                      type='text'
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className='w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                    />
                  </div>

                  <div>
                    <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                      Categoría *
                    </label>
                    <input
                      type='text'
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className='w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                    />
                  </div>

                  <div>
                    <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                      Talla
                    </label>
                    <input
                      type='text'
                      value={formData.size}
                      onChange={(e) =>
                        setFormData({ ...formData, size: e.target.value })
                      }
                      className='w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                    />
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                        Precio (S/) *
                      </label>
                      <input
                        type='number'
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            price: parseFloat(e.target.value) || 0
                          })
                        }
                        step='0.01'
                        min='0'
                        className='w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                      />
                    </div>

                    <div>
                      <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                        Stock *
                      </label>
                      <input
                        type='number'
                        value={formData.stock}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            stock: parseInt(e.target.value) || 0
                          })
                        }
                        min='0'
                        className='w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                      />
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                        Estado
                      </label>
                      <select
                        value={formData.estado}
                        onChange={(e) =>
                          setFormData({ ...formData, estado: e.target.value })
                        }
                        className='w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                      >
                        <option value='DISPONIBLE'>Disponible</option>
                        <option value='NO DISPONIBLE'>No Disponible</option>
                      </select>
                    </div>

                    <div className='flex items-center'>
                      <div className='mt-6'>
                        <label className='flex items-center gap-2'>
                          <input
                            type='checkbox'
                            checked={formData.destacado}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                destacado: e.target.checked
                              })
                            }
                            className='rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700'
                          />
                          <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                            Destacado
                          </span>
                        </label>
                        <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
                          {
                            products.filter((p) => p.destacados?.length > 0)
                              .length
                          }
                          /4 destacados
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='space-y-4'>
                  <div>
                    <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                      Imágenes del Producto
                    </label>

                    <div className='flex gap-3 mb-4'>
                      <div>
                        <input
                          type='file'
                          id='edit-image-upload'
                          accept='image/*'
                          onChange={handleImageUpload}
                          className='hidden'
                          disabled={uploadingToCloudinary}
                        />
                        <label
                          htmlFor='edit-image-upload'
                          className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium cursor-pointer transition-colors ${
                            uploadingToCloudinary
                              ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                              : 'bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50'
                          }`}
                        >
                          <MdCloudUpload />
                          {uploadingToCloudinary
                            ? 'Subiendo...'
                            : 'Subir Nueva Imagen'}
                        </label>
                      </div>

                      <button
                        onClick={() => {
                          fetchCloudinaryImages()
                          setShowCloudinaryGallery(true)
                        }}
                        className='flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors'
                      >
                        <MdPhotoLibrary />
                        Galería
                      </button>
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                      <div className='relative'>
                        <div className='aspect-square rounded-lg border-2 border-gray-300 dark:border-gray-600 overflow-hidden bg-gray-50 dark:bg-gray-700/50'>
                          {formData.image ? (
                            <img
                              src={formData.image}
                              alt='Imagen principal'
                              className='h-full w-full object-cover'
                            />
                          ) : (
                            <div className='flex h-full items-center justify-center'>
                              <MdImage className='text-gray-400 dark:text-gray-500 text-4xl' />
                            </div>
                          )}
                        </div>
                        <div className='mt-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400'>
                          Imagen Principal
                        </div>
                      </div>

                      <div className='relative'>
                        <div className='aspect-square rounded-lg border-2 border-gray-300 dark:border-gray-600 overflow-hidden bg-gray-50 dark:bg-gray-700/50'>
                          {formData.image2 ? (
                            <img
                              src={formData.image2}
                              alt='Imagen secundaria'
                              className='h-full w-full object-cover'
                            />
                          ) : (
                            <div className='flex h-full items-center justify-center'>
                              <MdImage className='text-gray-400 dark:text-gray-500 text-4xl' />
                            </div>
                          )}
                        </div>
                        <div className='mt-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400'>
                          Imagen Secundaria
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='border-t p-6 bg-gray-50 dark:bg-gray-700/30 dark:border-gray-700 flex justify-between items-center'>
              <div className='text-sm text-gray-500 dark:text-gray-400'>
                Última actualización:{' '}
                {new Date(selectedProduct.updatedAt).toLocaleDateString()}
              </div>
              <div className='flex gap-3'>
                <button
                  onClick={() => {
                    setShowEditModal(false)
                    resetForm()
                  }}
                  className='px-6 py-2.5 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors'
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpdateProduct}
                  disabled={
                    !formData.name || !formData.category || !formData.image
                  }
                  className='px-6 py-2.5 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Galería Cloudinary */}
      {showCloudinaryGallery && (
        <div className='fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm'>
          <div className='w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200 dark:bg-gray-800'>
            <div className='flex items-center justify-between border-b p-6 dark:border-gray-700'>
              <h3 className='text-xl font-bold dark:text-white'>
                Galería de Imágenes
              </h3>
              <div className='flex items-center gap-4'>
                <span className='text-sm text-gray-500 dark:text-gray-400'>
                  {selectedCloudinaryImages.length}/2 seleccionadas
                </span>
                <button
                  onClick={() => {
                    setShowCloudinaryGallery(false)
                    setSelectedCloudinaryImages([])
                  }}
                  className='rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400'
                >
                  <MdClose size={24} />
                </button>
              </div>
            </div>

            <div className='overflow-y-auto p-6 flex-1'>
              {loadingCloudinaryImages ? (
                <div className='flex justify-center py-12'>
                  <div className='h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent'></div>
                </div>
              ) : cloudinaryImages.length === 0 ? (
                <div className='text-center py-12 text-gray-500 dark:text-gray-400'>
                  No hay imágenes en la galería
                </div>
              ) : (
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
                  {cloudinaryImages.map((image) => (
                    <div
                      key={image.public_id}
                      className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                        selectedCloudinaryImages.includes(image.secure_url)
                          ? 'border-blue-500 ring-2 ring-blue-500/20'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                      onClick={() => selectCloudinaryImage(image.secure_url)}
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
                      {selectedCloudinaryImages.includes(image.secure_url) && (
                        <div className='absolute top-2 right-2'>
                          <MdCheckCircle className='text-blue-500 text-2xl' />
                        </div>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteCloudinaryImage(image.secure_url)
                        }}
                        className='absolute top-2 left-2 rounded-full bg-red-500 p-1.5 text-white hover:bg-red-600 transition-colors'
                      >
                        <MdDelete size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className='border-t p-6 bg-gray-50 dark:bg-gray-700/30 dark:border-gray-700 flex justify-between items-center'>
              <button
                onClick={() => {
                  fetchCloudinaryImages()
                }}
                className='px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
              >
                Actualizar galería
              </button>
              <div className='flex gap-3'>
                <button
                  onClick={() => {
                    setShowCloudinaryGallery(false)
                    setSelectedCloudinaryImages([])
                  }}
                  className='px-6 py-2.5 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors'
                >
                  Cancelar
                </button>
                <button
                  onClick={useSelectedImages}
                  disabled={selectedCloudinaryImages.length === 0}
                  className='px-6 py-2.5 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                >
                  Usar Imágenes Seleccionadas
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ProductsManagement
