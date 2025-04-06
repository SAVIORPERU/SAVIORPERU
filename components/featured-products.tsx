import ProductCard from './product-card'
import styles from './featured-products.module.css'

const featuredProducts = [
  {
    id: 1,
    name: 'Casaca negra',
    price: 129.99,
    image: '/casaca negra edit.jpg',
    image2: '/casaca negra no edit.jpg'
  },
  {
    id: 2,
    name: 'Casaca negra no edit',
    price: 79.99,
    image: '/casaca negra no edit.jpg',
    image2: '/casaca negra edit.jpg'
  },
  {
    id: 3,
    name: 'Gorra roja',
    price: 159.99,
    image: '/gorra roja edit.jpg',
    image2: '/gorra roja no edit.jpg'
  },
  {
    id: 4,
    name: 'Gorra gris',
    price: 89.99,
    image: '/gorra gris edit.jpg',
    image2: '/gorra roja edit.jpg'
  }
]

export default function FeaturedProducts() {
  return (
    <section className={styles.customWidth}>
      {/* <h2 className='text-3xl font-bold mb-8 text-center mx-auto'>
        Featured Products
      </h2> */}
      <div className='flex gap-2 justify-center'>
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} from='featured' />
        ))}
      </div>
    </section>
  )
}
