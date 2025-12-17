'use client'

import { useUser } from '@clerk/nextjs'
import React, { useState, useEffect } from 'react'
import TableSkeleton from './components/DeskSkeleton'
import OrderSkeleton from './components/MobilSkeleton'
import OrderDetailsModal from './components/OrderDetailsModal'
import { usePDFGenerator } from './components/usePDFGenerator'
import { FileText, Eye } from 'lucide-react'

interface OrderItem {
  id: number
  producto: {
    name: string
    price: string
  }
  quantity: number
  totalPrice: string
}

interface Order {
  id: number
  clientName: string
  status: string
  totalPrice: string
  createdAt: string
  orderItems: OrderItem[]
  address?: string
  agencia?: string
  clientPhone?: string
  dni?: string
  locationToSend?: string
  deliveryCost?: string
  totalProducts?: number
  discount?: string
}

interface Pagination {
  total: number
  page: number
  limit: number
  totalPages: number
}

export default function OrdersList({
  orders: initialOrders,
  pagination: initialPagination
}: {
  orders: Order[]
  pagination: Pagination
}) {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [pagination, setPagination] = useState<Pagination>(initialPagination)
  const [page, setPage] = useState(initialPagination.page)
  const [loading, setLoading] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const { user, isSignedIn } = useUser()
  const { generatePDF, isGenerating } = usePDFGenerator()

  // 🔹 Fetch cuando cambia la página
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      try {
        const res = await fetch(
          `/api/orders?page=${page}&limit=${pagination.limit}&email=${user?.emailAddresses[0].emailAddress}`,
          {
            cache: 'no-store'
          }
        )
        if (res.ok) {
          const { data, pagination: newPagination } = await res.json()
          setOrders(data)
          setPagination(newPagination)
        } else {
          console.error('Error al cargar órdenes')
        }
      } catch (error) {
        console.error('Error en fetch:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [page, isSignedIn])

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
  }

  const handleGeneratePDF = async (order: Order) => {
    const pdfData = {
      orderId: order.id,
      clientName: order.clientName,
      status: order.status,
      totalPrice: order.totalPrice,
      createdAt: order.createdAt,
      orderItems: order.orderItems
      // Agrega otros campos que necesites
    }

    await generatePDF(pdfData)
  }

  // Función para obtener el color según el estado
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completado':
      case 'entregado':
        return 'bg-green-500/10 text-green-600 dark:text-green-400'
      case 'pendiente':
        return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
      case 'cancelado':
        return 'bg-red-500/10 text-red-600 dark:text-red-400'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <div className='space-y-6'>
      {/* Encabezado */}
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-2xl font-bold text-foreground'>
            Historial de Pedidos
          </h1>
          <p className='text-muted-foreground mt-1'>
            {pagination.total} pedidos encontrados
          </p>
        </div>
        <div className='px-4 py-2 rounded-lg bg-card border border-border'>
          <span className='text-sm text-muted-foreground'>Página</span>
          <span className='mx-2 font-semibold text-foreground'>{page}</span>
          <span className='text-sm text-muted-foreground'>
            de {pagination.totalPages}
          </span>
        </div>
      </div>

      {/* Lista de pedidos - Vista Tarjetas */}
      <div className='lg:hidden'>
        {!isSignedIn ? (
          [...Array(3)].map((_, i) => <OrderSkeleton key={i} />)
        ) : orders.length === 0 ? (
          <div className='text-center py-12 border border-dashed border-border rounded-lg'>
            <p className='text-muted-foreground'>No hay pedidos para mostrar</p>
          </div>
        ) : (
          <div className='space-y-4'>
            {orders.map((order) => (
              <div
                key={order.id}
                className='bg-card border border-border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow'
              >
                <div className='flex justify-between items-start mb-4'>
                  <div>
                    <h3 className='font-semibold text-foreground'>
                      {order.clientName}
                    </h3>
                    <p className='text-sm text-muted-foreground mt-1'>
                      {new Date(order.createdAt).toLocaleDateString('es-PE', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* <div className='mb-4'>
                  <h4 className='text-sm font-medium text-foreground mb-2'>
                    Productos:
                  </h4>
                  <div className='space-y-2'>
                    {order.orderItems.map((item) => (
                      <div
                        key={item.id}
                        className='flex justify-between items-center text-sm py-2 border-b border-border last:border-0'
                      >
                        <div>
                          <span className='text-foreground'>
                            {item.producto.name}
                          </span>
                          <span className='text-muted-foreground ml-2'>
                            x{item.quantity}
                          </span>
                        </div>
                        <span className='font-medium text-foreground'>
                          S/. {item.totalPrice}
                        </span>
                      </div>
                    ))}
                  </div>
                </div> */}

                <div className='flex justify-between items-center pt-4 border-t border-border'>
                  <div>
                    <span className='text-sm text-muted-foreground'>
                      Total:
                    </span>
                    <span className='ml-2 text-lg font-bold text-foreground'>
                      S/. {Number(order.totalPrice).toFixed(2)}
                    </span>
                  </div>
                  <div className='flex space-x-2'>
                    <button
                      onClick={() => handleViewOrder(order)}
                      className='px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-accent transition-colors flex items-center gap-1'
                    >
                      <Eye className='w-4 h-4' />
                      Ver
                    </button>
                    <button
                      onClick={() => handleGeneratePDF(order)}
                      disabled={isGenerating}
                      className='px-3 py-1.5 text-sm bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1 disabled:opacity-50'
                    >
                      <FileText className='w-4 h-4' />
                      {isGenerating ? 'Generando...' : 'PDF'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tabla de pedidos - Vista Escritorio */}
      <div className='hidden lg:block'>
        {!isSignedIn ? (
          <TableSkeleton />
        ) : (
          <div className='overflow-hidden rounded-xl border border-border bg-card'>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='bg-foreground text-background'>
                    <th className='text-left p-4 font-semibold'>Cliente</th>
                    <th className='text-left p-4 font-semibold'>Estado</th>
                    <th className='text-left p-4 font-semibold'>Total</th>
                    <th className='text-left p-4 font-semibold'>Fecha</th>
                    {/* <th className='text-left p-4 font-semibold'>Productos</th> */}
                    <th className='text-right pr-16 font-semibold'>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className='p-8 text-center text-muted-foreground'
                      >
                        No hay pedidos para mostrar
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr
                        key={order.id}
                        className='border-b border-border hover:bg-accent/50 transition-colors'
                      >
                        <td className='p-4'>
                          <div className='font-medium text-foreground'>
                            {order.clientName}
                          </div>
                        </td>
                        <td className='p-4'>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className='p-4'>
                          <div className='font-bold text-foreground'>
                            S/.{' '}
                            {(
                              Math.round(
                                (parseFloat(order.totalPrice) +
                                  (order.deliveryCost
                                    ? parseFloat(order.deliveryCost)
                                    : 0) -
                                  (order.discount
                                    ? (parseFloat(order.totalPrice) *
                                        parseFloat(order.discount)) /
                                      100
                                    : 0)) *
                                  10
                              ) / 10
                            ).toFixed(2)}
                          </div>
                        </td>
                        <td className='p-4'>
                          <div className='text-foreground'>
                            {new Date(order.createdAt).toLocaleDateString(
                              'es-PE'
                            )}
                          </div>
                          <div className='text-sm text-muted-foreground'>
                            {new Date(order.createdAt).toLocaleTimeString(
                              'es-PE',
                              {
                                hour: '2-digit',
                                minute: '2-digit'
                              }
                            )}
                          </div>
                        </td>
                        {/* <td className='p-4'>
                          <div className='space-y-1'>
                            {order.orderItems.map((item) => (
                              <div
                                key={item.id}
                                className='flex justify-between items-center text-sm'
                              >
                                <span className='text-foreground'>
                                  {item.producto.name}
                                  <span className='text-muted-foreground ml-1'>
                                    (x{item.quantity})
                                  </span>
                                </span>
                                <span className='font-medium text-foreground'>
                                  S/. {item.totalPrice}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td> */}
                        <td className='p-4'>
                          <div className='flex space-x-2 justify-end'>
                            <button
                              onClick={() => handleViewOrder(order)}
                              className='px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-accent transition-colors flex items-center gap-1'
                            >
                              <Eye className='w-4 h-4' />
                              Ver
                            </button>
                            <button
                              onClick={() => handleGeneratePDF(order)}
                              disabled={isGenerating}
                              className='px-3 py-1.5 text-sm bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1 disabled:opacity-50'
                            >
                              <FileText className='w-4 h-4' />
                              PDF
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
        )}
      </div>

      {/* Paginación */}
      <div className='flex flex-col sm:flex-row justify-between items-center gap-4 pt-4'>
        <div className='text-sm text-muted-foreground'>
          Mostrando {orders.length} de {pagination.total} pedidos
        </div>

        <div className='flex items-center space-x-2'>
          <button
            disabled={page <= 1 || loading}
            onClick={() => setPage(page - 1)}
            className='px-4 py-2 border border-border rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2'
          >
            <svg
              className='w-4 h-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 19l-7-7 7-7'
              />
            </svg>
            Anterior
          </button>

          <div className='flex items-center space-x-1'>
            {Array.from(
              { length: Math.min(5, pagination.totalPages) },
              (_, i) => {
                let pageNum
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1
                } else if (page <= 3) {
                  pageNum = i + 1
                } else if (page >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i
                } else {
                  pageNum = page - 2 + i
                }

                if (pageNum > pagination.totalPages) return null

                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-10 h-10 rounded-lg transition-colors ${
                      page === pageNum
                        ? 'bg-foreground text-background'
                        : 'hover:bg-accent text-foreground'
                    }`}
                    disabled={loading}
                  >
                    {pageNum}
                  </button>
                )
              }
            )}
          </div>

          {/* Modal de detalles */}
          <OrderDetailsModal
            order={selectedOrder}
            isOpen={!!selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />

          <button
            disabled={page >= pagination.totalPages || loading}
            onClick={() => setPage(page + 1)}
            className='px-4 py-2 border border-border rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2'
          >
            Siguiente
            <svg
              className='w-4 h-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 5l7 7-7 7'
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
