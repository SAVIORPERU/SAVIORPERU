import ProductCard from './product-card'
import styles from './best-sellers.module.css'
import prisma from '@/lib/prisma'

export default async function BestSellers() {
  // 1. Prisma ya devuelve un objeto/array de JS. No hace falta .toJson()
  const collectionData = await prisma.coleccion.findMany({
    orderBy: {
      id: 'asc'
    }
  })

  // 2. Si tus precios en la DB son tipo Decimal, Prisma los devuelve como objetos.
  // Es mejor convertirlos a números normales para evitar errores de serialización.
  const data = collectionData.map((product) => ({
    ...product,
    price: Number(product.price)
  }))

  console.log('data Colecciones', data)

  return (
    <section className={styles.customWidth}>
      <h2 className={styles.h2}>Ver Colección</h2>
      <div className={styles.cardContainer}>
        {data.map((product) => (
          <ProductCard key={product.id} product={product} from='bestSellers' />
        ))}
      </div>
    </section>
  )
}
