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
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1746325153/IMG_8636_k9znqw.jpg'
  },
  {
    id: 23,
    name: 'Gorro Negro Choosen',
    category: 'pantalones',
    Estado: 'SOLO DISPONIBLE',
    size: 'M - L',
    price: 75.0,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1746235207/Gorro_Negro_Choosen_ychlsz.jpg',
    image2:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1746328307/IMG_8762_jpg_csherq.jpg'
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
    size: 'S - M',
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
