import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import InteractiveMap from './Maps/Maps'
import { X } from 'lucide-react'
import './ShoppingCartPanel.css'
import { agencias } from '../data/agencias'
import { codigoCupon } from '../data/cupon'
import { minimoDelivery, maximoDelivery } from '../data/agencias'

interface ProsItemsProduct {
  id: number
  name: string
  price: number
  image: string
  quantity: number
  size?: string
}

interface IProps {
  clientName: string
  setClientName: (value: string) => void
  address: string
  setAddress: (value: string) => void
  deliveryCost: number
  setDeliveryCost: (value: number) => void
  getDiscount: () => string | number
  setShowCardClientName: (value: boolean) => void
  countryCode: string
  phoneNumber: string
  setLocationToSend: (value: string) => void
  locationToSend: string
  agencia: string
  setAgencia: (value: string) => void
  itemsProducts: ProsItemsProduct[]
  disctount: string
}

const FormToSend = ({
  clientName,
  setClientName,
  address,
  setAddress,
  deliveryCost,
  setDeliveryCost,
  getDiscount,
  setShowCardClientName,
  countryCode,
  phoneNumber,
  setLocationToSend,
  locationToSend,
  agencia,
  setAgencia,
  itemsProducts,
  disctount
}: IProps) => {
  useEffect(() => {
    return () => {
      setClientName('')
      setAddress('')
      setLocationToSend('')
      setAgencia('')
    }
  }, [])
  const [getlocation, setGetlocation] = useState({
    lat: 0,
    lng: 0
  })
  const [dni, setDni] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const selectDelivery = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value)
    setLocationToSend(event.target.value)
    setAddress('')
    setDeliveryCost(0)
  }

  const calculateTotal = () => {
    const total =
      Number(getDiscount()) > 150
        ? Number(getDiscount())
        : locationToSend === 'provincia'
        ? Number(getDiscount()).toFixed(2)
        : deliveryCost === 0
        ? Number(getDiscount()).toFixed(2)
        : deliveryCost < minimoDelivery
        ? (Number(getDiscount()) + minimoDelivery).toFixed(2)
        : (Number(getDiscount()) + deliveryCost).toFixed(2)

    return total
  }

  const calculateDelivery = () => {
    if (locationToSend === 'provincia') {
      const deliveryCalculate = 'Recargo segun agencia (S/ 10.00 - S/ 5.00)'
      return deliveryCalculate
    }
    const deliveryCalculate =
      Number(getDiscount()) > 150
        ? 0
        : deliveryCost > 0 && deliveryCost < minimoDelivery
        ? minimoDelivery
        : deliveryCost > maximoDelivery
        ? maximoDelivery
        : deliveryCost
    return deliveryCalculate
  }

  const contenidoACopiar = `🙍🏻Cliente: ${clientName}.
${
  locationToSend === 'provincia'
    ? `🪪DNI: ${dni}.
📞Telefono: ${clientPhone}.
📍Departamento/Provincia: ${address}.
🚌Agencia: ${agencia}.`
    : `📍Dirección: ${address}.`
}

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
${agencia === 'provincia' ? '🏍️' : '🚚'}Delivery: ${calculateDelivery()}
${
  disctount === codigoCupon
    ? `🏷️Descuento:15% 
💰Subtotal: S/ ${getDiscount()}.`
    : `💰Subtotal: S/ ${getDiscount()}`
}
✅TOTAL: ${calculateTotal()}

${
  getlocation.lat
    ? `📍Ubicación: https://www.google.com/maps?q=${getlocation.lat},${getlocation.lng}&z=17&hl=es}`
    : ''
}
`

  const colorBoton = () => {
    if (locationToSend === 'provincia') {
      if (
        agencia === '' ||
        !dni ||
        !clientPhone ||
        clientName.length < 3 ||
        address.length < 3
      ) {
        return false
      } else {
        return true
      }
    } else {
      if (clientName.length < 3 || address.length < 3 || !deliveryCost) {
        return false
      } else {
        return true
      }
    }
  }

  return (
    <main
      className='cardFormCaontainer'
      onClick={() => {
        setShowCardClientName(false)
        setClientName('')
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <form className='formContainer' onClick={(e) => e.stopPropagation()}>
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
        <div className='flex flex-col gap-2 justify-center text-sm'>
          <label className='labelClientName'>
            ¿Dónde deseas recibir tu pedido?*
          </label>

          <label className='flex items-center'>
            <input
              type='radio'
              name='delivery'
              value='lima_metropolitana'
              checked={locationToSend === 'lima_metropolitana'}
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
              checked={locationToSend === 'provincia'}
              onChange={selectDelivery}
              className='mr-1'
            />{' '}
            Fuera de Lima (envío por agencia)
          </label>
        </div>

        {locationToSend === 'lima_metropolitana' ? (
          <>
            <div className='w-full h-full pb-4'>
              <label className='labelClientName'>Marca tu ubicación 📍*</label>
              <InteractiveMap
                setDeliveryCost={setDeliveryCost}
                setGetlocation={setGetlocation}
              />
            </div>
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
          </>
        ) : locationToSend === 'provincia' ? (
          <>
            <div className='flex flex-col'>
              <label className='labelClientName'>Seleccionar Agencia*</label>
              <select
                name='agencia'
                id='agencia'
                value={agencia}
                onChange={(event) => {
                  setAgencia(event.target.value)
                }}
                className={`rounded-md border focus:border-green-500 outline-none mt-1 ${
                  agencia === '' ? 'text-gray-400' : 'text-zinc-900'
                } h-11 p-2 ${
                  agencia === '' ? 'border-orange-400' : 'bg-white'
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
              <div>
                <label className='labelClientName'>DNI*</label>
                <input
                  className='inputinputClientName'
                  id='inputName'
                  placeholder='Ingrese su DNI'
                  onChange={(event) => {
                    setDni(event.target.value)
                  }}
                  value={dni}
                />
              </div>
              <div>
                <label className='labelClientName'>Telefono*</label>
                <input
                  className='inputinputClientName'
                  id='inputName'
                  placeholder='Ingrese su telefono'
                  onChange={(event) => {
                    setClientPhone(event.target.value)
                  }}
                  value={clientPhone}
                />
              </div>
            </div>
            <div>
              <label htmlFor='inputName' className='labelClientName'>
                📍Departamento/Provincia*
              </label>
              <input
                className='inputinputClientName'
                id='inputName'
                placeholder='Escribe el Departamento y Provincia'
                onChange={(event) => {
                  setAddress(event.target.value)
                }}
                value={address}
              />
            </div>
          </>
        ) : (
          <></>
        )}
        {/* )} */}

        <div
          className={`border ${
            !colorBoton() ? 'border-orange-600' : 'border-green-500'
          } px-2 py-1 rounded-sm`}
        >
          <div
            className={
              Number(getDiscount()) > 150
                ? 'text-green-500'
                : !colorBoton()
                ? 'text-orange-500'
                : 'text-green-500'
            }
          >
            <span>Delivery: </span>
            {locationToSend === 'provincia' ? (
              <span>Recargo segun agencia {'(S/ 10.00 - S/ 5.00)'}</span>
            ) : (
              <span>S/{calculateDelivery()}.00</span>
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

        <button
          style={{
            pointerEvents: colorBoton() === false ? 'none' : 'auto'
          }}
        >
          <Link
            href={`https://wa.me/+${countryCode}${phoneNumber}?text=${encodeURIComponent(
              contenidoACopiar
            )}`}
            style={{
              backgroundColor: colorBoton() === false ? 'gray' : '#00d95f'
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
    </main>
  )
}

export default FormToSend
