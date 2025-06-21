'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { MdOutlinePhoneIphone, MdOutlineMailOutline } from 'react-icons/md'
import Benefits from '@/components/benefits'
import { IoBookOutline } from 'react-icons/io5'
import Link from 'next/link'

const countryCode = '51' // Código de país (cambiar según sea necesario)
const phoneNumber = '958284730'

export default function Contact() {
  const [clientName, setClientName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
    // Reset form
    setFormData({ name: '', email: '', message: '' })
  }

  const contenidoACopiar = `🚨RECLAMO🚨\nNombre: ${clientName}\nEmail: ${email}\nMensaje: ${message}`

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-8'>Contactanos</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-10'>
        {/* <div>
          <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block mb-1">
                Name
              </label>
              <Input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="email" className="block mb-1">
                Email
              </label>
              <Input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="message" className="block mb-1">
                Message
              </label>
              <Textarea id="message" name="message" value={formData.message} onChange={handleChange} required />
            </div>
            <Button type="submit">Send Message</Button>
          </form>
        </div> */}
        <div>
          <h2 className='text-2xl font-semibold mb-4'>
            Informacion de contacto
          </h2>
          <p className='mb-2 flex gap-2 items-center'>
            <MdOutlineMailOutline />: Saviorstore.pe@gmail.com
          </p>
          <p className='mb-2 flex gap-2 items-center'>
            <MdOutlinePhoneIphone />: 958284730
          </p>
          <h3 className='text-xl font-semibold mt-6 mb-2'>Horio de atencion</h3>
          <p className='mb-1'>Lunes a Viernes: 9:00 AM - 6:00 PM</p>
          <p className='mb-1'>Sabado y Domingo: 10:00 AM - 4:00 PM</p>
          {/* <p>Sunday: Closed</p> */}
        </div>
        <form className='flex flex-col'>
          <h2 className='flex items-center gap-2 text-2xl font-semibold mb-4'>
            <IoBookOutline /> Libro de Reclamaciones
          </h2>
          {/* <label htmlFor='name'>Nombre</label>
          <input
            type='text'
            name='name'
            id='name'
            className='outline outline-1 outline-gray-400 rounded py-1 px-2 mb-2'
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            name='email'
            id='email'
            className='outline outline-1 outline-gray-400 rounded py-1 px-2 mb-2'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor='complaints'>Reclamo</label>
          <textarea
            name='complaints '
            id='complaints'
            className='outline outline-1 outline-gray-400 rounded py-1 px-2 mb-2'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea> */}
          <ul className='list-decimal flex justify-start flex-col pl-5'>
            <li>
              Haz clic en el botón de abajo para descargar el formulario PDF .
            </li>
            <li>Una vez descargado, puedes:</li>
            <ul className='list-disc pl-5'>
              <li>
                Imprimirlo , rellenarlo a mano, tomarle una foto o escanearlo, y
                enviarlo por correo a:{' '}
                <strong>Saviorstore.pe@gmail.com.</strong>
              </li>
              <li>
                O rellenarlo digitalmente desde tu dispositivo usando cualquier
                app de PDF, y luego enviarlo al mismo correo:{' '}
                <strong>Saviorstore.pe@gmail.com.</strong>
              </li>
            </ul>
            <li>¡Listo! Nos pondremos en contacto contigo pronto.</li>
          </ul>
          <button className='rounded pt-5'>
            <Link
              href={`https://cdn.www.gob.pe/uploads/document/file/3510113/Anexo%20I%20DS%20N%20101-2022-PCM_.pdf.pdf`}
              style={{
                backgroundColor: 'black'
              }}
              className='linkWhatsapp'
              target='_blank'
            >
              Descargar Formato PDF
              {/* <img
                src='/BlackWhatsApp.svg'
                alt='whatappicon'
                className='h-8 [filter:brightness(0)_invert(1)]'
              /> */}
            </Link>
          </button>
        </form>
      </div>
      <Benefits />
    </div>
  )
}
