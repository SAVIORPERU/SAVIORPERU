import ProductCard from './product-card'
import styles from './featured-products.module.css'

const featuredProducts = [
  {
    id: 22,
    name: 'Casaca Negra Vintage',
    category: 'casacas',
    Estado: 'SOLO DISPONIBLE',
    size: 'M - L',
    price: 95.0,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1745107452/Casaca_vintage_lsanbz.jpg',
    image2:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1745106904/Casaca_vintage_model2_s5v1is.jpg'
  },
  {
    id: 23,
    name: 'Buso Negro Vintage',
    category: 'pantalones',
    Estado: 'SOLO DISPONIBLE',
    size: 'M - L',
    price: 75.0,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1745105793/Buso_Vintage_B_W_uuzxcd.jpg',
    image2:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1745107285/Buso_vintage_model_3_keozsp.jpg'
  },
  {
    id: 1,
    name: 'Polo Blanco Fire',
    category: 'polos',
    Estado: 'DISPONIBLE',
    size: 'S - M - L',
    price: 45.0,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1745105696/Polo_Fire_Blanco_kjlxx3.jpg',
    image2:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1745107640/Polo_fire_model_qwq22p.jpg'
  },
  {
    id: 25,
    name: 'Hoodie Negro Faith',
    category: 'casacas',
    Estado: 'NO DISPONIBLE',
    size: 'S - M - L',
    price: 120.0,
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
