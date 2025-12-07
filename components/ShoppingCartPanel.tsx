'use client'

import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import './ShoppingCartPanel.css'
import { useEffect, useState } from 'react'
import { codigoCupon, mostrarCupon } from '../data/cupon'

import { LatLng } from 'leaflet'
import FormToSend from './formToSend'
import { useUser } from '@clerk/nextjs'

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
  const [locationToSend, setLocationToSend] = useState('')
  const [deliveryCost, setDeliveryCost] = useState(0)
  const [agencia, setAgencia] = useState('')

  const { user } = useUser()

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

  const getDiscount = () => {
    if (disctount === codigoCupon) {
      const calculateDiscount = ((getCartTotal() * 85) / 100).toFixed(2)
      return (Math.round(Number(calculateDiscount) * 10) / 10).toFixed(2)
    }
    return getCartTotal().toFixed(2)
  }

  const countryCode = '51' // Código de país (cambiar según sea necesario)
  const phoneNumber = '958284730'

  const handleLocationSelect = (location: LatLng) => {
    setLocation(location)
    // Aquí puedes enviar los datos al backend o almacenarlos en el estado global.
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className='fixed inset-0 bg-black bg-opacity-50 z-auto'
        onClick={onClose}
      >
        {/* Cart Panel */}
        <div className='cartPanel' onClick={(e) => e.stopPropagation()}>
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
        </div>
        {showCardClientName && (
          <FormToSend
            userName={user?.fullName || ''}
            clientName={clientName}
            setClientName={setClientName}
            address={address}
            setAddress={setAddress}
            deliveryCost={deliveryCost}
            setDeliveryCost={setDeliveryCost}
            getDiscount={getDiscount}
            setShowCardClientName={setShowCardClientName}
            countryCode={countryCode}
            phoneNumber={phoneNumber}
            setLocationToSend={setLocationToSend}
            locationToSend={locationToSend}
            agencia={agencia}
            setAgencia={setAgencia}
            itemsProducts={itemsProducts}
            disctount={disctount}
          />
        )}
      </div>
    </>
  )
}
