import ProductCard from './product-card'
import styles from './featured-products.module.css'

const featuredProducts = [
  {
    id: 1,
    name: 'Casaca Negra Vintage',
    color: 'Blanco',
    price: 95,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1745107452/Casaca_vintage_lsanbz.jpg',
    image2:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1745106904/Casaca_vintage_model2_s5v1is.jpg'
  },
  {
    id: 2,
    name: 'BUSO NEGRO VINTAGE',
    price: 75,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1745105793/Buso_Vintage_B_W_uuzxcd.jpg',
    image2:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1745107285/Buso_vintage_model_3_keozsp.jpg'
  },
  {
    id: 3,
    name: 'Polo Fire Blanco',
    price: 45,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1745105696/Polo_Fire_Blanco_kjlxx3.jpg',
    image2:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1745107640/Polo_fire_model_qwq22p.jpg'
  },
  {
    id: 4,
    name: 'Hoodie Faith Negro',
    price: 120,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1745108612/Polera_Faith_vqggss.jpg',
    image2:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1745108631/Polera_Faith_model_z4zkmi.jpg'
  }
]

export default function FeaturedProducts() {
  return (
    <section className={styles.customWidth}>
      <h2 className={styles.h2}>Productos Destacados</h2>
      <div className={styles.cardContainer}>
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} from='featured' />
        ))}
      </div>
    </section>
  )
}
