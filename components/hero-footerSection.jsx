import React from 'react'
import styles from './hero-footerSection.module.css'

const HeroFooterSection = () => {
  return (
    <section className={styles.heroSection}>
      <div className='w-full'>
        <img
          src='/ImageLeftSide.webp'
          alt='Image 2'
          className='w-full h-full'
        />
      </div>
    </section>
  )
}

export default HeroFooterSection
