import Link from 'next/link'
import React, { useEffect, useState, useCallback, use } from 'react'
import InteractiveMap from './Maps/Maps'
import { X } from 'lucide-react'
import './ShoppingCartPanel.css'
import { agencias } from '../data/agencias'
import { codigoCupon } from '../data/cupon'
import { minimoDelivery, maximoDelivery } from '../data/agencias'
import { useUser } from '@clerk/nextjs'
import { useCart } from '@/contexts/CartContext'
import { toast } from '@/hooks/use-toast'
import { ToastAction } from './ui/toast'

// --- Interfaces ---

interface ProsItemsProduct {
  id: number
  name: string
  price: number
  image: string
  quantity: number
  size?: string
}

interface IProps {
  getDiscount: () => string | number
  setShowCardClientName: (value: boolean) => void
  itemsProducts: ProsItemsProduct[]
  disctount: string
  onClose: () => void
}

interface DeliveryData {
  clientName: string
  address: string
  deliveryCost: number
  locationToSend: 'lima_metropolitana' | 'provincia' | ''
  agencia: string
  dni: string
  clientPhone: string
  getlocation: {
    lat: number
    lng: number
  }
  email?: string
}

// --- Constantes ---
const COUNTRY_CODE = '51'
const PHONE_NUMBER = '907679229'
const LOCAL_STORAGE_KEY = 'dataDeliverySend'

// Valores iniciales para el estado de la entrega
const INITIAL_DELIVERY_STATE: DeliveryData = {
  clientName: '',
  address: '',
  deliveryCost: 0,
  locationToSend: '',
  agencia: '',
  dni: '',
  clientPhone: '',
  getlocation: {
    lat: 0,
    lng: 0
  },
  email: ''
}

// --- Componente FormToSend ---

const FormToSend = ({
  getDiscount,
  setShowCardClientName,
  itemsProducts,
  disctount,
  onClose
}: IProps) => {
  const [deliveryData, setDeliveryData] = useState<DeliveryData>(
    INITIAL_DELIVERY_STATE
  )
  const [hasFullNameOverride, setHasFullNameOverride] = useState(false)
  const { user } = useUser()
  const { clearCart, getCartTotal } = useCart()

  console.log('productos', itemsProducts)

  // Función para cargar datos desde localStorage
  const loadLocalStorage = useCallback(() => {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (data) {
        const parsedData = JSON.parse(data)
        // Usar los valores existentes como fallback si faltan propiedades
        setDeliveryData((prevData) => ({
          ...prevData,
          ...parsedData,
          getlocation:
            parsedData.getlocation || INITIAL_DELIVERY_STATE.getlocation
        }))
      }
    } catch (error) {
      console.log('Error loading data from localStorage:', error)
    }
  }, [])

  // Función para guardar datos en localStorage
  const saveLocalStorage = useCallback(async () => {
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({
        ...deliveryData,
        email: user?.emailAddresses[0].emailAddress || ''
      })
    )
    if (user?.emailAddresses[0].emailAddress) {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...deliveryData,
          email: user?.emailAddresses[0].emailAddress || '',
          products: itemsProducts.map((item) => ({
            productoId: item.id,
            quantity: item.quantity,
            totalPrice: Number(item.price) * item.quantity,
            unitPrice: item.price
          })),
          totalPrice: Number(getCartTotal()),
          totalProducts: itemsProducts.reduce(
            (total, item) => total + item.quantity,
            0
          ),
          discount: disctount === codigoCupon ? 15 : 0
        })
      })
      if (!response.ok) {
        console.log('Error saving delivery data to backend')
      }
    }
  }, [deliveryData])

  useEffect(() => {
    if (user?.emailAddresses[0].emailAddress !== INITIAL_DELIVERY_STATE.email) {
    }
  }, [])

  useEffect(() => {
    // 1. Cargar datos del localStorage
    loadLocalStorage()

    // 2. Intentar establecer el nombre del usuario de Clerk si existe y no ha sido sobrescrito
    const userName = user?.fullName
    if (userName && !hasFullNameOverride) {
      setDeliveryData((prev) => ({ ...prev, clientName: userName }))
    }
  }, [user, loadLocalStorage, hasFullNameOverride])

  console.log('deliveryData =>', deliveryData)

  // Manejador de cambios genérico para el estado de la entrega
  const handleInputChange = useCallback(
    <K extends keyof DeliveryData>(key: K, value: DeliveryData[K]) => {
      setDeliveryData((prev) => ({
        ...prev,
        [key]: value
      }))
    },
    []
  )

  // Manejador de selección de tipo de envío
  const selectDelivery = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLocation = event.target.value as 'lima_metropolitana' | 'provincia'
    setDeliveryData((prev) => ({
      ...prev,
      locationToSend: newLocation,
      address: '', // Limpiar la dirección al cambiar el tipo de envío
      deliveryCost: 0, // Limpiar el costo de delivery
      agencia: newLocation === 'provincia' ? prev.agencia : '', // Limpiar agencia si no es provincia
      dni: newLocation === 'provincia' ? prev.dni : '', // Limpiar DNI si no es provincia
      clientPhone: newLocation === 'provincia' ? prev.clientPhone : '', // Limpiar teléfono si no es provincia
      email: user?.emailAddresses[0].emailAddress || '' // Actualizar email si es necesario
    }))
  }

  // Lógica de cálculo de Total
  const calculateTotal = useCallback((): string => {
    const discountAmount = Number(getDiscount())
    const { locationToSend, deliveryCost } = deliveryData

    // Si el descuento es superior a 150 (asumiendo que esto significa envío gratis o un total fijo)
    if (discountAmount > 150) {
      return discountAmount.toFixed(2)
    }

    // Para Provincia
    if (locationToSend === 'provincia') {
      // El total es solo el subtotal (el costo de envío es un recargo que paga al recibir)
      return discountAmount.toFixed(2)
    }

    // Para Lima Metropolitana
    if (deliveryCost === 0) {
      // Si el costo de delivery es 0 (ej. ubicación no marcada o gratis por subtotal > 150)
      return discountAmount.toFixed(2)
    }

    // Aplicar mínimo de delivery si el costo calculado es menor que el mínimo, o el costo calculado
    let finalDeliveryCost = deliveryCost
    if (deliveryCost > 0 && deliveryCost < minimoDelivery) {
      finalDeliveryCost = minimoDelivery
    }

    if (deliveryCost > maximoDelivery) {
      finalDeliveryCost = maximoDelivery
    }
    console.log(
      '(discountAmount + finalDeliveryCost).toFixed(2)',
      (discountAmount + finalDeliveryCost).toFixed(2)
    )
    // Sumar el costo de delivery al subtotal
    return (discountAmount + finalDeliveryCost).toFixed(2)
  }, [getDiscount, deliveryData])

  // Lógica de cálculo del Costo de Envío a mostrar
  const calculateDelivery = useCallback((): string | number => {
    const { locationToSend, deliveryCost } = deliveryData
    const discountAmount = Number(getDiscount())

    if (locationToSend === 'provincia') {
      // Mensaje fijo para provincia
      return 'Recargo segun agencia (S/ 10.00 - S/ 15.00)'
    }

    // Si el subtotal es > 150, el delivery es gratis (0)
    if (discountAmount > 150) {
      return 0
    }

    // Aplicar el mínimo si el costo calculado es menor al mínimo (y mayor a 0)
    if (deliveryCost > 0 && deliveryCost < minimoDelivery) {
      return minimoDelivery
    }

    // Si el costo calculado es mayor al máximo permitido, usar el máximo
    if (deliveryCost > maximoDelivery) {
      return maximoDelivery
    }

    // Usar el costo calculado (puede ser 0 si aún no marca ubicación)
    return deliveryCost
  }, [getDiscount, deliveryData])

  // Lógica de validación del formulario
  const isFormValid = useCallback((): boolean => {
    const {
      clientName,
      address,
      locationToSend,
      deliveryCost,
      agencia,
      dni,
      clientPhone
    } = deliveryData

    // if (clientName.length < 3 || address.length < 3) {
    //   return false // Requisito mínimo para ambos casos
    // }

    if (locationToSend === 'provincia') {
      // Requisitos adicionales para provincia
      return (
        !!agencia &&
        !!dni &&
        !!clientPhone &&
        dni.length >= 8 && // Asumiendo que DNI tiene al menos 8 dígitos
        clientPhone.length >= 7 // Asumiendo un mínimo para el teléfono
      )
    }

    // Requisitos para Lima Metropolitana
    if (locationToSend === 'lima_metropolitana') {
      // Si el subtotal es mayor a 150, el costo de delivery es 0 (gratis), entonces el único requisito es el nombre y la dirección
      if (Number(getDiscount()) > 150) {
        return true
      }
      // De lo contrario, se requiere un costo de delivery (significa que marcó ubicación)
      return deliveryCost > 0
    }

    // Si no se ha seleccionado ubicación, el formulario no es válido
    return true
  }, [deliveryData, getDiscount])

  const deliveryDisplay = calculateDelivery()

  // Generación del contenido para WhatsApp
  const generateWhatsAppContent = useCallback(() => {
    const {
      clientName,
      locationToSend,
      address,
      dni,
      clientPhone,
      agencia,
      getlocation
    } = deliveryData

    const clientInfo = `🙍🏻Cliente: ${clientName}.
${
  locationToSend === 'provincia'
    ? `🪪DNI: ${dni}.
📞Telefono: ${clientPhone}.
📍Departamento/Provincia: ${address}.
🚌Agencia: ${agencia}.`
    : `📍Dirección: ${address}.`
}`

    const productList = itemsProducts
      .map((item) => {
        const sizeInfo = item.size ? `\n↕️Talla: ${item.size}.` : ''
        return `📌Producto: ${item.name}.
#️⃣Cantidad: ${item.quantity}.${sizeInfo}
💲Precio: S/ ${Number(item.price).toFixed(2)}.
\n`
      })
      .join('')

    const shippingType = agencia === 'provincia' ? '🏍️' : '🚚'
    const deliveryLabel =
      agencia === 'provincia' ? 'Recargo de agencia' : 'Delivery'
    const deliveryPrice =
      typeof deliveryDisplay === 'number'
        ? `S/ ${deliveryDisplay.toFixed(2)}`
        : deliveryDisplay

    const discountInfo =
      disctount === codigoCupon
        ? `🏷️Descuento:15%
💰Subtotal: S/ ${getDiscount()}.`
        : `💰Subtotal: S/ ${getDiscount()}`

    const totalInfo = `✅TOTAL: S/ ${calculateTotal()}`

    const locationLink = getlocation.lat
      ? `\n📍Ubicación: http://maps.google.com/?q=${getlocation.lat},${getlocation.lng}&z=17&hl=es`
      : ''

    return `${clientInfo}
${productList}
${shippingType}${deliveryLabel}: ${deliveryPrice}
${discountInfo}
${totalInfo}${locationLink}
`
  }, [
    deliveryData,
    itemsProducts,
    disctount,
    getDiscount,
    calculateTotal,
    deliveryDisplay
  ])

  const whatsappHref = `https://wa.me/+${COUNTRY_CODE}${PHONE_NUMBER}?text=${encodeURIComponent(
    generateWhatsAppContent()
  )}`

  const buttonBackgroundColor = isFormValid() ? '#00d95f' : 'gray'
  const buttonPointerEvents = isFormValid() ? 'auto' : 'none'
  const isUserSignedIn = !!user?.id

  // Renderizado
  return (
    <main
      className='cardFormCaontainer'
      onClick={() => {
        setShowCardClientName(false)
        // No limpiar el nombre o la dirección aquí para que se mantengan si cierran
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <form className='formContainer' onClick={(e) => e.stopPropagation()}>
        {/* Nombre del Cliente */}
        <div>
          <label htmlFor='inputName' className='labelClientName'>
            Nombre*
          </label>
          <input
            className='inputinputClientName'
            id='inputName'
            placeholder='Ingrese su nombre y apellido'
            onChange={(event) => {
              if (!hasFullNameOverride) {
                setHasFullNameOverride(true)
              }
              handleInputChange('clientName', event.target.value)
            }}
            value={deliveryData.clientName}
          />
        </div>

        {/* Selección de Tipo de Envío */}
        <div className='flex flex-col gap-2 justify-center text-sm'>
          <label className='labelClientName'>
            ¿Dónde deseas recibir tu pedido?*
          </label>
          <label className='flex items-center'>
            <input
              type='radio'
              name='delivery'
              value='lima_metropolitana'
              checked={deliveryData.locationToSend === 'lima_metropolitana'}
              onChange={selectDelivery}
              className='mr-1'
            />{' '}
            Lima Metropolitana (delivery motorizado)
          </label>
          <label className='flex items-center'>
            <input
              type='radio'
              name='delivery'
              value='provincia'
              checked={deliveryData.locationToSend === 'provincia'}
              onChange={selectDelivery}
              className='mr-1'
            />{' '}
            Fuera de Lima (envío por agencia)
          </label>
        </div>

        {/* Formulario Dinámico según Tipo de Envío */}
        {deliveryData.locationToSend === 'lima_metropolitana' && (
          <>
            {/* Mapa de Ubicación */}
            <div className='w-full h-full pb-4'>
              <label className='labelClientName'>Marca tu ubicación 📍*</label>
              <InteractiveMap
                setDeliveryCost={(cost: number) =>
                  handleInputChange(
                    'deliveryCost',
                    cost < minimoDelivery ? minimoDelivery : cost
                  )
                }
                setGetlocation={(loc: { lat: number; lng: number }) =>
                  handleInputChange('getlocation', loc)
                }
                locationToSend={deliveryData.getlocation}
              />
            </div>
            {/* Detalles de Dirección */}
            <div>
              <label htmlFor='inputAddress' className='labelClientName'>
                Direccion exacta*
              </label>
              <input
                className='inputinputClientName'
                id='inputAddress'
                placeholder='Calle / N° de Casa / N° de Departamento'
                onChange={(event) =>
                  handleInputChange('address', event.target.value)
                }
                value={deliveryData.address}
              />
            </div>
          </>
        )}

        {deliveryData.locationToSend === 'provincia' && (
          <>
            <div className='flex flex-col'>
              {/* Selección de Agencia */}
              <label className='labelClientName'>Seleccionar Agencia*</label>
              <select
                name='agencia'
                id='agencia'
                value={deliveryData.agencia}
                onChange={(event) =>
                  handleInputChange('agencia', event.target.value)
                }
                className={`rounded-md border focus:border-green-500 outline-none mt-1 ${
                  deliveryData.agencia === ''
                    ? 'text-gray-400'
                    : 'text-zinc-900'
                } h-11 p-2 ${
                  deliveryData.agencia === '' ? 'border-orange-400' : 'bg-white'
                }`}
              >
                <option value='' disabled>
                  Seleccionar agencia
                </option>
                {agencias.map((eleAgencia) => (
                  <option
                    key={eleAgencia}
                    value={eleAgencia}
                    className='text-black'
                  >
                    {eleAgencia}
                  </option>
                ))}
              </select>

              {/* DNI */}
              <div>
                <label className='labelClientName'>DNI*</label>
                <input
                  className='inputinputClientName'
                  placeholder='Ingrese su DNI'
                  onChange={(event) =>
                    handleInputChange('dni', event.target.value)
                  }
                  value={deliveryData.dni}
                />
              </div>

              {/* Teléfono */}
              <div>
                <label className='labelClientName'>Telefono*</label>
                <input
                  className='inputinputClientName'
                  placeholder='Ingrese su telefono'
                  onChange={(event) =>
                    handleInputChange('clientPhone', event.target.value)
                  }
                  value={deliveryData.clientPhone}
                />
              </div>
            </div>

            {/* Departamento/Provincia (Dirección de Envío) */}
            <div>
              <label htmlFor='inputDeptProv' className='labelClientName'>
                📍Departamento/Provincia*
              </label>
              <input
                className='inputinputClientName'
                id='inputDeptProv'
                placeholder='Escribe el Departamento y Provincia'
                onChange={(event) =>
                  handleInputChange('address', event.target.value)
                }
                value={deliveryData.address}
              />
            </div>
          </>
        )}

        {/* Resumen de Costos */}
        <div
          className={`border ${
            !isFormValid() ? 'border-orange-600' : 'border-green-500'
          } px-2 py-1 rounded-sm`}
        >
          <div
            className={
              Number(getDiscount()) > 150
                ? 'text-green-500'
                : !isFormValid()
                ? 'text-orange-500'
                : 'text-green-500'
            }
          >
            {deliveryData.locationToSend === 'provincia' ? (
              <span>Recargo de agencia: {'(S/ 10.00 - S/ 15.00)'}</span>
            ) : (
              <>
                <span>Delivery: </span>
                <span>
                  S/
                  {typeof deliveryDisplay === 'number'
                    ? deliveryDisplay.toFixed(2)
                    : deliveryDisplay}
                </span>
              </>
            )}
          </div>
          <div>
            <span>Subtotal: </span>
            <span>S/ {getDiscount()}</span>
          </div>
          <div className='font-bold text-lg'>
            <span>Total: </span>
            <span>S/ {calculateTotal()}</span>
          </div>
        </div>

        {/* Botón de Realizar Pedido (WhatsApp) */}
        <button
          style={{ pointerEvents: buttonPointerEvents }}
          onClick={() => {
            saveLocalStorage()
            onClose()
          }}
          title='Completa los datos para enviar'
        >
          {isUserSignedIn ? (
            <Link
              href={whatsappHref}
              style={{ backgroundColor: buttonBackgroundColor }}
              className='linkWhatsapp'
              onClick={() => {
                setShowCardClientName(false)
                clearCart()
                toast({
                  title: 'Pedido enviado con éxito',
                  description: 'Revisa tu pedido aquí',
                  action: (
                    <ToastAction
                      altText='Ver detalles'
                      onClick={() => console.log('exito')}
                    >
                      Ver detalles
                    </ToastAction>
                  ),
                  duration: 10000
                })
              }}
              target='_blank'
            >
              Realizar pedido{' '}
              <img
                src='/BlackWhatsApp.svg'
                alt='whatsapp icon'
                className='h-8 [filter:brightness(0)_invert(1)]'
              />
            </Link>
          ) : (
            <Link href={'/sign-in'} className='linkWhatsapp'>
              👉 Inicia sesión para realizar tu pedido 👈
            </Link>
          )}
        </button>

        {/* Botón de Cerrar */}
        <button
          className='buttonCloseCardClientName'
          onClick={() => setShowCardClientName(false)}
        >
          <X color='gray' />
        </button>
      </form>
    </main>
  )
}

export default FormToSend
