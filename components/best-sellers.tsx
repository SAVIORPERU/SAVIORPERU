import ProductCard from './product-card'
import styles from './best-sellers.module.css'

const bestSellers = [
  {
    id: 1,
    name: 'PANTALONES',
    price: 129.99,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1745109976/PORTADA_PANTS_gl5twi.jpg'
  },
  {
    id: 2,
    name: 'Gorros',
    price: 79.99,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1745109947/GORROS_PORTADA_w6cn7y.jpg'
  },
  {
    id: 3,
    name: 'Pantalones',
    price: 129.99,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1745109976/PORTADA_PANTS_gl5twi.jpg'
  },
  {
    id: 4,
    name: 'Gorros',
    price: 159.99,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1745109947/GORROS_PORTADA_w6cn7y.jpg'
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
