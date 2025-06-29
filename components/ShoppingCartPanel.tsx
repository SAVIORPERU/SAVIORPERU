'use client'

import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { X, CircleX } from 'lucide-react'
import './ShoppingCartPanel.css'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { codigoCupon, mostrarCupon } from '../data/cupon'
import dynamic from 'next/dynamic'

import InteractiveMap from './Maps/Maps'
import { LatLng } from 'leaflet'

interface ShoppingCartPanelProps {
  isOpen: boolean
  onClose: () => void
}

interface ProsItemsProduct {
  id: number
  name: string
  price: number
  image: string
  quantity: number
  size?: string
}

export default function ShoppingCartPanel({
  isOpen,
  onClose
}: ShoppingCartPanelProps) {
  const { cartItems, removeFromCart, clearCart, getCartTotal } = useCart()
  const [itemsProducts, setItemsProducts] = useState<ProsItemsProduct[]>([])
  const [showCardClientName, setShowCardClientName] = useState(false)
  const [clientName, setClientName] = useState('')
  const [address, setAddress] = useState('')
  const [disctount, setDiscount] = useState('')
  const [location, setLocation] = useState<LatLng | null>(null)
  const [showMap, setShowMap] = useState(false)
  const [deliveryCost, setDeliveryCost] = useState(0)

  useEffect(() => {
    setItemsProducts(
      cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
        size: item.size
      }))
    )
  }, [cartItems])

  if (!isOpen) return null

  const contenidoACopiar = `🙍🏻Cliente: ${clientName}.
📍Dirección: ${address}.

  ${itemsProducts
    .map((item) => {
      if (item.size) {
        return `📌Producto: ${item.name}.
#️⃣Cantidad: ${item.quantity}.
↕️Talla: ${item.size}.
💲Precio: S/ ${item.price.toFixed(2)}.
    \n`
      } else {
        return `📌Producto: ${item.name}.
#️⃣Cantidad: ${item.quantity}.
💲Precio: S/ ${item.price.toFixed(2)}.
    \n`
      }
    })
    .join('')}
${
  disctount === codigoCupon
    ? `🏷️Descuento:15% 
💰Total: S/ ${((getCartTotal() * 85) / 100).toFixed(2)}.`
    : `💰Total: S/ ${getCartTotal().toFixed(2)}`
}
`
  const countryCode = '51' // Código de país (cambiar según sea necesario)
  const phoneNumber = '958284730'

  const handleLocationSelect = (location: LatLng) => {
    setLocation(location)
    // Aquí puedes enviar los datos al backend o almacenarlos en el estado global.
  }

  const getDiscount = () => {
    if (disctount === codigoCupon) {
      return ((getCartTotal() * 85) / 100).toFixed(2)
    }
    return getCartTotal().toFixed(2)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className='fixed inset-0 bg-black bg-opacity-50 z-auto'
        onClick={onClose}
      />

      {/* Cart Panel */}
      <div className='cartPanel'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-xl font-semibold text-gray-800'>Tu Carrito</h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100'
          >
            <X size={24} />
          </button>
        </div>
        {cartItems.length === 0 ? (
          <p className='text-gray-500 text-center py-8'>
            Tu carrito está vacío
          </p>
        ) : (
          <>
            <ul className='space-y-6 mb-6'>
              {cartItems.map((item) => (
                <li key={item.id} className={'shoppingCartItem'}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className='imageCartPanel'
                  />
                  <div className='containerItemTitleCartPanel'>
                    <span className='font-medium text-gray-800'>
                      {item.name}
                    </span>
                    <span>{item.size}</span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className='text-gray-400 hover:text-red-500 transition-colors duration-200 p-1 rounded-full hover:bg-gray-200'
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className='containerItemPriceCuantitiCartPanel'>
                    <span className='text-gray-600'>
                      Cantidad: {item.quantity}
                    </span>
                    <span className='font-medium text-gray-800'>
                      S/ {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            <div className='border-t border-gray-200 pt-4 mb-6'>
              {mostrarCupon && (
                <>
                  <div className='flex mb-2 justify-center'>
                    <span className='text-gray-600'>Cupon:</span>
                    <input
                      type='text'
                      placeholder='Cupon de descuento...'
                      className='text-sm w-full p-1 outline outline-1 border-0 rounded ml-2 outline-gray-300'
                      value={disctount}
                      onChange={(event) => {
                        setDiscount(event.target.value)
                      }}
                    />
                  </div>
                  <div
                    className={`flex justify-between text-sm ${
                      disctount === codigoCupon
                        ? 'text-red-400'
                        : 'text-gray-600'
                    }`}
                  >
                    <span>Descuento:</span>
                    <span>{disctount === codigoCupon ? '-15%' : '0%'}</span>
                  </div>
                </>
              )}

              <div className='flex justify-between items-center mb-4'>
                <span className='text-gray-600'>Subtotal:</span>
                <span className='text-xl font-semibold text-gray-800'>
                  S/ {getDiscount()}
                </span>
              </div>
              <div
                className={`flex justify-between text-xs ${
                  disctount === codigoCupon ? 'text-red-400' : 'text-gray-600'
                } bg-green-100 rounded py-2 px-4 mb-2 border border-green-300`}
              >
                <span>
                  Delivery gratuito solo para compras mayores a S/.150.00
                </span>
              </div>
            </div>
            <div className='space-y-3'>
              <Button
                onClick={clearCart}
                variant='outline'
                className='w-full hover:bg-gray-100 transition-colors duration-200'
              >
                Limpiar Carrito
              </Button>
              <button
                style={{ backgroundColor: '#262626', marginTop: '10px' }}
                className='buttonShowCardClientName'
                onClick={() => setShowCardClientName(true)}
              >
                Continuar
              </button>
            </div>
          </>
        )}
        {showCardClientName && (
          <div
            className='cardFormCaontainer'
            onClick={() => {
              setShowCardClientName(false)
              setClientName('')
            }}
          >
            <form
              className='formContainer'
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <label htmlFor='inputName' className='labelClientName'>
                  Nombre*
                </label>
                <input
                  className='inputinputClientName'
                  id='inputName'
                  placeholder='Ingrese su nombre y apellido'
                  onChange={(event) => {
                    setClientName(event.target.value)
                  }}
                  value={clientName}
                />
              </div>

              {/* <Button
                onClick={() => setShowMap(true)}
                variant='outline'
                className='w-full hover:bg-gray-100 transition-colors duration-200'
              >
                Seleccionar ubicación
              </Button>
              {showMap && ( */}
              <div className='w-full h-[300px] sm:h-[400px] pb-4'>
                <label className='labelClientName'>
                  Marca tu ubicación 📍*
                </label>
                <InteractiveMap setDeliveryCost={setDeliveryCost} />
              </div>
              {/* )} */}
              <div>
                <label htmlFor='inputName' className='labelClientName'>
                  Detalles de direccion*
                </label>
                <input
                  className='inputinputClientName'
                  id='inputName'
                  placeholder='Calle / N° de Casa / N° de Departamento'
                  onChange={(event) => {
                    setAddress(event.target.value)
                  }}
                  value={address}
                />
              </div>

              <div
                className={`border ${
                  clientName.length < 3 || address.length < 3 || !deliveryCost
                    ? 'border-orange-600'
                    : 'border-green-500'
                } px-2 py-1 rounded-sm`}
              >
                <div
                  className={
                    clientName.length < 3 || address.length < 3 || !deliveryCost
                      ? 'text-orange-500'
                      : 'text-green-500'
                  }
                >
                  <span>Costo Delivery: </span>
                  <span>S/ {deliveryCost < 7 ? 7 : deliveryCost}.00</span>
                </div>
                <div>
                  <span>Subtotal: </span>
                  <span>S/ {getDiscount()}</span>
                </div>
                <div className='font-bold text-lg'>
                  <span>Total: </span>
                  <span>
                    S/ {(Number(getDiscount()) + deliveryCost).toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                style={{
                  pointerEvents:
                    clientName.length < 3 || address.length < 3 || !deliveryCost
                      ? 'none'
                      : 'auto'
                }}
              >
                <Link
                  href={`https://wa.me/+${countryCode}${phoneNumber}?text=${encodeURIComponent(
                    contenidoACopiar
                  )}`}
                  style={{
                    backgroundColor:
                      clientName.length < 3 ||
                      address.length < 3 ||
                      !deliveryCost
                        ? 'gray'
                        : '#00d95f'
                  }}
                  className='linkWhatsapp'
                >
                  Realizar pedido{' '}
                  <img
                    src='/BlackWhatsApp.svg'
                    alt='whatappicon'
                    className='h-8 [filter:brightness(0)_invert(1)]'
                  />
                </Link>
              </button>
              <button
                className='buttonCloseCardClientName'
                onClick={() => {
                  setShowCardClientName(false)
                  setClientName('')
                }}
              >
                <X color='gray' />
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  )
}
