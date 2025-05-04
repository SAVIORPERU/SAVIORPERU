import ProductCard from './product-card'
import styles from './featured-products.module.css'
import { featuredProducts } from '../data/productosDestacadls'

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
