import ProductCard from './product-card'
import styles from './best-sellers.module.css'

const bestSellers = [
  {
    id: 1,
    name: 'Compra casacas =>',
    price: 129.99,
    image: '/casaca negra edit.jpg'
  },
  {
    id: 2,
    name: 'Compra casacas =>',
    price: 79.99,
    image: '/casaca negra no edit.jpg'
  },
  {
    id: 3,
    name: 'Compra Gorras =>',
    price: 159.99,
    image: '/gorra roja edit.jpg'
  },
  {
    id: 4,
    name: 'Compra gorras =>',
    price: 89.99,
    image: '/gorra gris edit.jpg'
  }
]

export default function BestSellers() {
  return (
    <section className={styles.bestSellersSection}>
      <h2 className='text-3xl font-bold mb-8 text-center'>Best Sellers</h2>
      <div className={styles.cardsContainer}>
        {bestSellers.map((product) => (
          <ProductCard key={product.id} product={product} from='bestSellers' />
        ))}
      </div>
    </section>
  )
}
