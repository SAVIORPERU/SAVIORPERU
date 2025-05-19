'use client'

import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { X, CircleX } from 'lucide-react'
import './ShoppingCartPanel.css'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { codigoCupon, mostrarCupon } from '../data/cupon'

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

  console.log('contenidoACopiar', contenidoACopiar)

  return (
    <>
      {/* Backdrop */}
      <div
        className='fixed inset-0 bg-black bg-opacity-50 z-40'
        onClick={onClose}
      />

      {/* Cart Panel */}
      <div className='fixed inset-y-0 right-0 w-[280px] sm:w-[350px] bg-white shadow-xl px-2 py-6 transform transition-all duration-300 ease-in-out z-50 border-l'>
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
                  S/{' '}
                  {disctount === codigoCupon
                    ? ((getCartTotal() * 85) / 100).toFixed(2)
                    : getCartTotal().toFixed(2)}
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
                  Nombre
                </label>
                <input
                  className='inputinputClientName'
                  id='inputName'
                  placeholder='Ingrese su nombre...'
                  onChange={(event) => {
                    setClientName(event.target.value)
                  }}
                  value={clientName}
                />
              </div>
              <div>
                <label htmlFor='inputName' className='labelClientName'>
                  Direccion
                </label>
                <input
                  className='inputinputClientName'
                  id='inputName'
                  placeholder='Departamento / Direccion'
                  onChange={(event) => {
                    setAddress(event.target.value)
                  }}
                  value={address}
                />
              </div>
              <button
                style={{
                  pointerEvents:
                    clientName.length < 3 && address.length < 3
                      ? 'none'
                      : 'auto'
                }}
              >
                <Link
                  href={`https://wa.me/+${countryCode}${phoneNumber}?text=${encodeURIComponent(
                    contenidoACopiar
                  )}`}
                  style={{
                    backgroundColor: clientName.length < 3 ? 'gray' : '#00d95f'
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
