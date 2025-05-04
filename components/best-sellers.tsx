import ProductCard from './product-card'
import styles from './best-sellers.module.css'
import { bestSellers } from '../data/coleccion'

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
