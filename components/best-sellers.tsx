import ProductCard from './product-card'
import styles from './best-sellers.module.css'
import prisma from '@/lib/prisma'

// Esto asegura que si la DB no está lista, no rompa el despliegue de Netlify
export const dynamic = 'force-dynamic'

interface Product {
  id: number
  name: string
  price: number
  image: string
  image2?: string
  size?: string
  estado?: string
}

export default async function BestSellers() {
  let data: Product[] = []

  try {
    // 1. Intentamos obtener los datos
    const collectionData = await prisma.coleccion.findMany({
      orderBy: {
        id: 'asc'
      }
    })

    // 2. Convertimos Decimal a Number
    data = collectionData.map((product) => ({
      ...product,
      price: Number(product.price)
    }))

    console.log('data Colecciones cargada con éxito')
  } catch (error) {
    // Si la tabla no existe o está vacía, mostramos el error en consola pero NO rompemos la web
    console.error(
      'Error cargando Colecciones (posiblemente tabla vacía):',
      error
    )
    data = []
  }

  // 3. Si no hay datos, mostramos un mensaje amigable o nada
  if (data.length === 0) {
    return (
      <section className={styles.customWidth}>
        <h2 className={styles.h2}>Ver Colección</h2>
        <p className='text-center py-10'>Próximamente nuevas colecciones.</p>
      </section>
    )
  }

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
