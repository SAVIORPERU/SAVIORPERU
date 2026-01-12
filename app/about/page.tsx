'use client'

// import { useEffect, useState } from 'react'
import { useConfigData } from '@/hooks/useConfigData'
import { useEffect, useState } from 'react'

export default function About() {
  const { getFotoTienda, isMounted } = useConfigData()
  const [imageSrc, setImageSrc] = useState('/CargandoImagen.png')

  // 🟢 Actualizar la imagen solo cuando esté montado y disponible
  useEffect(() => {
    if (isMounted) {
      const newSrc = getFotoTienda()
      if (newSrc && newSrc !== '/CargandoImagen.png') {
        setImageSrc(newSrc)
      }
    }
  }, [isMounted, getFotoTienda])

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-8'>Sobre Nosotros</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 items-center'>
        <div>
          <p className='mb-4'>
            Savior es una marca de ropa comprometida con ofrecer prendas de alta
            calidad y estilo único que reflejan la personalidad de nuestros
            clientes. Desde nuestro inicio, nos hemos dedicado a crear
            colecciones que combinan tendencias actuales con un estilo
            atemporal.
          </p>
          <p className='mb-4'>
            Nuestro compromiso con la calidad se refleja en cada detalle, desde
            la selección de los mejores materiales hasta el acabado final de
            cada prenda. Creemos que la ropa no es solo una necesidad, sino una
            forma de expresión que permite a cada persona mostrar su verdadera
            esencia.
          </p>
        </div>
        <div className='relative min-h-96 max-h-[500px] md:h-full flex justify-center'>
          <img
            src={imageSrc || '/CargandoImagen.png'}
            alt='Savior Showroom'
            className='object-cover rounded-lg max-h-[500px]'
          />
        </div>
      </div>
      <h2 className='text-2xl font-bold mt-12 mb-6'>Nuestros Valores</h2>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        <div className='bg-primary-foreground p-6 rounded-lg'>
          <h3 className='text-xl font-semibold mb-2'>Calidad</h3>
          <p>
            Seleccionamos cuidadosamente nuestros materiales y procesos de
            confección para garantizar prendas duraderas.
          </p>
        </div>
        <div className='bg-primary-foreground p-6 rounded-lg'>
          <h3 className='text-xl font-semibold mb-2'>Estilo</h3>
          <p>
            Nuestros diseños se inspiran en las últimas tendencias mientras
            mantienen una elegancia atemporal.
          </p>
        </div>
        <div className='bg-primary-foreground p-6 rounded-lg'>
          <h3 className='text-xl font-semibold mb-2'>Sostenibilidad</h3>
          <p>
            Nos comprometemos con prácticas de producción éticas y la reducción
            de nuestro impacto ambiental.
          </p>
        </div>
      </div>
    </div>
  )
}
