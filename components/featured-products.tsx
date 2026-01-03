import ProductCard from './product-card'
import styles from './featured-products.module.css'
import prisma from '@/lib/prisma'

// Definimos la interfaz localmente o la importamos
interface Product {
  id: number
  name: string
  price: number
  image: string
  image2?: string
  size?: string
  estado?: string
}

export default async function FeaturedProducts() {
  // 1. Traemos la relación de destacados incluyendo los datos del producto
  const destacadosData = await prisma.productosDestacados.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
      producto: true // Trae todos los campos de la tabla 'Productos'
    }
  })

  // 2. Aplanamos y formateamos el objeto para que coincida con la interfaz 'Product'
  // y para evitar errores con el tipo Decimal de Prisma.
  const data: Product[] = destacadosData.map((item) => ({
    id: item.producto.id,
    name: item.producto.name,
    price: Number(item.producto.price), // Convertimos Decimal a Number
    image: item.producto.image,
    image2: item.producto.image2 || undefined,
    size: item.producto.size || undefined,
    estado: item.producto.estado
  }))

  return (
    <section className={styles.customWidth}>
      <h2 className={styles.h2}>Productos Destacados</h2>
      <div className={styles.cardContainer}>
        {data.map((product) => (
          <ProductCard key={product.id} product={product} from='featured' />
        ))}
      </div>
    </section>
  )
}
