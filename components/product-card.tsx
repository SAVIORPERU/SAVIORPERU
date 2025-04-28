'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useCart } from '@/contexts/CartContext'
import { useState } from 'react'
import styles from './product-card.module.css'
import Link from 'next/link'
import { MdOutlineShoppingCart } from 'react-icons/md'
import { FiMinusCircle, FiPlusCircle } from 'react-icons/fi'

interface Product {
  id: number
  name: string
  price: number
  image: string
  image2?: string
  size?: string
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
  const [selectedSize, setSelectedSize] = useState<string>('') // Estado para el tamañ
  const [quantity, setQuantity] = useState(1) // Estado para la cantidad

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.image,
      size: selectedSize
    })
  }

  if (from === 'bestSellers') {
    return (
      <div className='bg-white overflow-hidden w-full'>
        <Link href={`/collection?category=${product.name.toLowerCase()}`}>
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
          <div className='px-0 pt-4 pb-0 flex mb-2'>
            <h3 className={styles.fromBestSellersh3}>{product.name}</h3>
          </div>
        </Link>
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
            : 'lg:h-64 max-[400px]:h-[300px] max-[460px]:h-[400px] h-[450px]'
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
          } font-medium mb-1 text-[#31302e]`}
        >
          {product.name}
        </h3>
        {from !== 'bestSellers' && (
          <div className='text-gray-600 mb-3 w-full'>
            <p>S/ {product.price.toFixed(2)}</p>

            <div className='flex justify-between mt-1'>
              <div className='flex gap-2'>
                <button
                  className='hover:text-gray-950'
                  onClick={() =>
                    setQuantity((prev) => (prev > 1 ? prev - 1 : prev))
                  }
                >
                  <FiMinusCircle className='h-4 w-4' />
                </button>
                <span>{quantity}</span>
                <button
                  className='hover:text-gray-950'
                  onClick={() => setQuantity((prev) => prev + 1)}
                >
                  <FiPlusCircle className='h-4 w-4' />
                </button>
              </div>
              <form className='flex gap-2'>
                {product.size?.split(' - ').map((ele, index) => (
                  <div
                    className='radio-container gap-[2px] flex items-center'
                    key={index}
                  >
                    <input
                      type='radio'
                      id={ele}
                      value={ele}
                      name='size'
                      onChange={() => setSelectedSize(ele)}
                      checked={selectedSize === ele}
                    />
                    <label htmlFor={ele} className='m-0'>
                      {ele}
                    </label>
                  </div>
                ))}
              </form>
            </div>
          </div>
        )}
        <Button
          className='w-full mb-2'
          onClick={handleAddToCart}
          disabled={
            selectedSize ? false : product.name.includes('Gorro') ? false : true
          }
        >
          Añadir al carrito <MdOutlineShoppingCart />
        </Button>
      </div>
    </div>
  )
}
