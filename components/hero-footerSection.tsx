'use client'

// import { useEffect, useState } from 'react'
import styles from './hero-footerSection.module.css'
import { useConfigData } from '@/hooks/useConfigData'
// import { imagenIzquierda } from '../data/fotosPortada'

const HeroFooterSection = () => {
  const { getImagenIzquierda } = useConfigData()
  return (
    <section className={styles.heroSection}>
      <div className='w-full'>
        <img
          src={getImagenIzquierda()}
          alt='Image 2'
          className='w-full h-full'
        />
      </div>
    </section>
  )
}

export default HeroFooterSection
