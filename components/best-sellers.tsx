import ProductCard from './product-card'
import styles from './best-sellers.module.css'

const bestSellers = [
  {
    id: 1,
    name: 'Ver Pantalones',
    price: 129.99,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1745205636/Photoroom_20250420_221506_qw0ozw.jpg'
  },
  {
    id: 2,
    name: 'Ver Gorros',
    price: 79.99,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1745205638/Photoroom_20250420_221724_rnunpi.jpg'
  },
  {
    id: 3,
    name: 'Ver Polos',
    price: 129.99,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1745205639/Photoroom_20250420_221836_rg7t8m.jpg'
  },
  {
    id: 4,
    name: 'Ver Casacas',
    price: 159.99,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1745205638/Photoroom_20250420_221742_llecxs.jpg'
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
