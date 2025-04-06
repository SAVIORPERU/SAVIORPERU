import HeroCarousel from '@/components/hero-carousel'
import Benefits from '@/components/benefits'
import FeaturedProducts from '@/components/featured-products'
import BestSellers from '@/components/best-sellers'
import Newsletter from '@/components/newsletter'
import HeroSection from '@/components/hero-section'

export default function Home() {
  return (
    <div className='container'>
      {/* <HeroCarousel /> */}
      <HeroSection />
      {/* <Benefits /> */}
      <FeaturedProducts />
      <BestSellers />
      {/* <Newsletter /> */}
    </div>
  )
}
