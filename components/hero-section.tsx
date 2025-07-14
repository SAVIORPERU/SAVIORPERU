import React from 'react'
import styles from './hero-section.module.css'
import { imagenIzquierda, imagenDerecha } from '../data/fotosPortada'

const HeroSection = () => {
  return (
    <section className={styles.heroSection}>
      <div className='w-full'>
        <img src={imagenIzquierda} alt='Image 1' className='w-full h-full' />
      </div>
      <div className='w-full'>
        <img src={imagenDerecha} alt='Image 2' className='w-full h-full' />
      </div>
    </section>
  )
}

export default HeroSection
