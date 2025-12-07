'use client'

import React, { useState, ChangeEvent, FormEvent } from 'react'
import InteractiveMap from './Maps/Maps'

// --- Definición del Enum y Tipos ---

/**
 * El enum en TypeScript que refleja tu modelo.
 */
enum DeliveryLocation {
  Lima = 'Lima',
  Provincia = 'Provincia',
  Null = 'Null' // Usado para el estado inicial/no seleccionado
}

/**
 * Interfaz para el estado del formulario, basada en tu modelo User.
 */
interface UserFormData {
  deliveryLocation: DeliveryLocation

  // Campos para Lima
  location: string // Usaremos 'string' para simplificar la entrada de un JSON
  address: string

  // Campos para Provincia
  agencia: string
  dni: string
  phone: string
  department: string
}

// --- Componente de React ---

const FormularioUsuario: React.FC = () => {
  // Estado inicial del formulario
  const [formData, setFormData] = useState<UserFormData>({
    deliveryLocation: DeliveryLocation.Null,
    location: '',
    address: '',
    agencia: '',
    dni: '',
    phone: '',
    department: ''
  })

  // Estado para manejar la carga (loading) y errores
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [deliveryCost, setDeliveryCost] = useState(0)
  const [getlocation, setGetlocation] = useState({
    lat: 0,
    lng: 0
  })

  /**
   * Maneja el cambio de valor en los inputs del formulario.
   */
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    // Si el cambio es en deliveryLocation, reiniciamos los campos condicionales.
    if (name === 'deliveryLocation') {
      setFormData({
        ...formData,
        deliveryLocation: value as DeliveryLocation,
        // Reiniciar campos condicionales al cambiar la ubicación
        location: '',
        address: '',
        agencia: '',
        dni: '',
        phone: '',
        department: ''
      })
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }

  /**
   * Procesa los datos del formulario para enviarlos al backend.
   * Elimina los campos no aplicables según la ubicación de entrega.
   */
  const prepareDataForSubmission = (data: UserFormData) => {
    const { deliveryLocation, location, ...rest } = data
    const baseData = {
      deliveryLocation
    }

    if (deliveryLocation === DeliveryLocation.Lima) {
      // Campos de Lima
      return {
        ...baseData,
        location: location ? JSON.parse(location) : null, // Intenta parsear la string a JSON
        address: rest.address || null
      }
    } else if (deliveryLocation === DeliveryLocation.Provincia) {
      // Campos de Provincia
      return {
        ...baseData,
        agencia: rest.agencia || null,
        dni: rest.dni || null,
        phone: rest.phone || null,
        department: rest.department || null
      }
    } else {
      // Si no se selecciona ninguna (o Null), solo enviar los campos base
      return baseData
    }
  }

  /**
   * Maneja el envío del formulario.
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    // Preparar los datos eliminando los campos innecesarios
    const dataToSend = prepareDataForSubmission(formData)

    try {
      const response = await fetch('/api/formulario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      })

      if (!response.ok) {
        // Asume que el backend devuelve un mensaje de error en el cuerpo
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al enviar el formulario.')
      }

      // Éxito
      setSuccess(true)
      // Opcional: Reiniciar el formulario después del éxito
      //   setFormData({
      //     email: '',
      //     name: '',
      //     deliveryLocation: DeliveryLocation.Null,
      //     location: '',
      //     address: '',
      //     agencia: '',
      //     dni: '',
      //     phone: '',
      //     department: ''
      //   })
    } catch (err: any) {
      setError(err.message)
      setSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  // Determinar la ubicación seleccionada
  const isLima = formData.deliveryLocation === DeliveryLocation.Lima
  const isProvincia = formData.deliveryLocation === DeliveryLocation.Provincia

  return (
    <div
      style={{
        maxWidth: '600px',
        margin: 'auto',
        // padding: '20px',
        borderRadius: '8px'
      }}
    >
      <form onSubmit={handleSubmit}>
        {/* Campo de Selección de Ubicación (Enum) */}
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor='deliveryLocation'>Ubicación de Entrega *</label>
          <select
            id='deliveryLocation'
            name='deliveryLocation'
            value={formData.deliveryLocation}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '8px',
              boxSizing: 'border-box',
              border: '1px solid #ccc'
            }}
          >
            <option value={DeliveryLocation.Null} disabled>
              Selecciona una opción
            </option>
            <option value={DeliveryLocation.Lima}>Lima</option>
            <option value={DeliveryLocation.Provincia}>Provincia</option>
          </select>
        </div>

        {/* --- Campos CONDICIONALES para LIMA --- */}
        {isLima && (
          <fieldset>
            <div style={{ marginBottom: '10px' }}>
              <div className='w-full h-full min-h-[300px] min-w-[300px] pb-4 z-50'>
                <label className='labelClientName'>
                  Marca tu ubicación 📍*
                </label>
                <InteractiveMap
                  setDeliveryCost={setDeliveryCost}
                  setGetlocation={setGetlocation}
                />
              </div>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label htmlFor='address'>Detalles de direccion*</label>
              <input
                type='text'
                id='address'
                name='address'
                value={formData.address}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '8px',
                  boxSizing: 'border-box',
                  border: '1px solid #ccc'
                }}
                placeholder='Calle / N° de Casa / N° de Departamento'
              />
            </div>
          </fieldset>
        )}

        {/* --- Campos CONDICIONALES para PROVINCIA --- */}
        {isProvincia && (
          <fieldset
            style={{
              border: '1px solid green',
              padding: '10px',
              marginBottom: '10px'
            }}
          >
            <legend>Datos de Entrega en Provincia</legend>
            <div style={{ marginBottom: '10px' }}>
              <label htmlFor='department'>Departamento</label>
              <input
                type='text'
                id='department'
                name='department'
                value={formData.department}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '8px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label htmlFor='agencia'>Agencia de Recojo</label>
              <input
                type='text'
                id='agencia'
                name='agencia'
                value={formData.agencia}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '8px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label htmlFor='dni'>DNI</label>
              <input
                type='text'
                id='dni'
                name='dni'
                value={formData.dni}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '8px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label htmlFor='phone'>Teléfono</label>
              <input
                type='tel'
                id='phone'
                name='phone'
                value={formData.phone}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '8px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </fieldset>
        )}

        {/* Botón de Envío */}
        <button
          type='submit'
          disabled={
            loading || formData.deliveryLocation === DeliveryLocation.Null
          }
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Enviando...' : 'Enviar Formulario'}
        </button>
      </form>

      {/* Mensajes de Estado */}
      {error && (
        <p style={{ color: 'red', marginTop: '10px' }}>Error: {error}</p>
      )}
      {success && (
        <p style={{ color: 'green', marginTop: '10px' }}>
          ¡Formulario enviado con éxito!
        </p>
      )}
    </div>
  )
}

export default FormularioUsuario
