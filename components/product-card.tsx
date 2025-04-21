'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useCart } from '@/contexts/CartContext'
import { useState } from 'react'
import styles from './product-card.module.css'
import Link from 'next/link'
import { MdOutlineShoppingCart } from 'react-icons/md'

interface Product {
  id: number
  name: string
  price: number
  image: string
  image2?: string
}

export default function ProductCard({
  product,
  from
}: {
  product: Product
  from?: string
}) {
  const { addToCart } = useCart()
  const [image, setImage] = useState<string>(product.image)

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image
    })
  }

  if (from === 'bestSellers') {
    return (
      <div className='bg-white overflow-hidden w-full'>
        <Link href='/collection'>
          <div className={styles.fromBestSellers}>
            <Image
              src={image || '/placeholder.svg'}
              alt={product.name}
              fill
              className='object-cover transition-opacity duration-300 ease-in-out shadow-md'
              onMouseEnter={() =>
                setImage(product.image2 ? product.image2 : product.image)
              }
              onMouseLeave={() => setImage(product.image)}
            />
          </div>
        </Link>
        <div className='px-0 pt-4 pb-0 flex mb-2'>
          <h3 className={styles.fromBestSellersh3}>{product.name}</h3>
        </div>
      </div>
    )
  }

  return (
    <div className='bg-white shadow-md rounded-sm overflow-hidden w-full'>
      <div
        className={`relative ${
          from === 'featured'
            ? styles.fromFeatured
            : from === 'bestSellers'
            ? styles.fromBestSellers
            : 'h-64'
        }`}
      >
        <Image
          src={image || '/placeholder.svg'}
          alt={product.name}
          fill
          className='object-cover transition-opacity duration-300 ease-in-out'
          onMouseEnter={() =>
            setImage(product.image2 ? product.image2 : product.image)
          }
          onMouseLeave={() => setImage(product.image)}
        />
      </div>
      <div
        className={`${
          from === 'bestSellers' || from === 'featured'
            ? 'px-2 pt-2 pb-0'
            : 'p-4'
        }`}
      >
        <h3
          className={`${
            from === 'featured' || from === 'bestSellers'
              ? 'text-sm'
              : 'text-lg'
          } font-medium mb-2 text-[#31302e]`}
        >
          {product.name}
        </h3>
        {from !== 'bestSellers' && (
          <p className='text-gray-600 mb-4'>S/ {product.price.toFixed(2)}</p>
        )}
        <Button className='w-full mb-2' onClick={handleAddToCart}>
          Añadir al carrito <MdOutlineShoppingCart />
        </Button>
      </div>
    </div>
  )
}
