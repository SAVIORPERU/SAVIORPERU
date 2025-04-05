import HeroCarousel from "@/components/hero-carousel"
import Benefits from "@/components/benefits"
import FeaturedProducts from "@/components/featured-products"
import BestSellers from "@/components/best-sellers"
import Newsletter from "@/components/newsletter"

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <HeroCarousel />
      <Benefits />
      <FeaturedProducts />
      <BestSellers />
      <Newsletter />
    </div>
  )
}

