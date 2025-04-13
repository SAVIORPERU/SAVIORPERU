import ProductCard from './product-card'
import styles from './featured-products.module.css'

const featuredProducts = [
  {
    id: 1,
    name: 'Polo Fire Blanco',
    color: 'Blanco',
    price: 129.99,
    image: '/Polo Fire Blanco.jpg'
    // image2: '/casaca negra no edit.jpg'
  },
  {
    id: 2,
    name: 'Polo Forgiven Jade',
    price: 79.99,
    image: '/Polo Forgiven Jade.jpg'
    // image2: '/casaca negra edit.jpg'
  },
  {
    id: 3,
    name: "Polo God's club Celeste",
    price: 159.99,
    image: '/Polo Gods club Celeste.jpg'
    // image2: '/gorra roja no edit.jpg'
  },
  {
    id: 4,
    name: 'Polo Hope Amarillo',
    price: 89.99,
    image: '/Polo Hope Amarillo.jpg'
    // image2: '/gorra roja edit.jpg'
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
