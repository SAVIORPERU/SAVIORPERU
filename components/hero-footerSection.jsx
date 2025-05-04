import React from 'react'
import styles from './hero-footerSection.module.css'

const HeroFooterSection = () => {
  return (
    <section className={styles.heroSection}>
      <div className='w-full'>
        <img
          src='https://res.cloudinary.com/dkw7q1u6z/image/upload/v1746327259/Photoroom_20250503_213845_eyndsg.jpg'
          alt='Image 2'
          className='w-full h-full'
        />
      </div>
    </section>
  )
}

export default HeroFooterSection
