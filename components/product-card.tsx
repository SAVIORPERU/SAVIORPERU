'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useCart } from '@/contexts/CartContext'
import { useState } from 'react'

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
      quantity: 1
    })
  }

  return (
    <div className='bg-white rounded-sm shadow-sm overflow-hidden'>
      <div
        className={`relative ${
          from === 'featured'
            ? 'h-[567px]'
            : from === 'bestSellers'
            ? 'h-[380px]'
            : 'h-64'
        } ${from === 'featured' ? 'w-[450px]' : 'h-64'}`}
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
      <div className='p-4'>
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
        {!from && (
          <Button className='w-full' onClick={handleAddToCart}>
            Add to Cart
          </Button>
        )}
      </div>
    </div>
  )
}
