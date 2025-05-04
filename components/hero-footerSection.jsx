import React from 'react'
import styles from './hero-footerSection.module.css'
import { imagenIzquierda } from '../data/fotosPortada'

const HeroFooterSection = () => {
  return (
    <section className={styles.heroSection}>
      <div className='w-full'>
        <img src={imagenIzquierda} alt='Image 2' className='w-full h-full' />
      </div>
    </section>
  )
}

export default HeroFooterSection
