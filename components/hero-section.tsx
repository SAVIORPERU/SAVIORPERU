import React from 'react'
import styles from './hero-section.module.css'

const HeroSection = () => {
  return (
    <section className={styles.heroSection}>
      <div className='w-full'>
        <img
          src='/ImageLeftSide.webp'
          alt='Image 1'
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      <div className='w-full'>
        <img
          src='/ImageRightSide.webp'
          alt='Image 2'
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </section>
  )
}

export default HeroSection
