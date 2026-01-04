'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { IconType } from 'react-icons'
import {
  MdAttachMoney,
  MdDashboard,
  MdInventory2,
  MdSearch,
  MdSettings,
  MdShoppingBag,
  MdShoppingCart,
  MdOutlineLocationCity,
  MdOutlineLandscape,
  MdRemoveRedEye,
  MdDelete,
  MdLocalShipping,
  MdClose,
  MdProductionQuantityLimits,
  MdPhone,
  MdBadge,
  MdLocationOn
} from 'react-icons/md'
import { IoGridSharp } from 'react-icons/io5'
import { Toaster, toast } from 'sonner'

// --- Interfaces ---
interface Order {
  id: number
  clientName: string
  clientPhone: string | null
  totalPrice: number
  totalProducts: number
  status: string
  locationToSend: string
  address: string
  dni: string | null
  createdAt: string
  user: {
    email: string
    name: string | null
  }
  orderItems: Array<{
    id: number
    quantity: number
    unitPrice: number
    producto: {
      name: string
      image: string
    }
  }>
}

interface ApiResponse {
  data: Order[]
  pagination: { total: number; page: number; totalPages: number }
}

interface KpiCardProps {
  title: string
  value: string
  trend: string
  Icon: IconType
  color: 'blue' | 'indigo' | 'purple' | 'orange'
  isNegative?: boolean
}

const paths = [
  { name: 'Dashboard', path: 'dashboard', icon: MdDashboard },
  { name: 'Órdenes', path: 'orders', icon: MdShoppingBag },
  { name: 'Productos', path: 'products', icon: MdInventory2 },
  { name: 'Configuración', path: 'settings', icon: MdSettings }
]

// --- Main Component ---
const AdminDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [pagination, setPagination] = useState({ total: 0, page: 1 })

  // Estados para Funcionalidad
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDeleting, setIsDeleting] = useState<number | null>(null)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  const fetchOrders = useCallback(async (search: string = '') => {
    setLoading(true)
    try {
      const isEmail = search.includes('@')
      const queryParam = isEmail ? `email=${search}` : `clientName=${search}`
      const response = await fetch(
        `/api/orders?limit=10&${search ? queryParam : ''}`
      )
      if (!response.ok) throw new Error('Error al obtener órdenes')
      const result: ApiResponse = await response.json()
      setOrders(result.data)
      setPagination({
        total: result.pagination.total,
        page: result.pagination.page
      })
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('No se pudieron cargar las órdenes')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => fetchOrders(searchTerm), 500)
    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm, fetchOrders])

  // --- Lógica de Cambio de Estado con Confirmación ---
  const handleStatusChange = async (id: number, newStatus: string) => {
    const confirmChange = window.confirm(
      `¿Estás seguro de cambiar el estado a "${newStatus}"?`
    )
    if (!confirmChange) return

    setIsUpdatingStatus(true)

    const updatePromise = fetch(`/api/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    }).then(async (res) => {
      if (!res.ok) throw new Error()
      return res
    })

    toast.promise(updatePromise, {
      loading: 'Actualizando estado...',
      success: () => {
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
        )
        setSelectedOrder((prev) =>
          prev ? { ...prev, status: newStatus } : null
        )
        return `Orden #${id} actualizada a ${newStatus}`
      },
      error: 'Error al actualizar el estado',
      finally: () => setIsUpdatingStatus(false)
    })
  }

  // --- Lógica de Eliminación con Toast ---
  const handleDelete = async (id: number) => {
    if (
      !confirm(
        '¿Estás seguro de eliminar esta orden? Esta acción es irreversible.'
      )
    )
      return

    setIsDeleting(id)
    try {
      const response = await fetch(`/api/orders/${id}`, { method: 'DELETE' })
      if (response.ok) {
        setOrders((prev) => prev.filter((o) => o.id !== id))
        setPagination((prev) => ({ ...prev, total: prev.total - 1 }))
        toast.success(`Orden #${id} eliminada con éxito`)
      } else {
        throw new Error()
      }
    } catch (error) {
      toast.error('No se pudo eliminar la orden')
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <div className='flex h-screen w-full overflow-hidden bg-gray-50 font-sans antialiased text-gray-900 dark:bg-gray-900 dark:text-gray-100'>
      {/* Notificaciones Toast */}
      <Toaster position='top-right' richColors />

      {/* Sidebar */}
      <aside className='hidden w-64 flex-col border-r border-gray-200 bg-white lg:flex dark:bg-gray-800 dark:border-gray-700'>
        <div className='flex h-16 items-center px-6 border-b border-gray-100 dark:border-gray-700'>
          <div className='flex items-center gap-2'>
            <IoGridSharp className='text-blue-600 text-2xl dark:text-blue-400' />
            <h1 className='text-lg font-bold tracking-tight text-gray-900 dark:text-white'>
              Admin E-com
            </h1>
          </div>
        </div>
        <div className='flex flex-1 flex-col justify-between overflow-y-auto px-4 py-6'>
          <nav className='flex flex-col gap-1'>
            {paths.map((item) => (
              <button
                key={item.name}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                  item.name === 'Órdenes'
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50'
                }`}
              >
                <item.icon size={20} />
                <span className='text-sm font-medium'>{item.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      <main className='flex flex-1 flex-col overflow-y-auto bg-gray-50 dark:bg-gray-900'>
        <div className='mx-auto flex w-full max-w-7xl flex-col gap-8 p-4 lg:p-8'>
          {/* Header & Search */}
          <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
            <div>
              <h2 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white lg:text-3xl'>
                Panel de Órdenes
              </h2>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                Gestiona las ventas y envíos de tu tienda.
              </p>
            </div>
            <div className='relative w-full sm:w-80'>
              <MdSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl dark:text-gray-500' />
              <input
                type='text'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-10 text-sm shadow-sm outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500 dark:focus:ring-blue-500/30'
                placeholder='Buscar por cliente o email...'
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400'
                >
                  <MdClose />
                </button>
              )}
            </div>
          </div>

          {/* KPI Cards */}
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            <KpiCard
              title='Ingresos'
              value={`S/ ${orders
                .reduce((acc, curr) => acc + Number(curr.totalPrice), 0)
                .toLocaleString()}`}
              trend='+12%'
              Icon={MdAttachMoney}
              color='blue'
            />
            <KpiCard
              title='Pedidos'
              value={pagination.total.toString()}
              trend='+5%'
              Icon={MdLocalShipping}
              color='indigo'
            />
            <KpiCard
              title='Items Vendidos'
              value={orders
                .reduce((acc, curr) => acc + curr.totalProducts, 0)
                .toString()}
              trend='+2%'
              Icon={MdShoppingCart}
              color='purple'
            />
            <KpiCard
              title='Pendientes'
              value={orders
                .filter((o) => o.status === 'Pendiente')
                .length.toString()}
              trend='Estable'
              Icon={MdProductionQuantityLimits}
              color='orange'
            />
          </div>

          {/* Table */}
          <div className='flex flex-col gap-4'>
            <div className='overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700'>
              <div className='overflow-x-auto'>
                <table className='w-full text-left text-sm text-gray-600 dark:text-gray-400'>
                  <thead className='bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-700/50 dark:text-gray-300'>
                    <tr>
                      <th className='px-6 py-4 font-bold'>ID</th>
                      <th className='px-6 py-4 font-bold'>Cliente</th>
                      <th className='px-6 py-4 font-bold'>Productos</th>
                      <th className='px-6 py-4 font-bold'>Destino</th>
                      <th className='px-6 py-4 font-bold'>Total</th>
                      <th className='px-6 py-4 font-bold'>Estado</th>
                      <th className='px-6 py-4 text-right font-bold'>
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-100 dark:divide-gray-700'>
                    {loading ? (
                      <tr>
                        <td colSpan={7} className='px-6 py-12 text-center'>
                          <div className='flex justify-center'>
                            <div className='h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent'></div>
                          </div>
                        </td>
                      </tr>
                    ) : orders.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className='px-6 py-12 text-center text-gray-500 dark:text-gray-400'
                        >
                          No hay órdenes.
                        </td>
                      </tr>
                    ) : (
                      orders.map((order) => (
                        <tr
                          key={order.id}
                          className={`hover:bg-gray-50/50 transition-colors group dark:hover:bg-gray-700/30 ${
                            isDeleting === order.id
                              ? 'opacity-50 pointer-events-none'
                              : ''
                          }`}
                        >
                          <td className='px-6 py-4 font-medium text-gray-900 dark:text-white'>
                            #ORD-{order.id}
                          </td>
                          <td className='px-6 py-4'>
                            <div className='flex flex-col'>
                              <span className='font-semibold text-gray-900 dark:text-white'>
                                {order.clientName}
                              </span>
                              <span className='text-xs text-gray-400 dark:text-gray-500'>
                                {order.user.email}
                              </span>
                            </div>
                          </td>
                          <td className='px-6 py-4'>
                            <div className='flex -space-x-2'>
                              {order.orderItems.slice(0, 3).map((item, i) => (
                                <img
                                  key={i}
                                  src={item.producto.image}
                                  alt={item.producto.name}
                                  className='h-8 w-8 rounded-full border-2 border-white dark:border-gray-800 object-cover shadow-sm'
                                />
                              ))}
                              {order.totalProducts > 3 && (
                                <div className='flex h-8 w-8 items-center justify-center rounded-full border-2 border-white dark:border-gray-800 bg-gray-100 dark:bg-gray-700 text-[10px] font-bold text-gray-600 dark:text-gray-300'>
                                  +{order.totalProducts - 3}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className='px-6 py-4'>
                            <div className='flex items-center gap-1.5'>
                              {order.locationToSend === 'Lima' ? (
                                <MdOutlineLocationCity className='text-blue-500 dark:text-blue-400' />
                              ) : (
                                <MdOutlineLandscape className='text-green-500 dark:text-green-400' />
                              )}
                              <span className='text-gray-700 dark:text-gray-300'>
                                {order.locationToSend}
                              </span>
                            </div>
                          </td>
                          <td className='px-6 py-4 font-bold text-gray-900 dark:text-white'>
                            S/ {Number(order.totalPrice).toFixed(2)}
                          </td>
                          <td className='px-6 py-4'>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${
                                order.status === 'Entregado'
                                  ? 'bg-emerald-100 text-green-500 dark:bg-green-600 dark:text-emerald-200'
                                  : order.status === 'Enviado'
                                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                  : order.status === 'Pagado'
                                  ? 'bg-sky-100 text-sky-700 dark:bg-sky-700/30 dark:text-sky-400'
                                  : order.status === 'Cancelado'
                                  ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                  : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' // Pendiente
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className='px-6 py-4 text-right'>
                            <div className='flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all'>
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className='p-2 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 rounded-lg transition-colors'
                              >
                                <MdRemoveRedEye size={20} />
                              </button>
                              <button
                                onClick={() => handleDelete(order.id)}
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
          </div>
        </div>
      </main>

      {/* --- MODAL DE DETALLES --- */}
      {selectedOrder && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm'>
          <div className='w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200 dark:bg-gray-800'>
            <div className='flex items-center justify-between border-b p-6 dark:border-gray-700'>
              <h3 className='text-xl font-bold dark:text-white'>
                Detalle #ORD-{selectedOrder.id}
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className='rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400'
              >
                <MdClose size={24} />
              </button>
            </div>

            <div className='overflow-y-auto p-6 flex-1'>
              <div className='mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100 dark:bg-gray-700/30 dark:border-gray-700'>
                <p className='text-xs font-bold text-gray-400 uppercase mb-3 dark:text-gray-500'>
                  Cambiar Estado
                </p>
                <div className='flex items-center gap-3'>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) =>
                      handleStatusChange(selectedOrder.id, e.target.value)
                    }
                    disabled={isUpdatingStatus}
                    className='text-sm font-bold py-2 px-4 rounded-lg border-2 border-gray-200 outline-none focus:border-blue-500 disabled:opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                  >
                    {[
                      'Pendiente',
                      'Pagado',
                      'Enviado',
                      'Entregado',
                      'Cancelado'
                    ].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  {isUpdatingStatus && (
                    <span className='text-xs animate-pulse text-blue-600 dark:text-blue-400 font-medium'>
                      Guardando...
                    </span>
                  )}
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
                <div className='space-y-3'>
                  <p className='text-xs font-bold text-gray-400 uppercase dark:text-gray-500'>
                    Cliente
                  </p>
                  <div className='flex items-center gap-2 text-sm dark:text-gray-300'>
                    <MdBadge /> {selectedOrder.clientName}
                  </div>
                  <div className='flex items-center gap-2 text-sm dark:text-gray-300'>
                    <MdPhone /> {selectedOrder.clientPhone || 'N/A'}
                  </div>
                </div>
                <div className='space-y-3'>
                  <p className='text-xs font-bold text-gray-400 uppercase dark:text-gray-500'>
                    Dirección
                  </p>
                  <div className='flex items-center gap-2 text-sm dark:text-gray-300'>
                    <MdLocationOn /> {selectedOrder.locationToSend}
                  </div>
                  <div className='text-sm text-gray-600 pl-6 dark:text-gray-400'>
                    {selectedOrder.address}
                  </div>
                </div>
              </div>

              <div className='space-y-4'>
                <p className='text-xs font-bold text-gray-400 uppercase dark:text-gray-500'>
                  Productos
                </p>
                <div className='divide-y border rounded-xl overflow-hidden dark:border-gray-700'>
                  {selectedOrder.orderItems.map((item) => (
                    <div
                      key={item.id}
                      className='flex items-center gap-4 p-3 bg-gray-50/30 dark:bg-gray-700/30'
                    >
                      <img
                        src={item.producto.image}
                        alt=''
                        className='h-12 w-12 rounded-lg object-cover border dark:border-gray-600'
                      />
                      <div className='flex-1'>
                        <p className='text-sm font-bold text-gray-800 dark:text-white'>
                          {item.producto.name}
                        </p>
                        <p className='text-xs text-gray-500 dark:text-gray-400'>
                          {item.quantity} unidades x S/{' '}
                          {Number(item.unitPrice).toFixed(2)}
                        </p>
                      </div>
                      <p className='text-sm font-bold dark:text-white'>
                        S/ {(item.quantity * Number(item.unitPrice)).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className='border-t p-6 bg-gray-50 dark:bg-gray-700/30 dark:border-gray-700 flex justify-between items-center'>
              <span className='text-2xl font-black text-blue-600 dark:text-blue-400'>
                Total: S/ {Number(selectedOrder.totalPrice).toFixed(2)}
              </span>
              <button
                onClick={() => setSelectedOrder(null)}
                className='bg-gray-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-gray-800 dark:bg-gray-700 transition-colors'
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// --- KPI Card Subcomponent ---
const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  trend,
  Icon,
  color,
  isNegative
}) => {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    indigo:
      'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
    purple:
      'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    orange:
      'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
  }
  const trendColor = isNegative
    ? 'bg-red-50 text-red-600 dark:bg-red-900/30'
    : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30'

  return (
    <div className='flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-all dark:bg-gray-800 dark:border-gray-700'>
      <div className='flex items-center justify-between'>
        <p className='text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500'>
          {title}
        </p>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${colorMap[color]}`}
        >
          <Icon size={24} />
        </div>
      </div>
      <div className='flex items-end justify-between'>
        <h3 className='text-2xl font-black text-gray-900 dark:text-white'>
          {value}
        </h3>
        <span
          className={`text-xs font-bold px-2 py-1 rounded-lg ${trendColor}`}
        >
          {trend}
        </span>
      </div>
    </div>
  )
}

export default AdminDashboard
