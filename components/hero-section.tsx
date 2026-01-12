'use client'

import React from 'react'
import styles from './hero-section.module.css'
import { useConfigData } from '@/hooks/useConfigData'

const HeroSection = () => {
  const { getImagenDerecha, getImagenIzquierda } = useConfigData()
  return (
    <section className={styles.heroSection}>
      <div className='w-full'>
        <img
          src={getImagenIzquierda()}
          alt='Image 1'
          className='w-full h-full'
        />
      </div>
      <div className='w-full'>
        <img src={getImagenDerecha()} alt='Image 2' className='w-full h-full' />
      </div>
    </section>
  )
}

export default HeroSection
