import ProductCard from './product-card'
import styles from './best-sellers.module.css'

const bestSellers = [
  {
    id: 1,
    name: 'Buso Vintage B&W',
    price: 129.99,
    image: '/Buso Vintage B&W.jpeg'
  },
  {
    id: 2,
    name: 'Casaca Vintage B&W',
    price: 79.99,
    image: '/Casaca Vintage B&W.jpeg'
  },
  {
    id: 3,
    name: 'Polo Heaven Negro',
    price: 89.99,
    image: '/Polo Heaven Negro.jpg'
  },
  {
    id: 4,
    name: 'Gorro Choosen Negro',
    price: 159.99,
    image: '/Gorro Choosen Negro.JPEG'
  }
]

export default function BestSellers() {
  return (
    <section className={styles.customWidth}>
      <h2 className={styles.h2}>Ver Colección</h2>
      <div className={styles.cardContainer}>
        {bestSellers.map((product) => (
          <ProductCard key={product.id} product={product} from='bestSellers' />
        ))}
      </div>
    </section>
  )
}
