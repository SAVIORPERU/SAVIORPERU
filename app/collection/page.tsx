'use client'

import { useEffect, useState } from 'react'
import ProductCard from '@/components/product-card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select'
import { useSearchParams } from 'next/navigation'

const products = [
  {
    id: 1,
    name: 'Polo Blanco Fire',
    category: 'polos',
    Estado: 'DISPONIBLE',
    Tamaño: 'S - M - L',
    price: 45.0,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1745105696/Polo_Fire_Blanco_kjlxx3.jpg'
  },
  {
    id: 2,
    name: 'Polo Negro Heaven',
    category: 'polos',
    Estado: 'SOLO DISPONIBLE',
    Tamaño: 'M - L',
    price: 45.0,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1745105694/Polo_Heaven_Negro_zlfuln.jpg'
  },
  {
    id: 3,
    name: 'Polo Azul Forgiven',
    category: 'polos',
    Estado: 'DISPONIBLE',
    Tamaño: 'S - M - L',
    price: 45.0,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1745105695/Polo_Forgiven_Jade_ffghlh.jpg'
  },
  {
    id: 4,
    name: 'Polo Amarillo Hope',
    category: 'polos',
    Estado: 'DISPONIBLE',
    Tamaño: 'S - M - L',
    price: 45.0,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1745105695/Polo_Hope_Amarillo_larrbx.jpg'
  },
  {
    id: 5,
    name: "Polo Azul God's Club",
    category: 'polos',
    Estado: 'DISPONIBLE',
    Tamaño: 'S - M - L',
    price: 45.0,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1745105698/Polo_God_s_club_Celeste_nrl0nw.jpg'
  },
  {
    id: 6,
    name: 'Polo Verde Peace',
    category: 'polos',
    Estado: 'DISPONIBLE',
    Tamaño: 'S - M - L',
    price: 45.0,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1745105697/Polo_Peace_Verde_Acero_bamazm.jpg'
  },
  {
    id: 9,
    name: 'Gorro Verde Faith',
    category: 'gorros',
    Estado: 'DISPONIBLE',
    Tamaño: 'STANDARD',
    price: 42.5,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/fl_preserve_transparency/v1745105574/Gorro_Celeste_Choosen_ldend5.jpg?_s=public-apps'
  },
  {
    id: 10,
    name: 'Gorro Beige Faith',
    category: 'gorros',
    Estado: 'DISPONIBLE',
    Tamaño: 'STANDARD',
    price: 42.5,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1745105579/Gorro_Faith_Beige_JPEG_albpeh.jpg'
  },
  {
    id: 11,
    name: 'Gorro Negro Faith',
    category: 'gorros',
    Estado: 'DISPONIBLE',
    Tamaño: 'STANDARD',
    price: 42.5,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1745105579/Gorro_Faith_Negro_uqvxix.jpg'
  },
  {
    id: 12,
    name: 'Gorro Azul Blessed',
    category: 'gorros',
    Estado: 'DISPONIBLE',
    Tamaño: 'STANDARD',
    price: 42.5,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1745105574/Gorro_Azul_Blessed_fv9jbr.jpg'
  },
  {
    id: 13,
    name: 'Gorro Blanco Blessed',
    category: 'gorros',
    Estado: 'DISPONIBLE',
    Tamaño: 'STANDARD',
    price: 42.5,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1745105576/Gorro_Blanco_Blessed_ylzv1p.jpg'
  },
  {
    id: 14,
    name: 'Gorro Negro Choosen',
    category: 'gorros',
    Estado: 'DISPONIBLE',
    Tamaño: 'STANDARD',
    price: 39.9,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1745105578/Gorro_Choosen_Negro_px338e.jpg'
  },
  {
    id: 15,
    name: 'Gorro Blanco Choosen',
    category: 'gorros',
    Estado: 'DISPONIBLE',
    Tamaño: 'STANDARD',
    price: 39.9,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1745105576/Gorro_Choosen_Blanco_vp3pas.jpg'
  },
  {
    id: 16,
    name: 'Gorro Marron Choosen',
    category: 'gorros',
    Estado: 'DISPONIBLE',
    Tamaño: 'STANDARD',
    price: 39.9,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1745105574/Gorro_Marron_Chosen_sqascv.jpg'
  },
  {
    id: 17,
    name: 'Gorro Celeste Choosen',
    category: 'gorros',
    Estado: 'DISPONIBLE',
    Tamaño: 'STANDARD',
    price: 39.9,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/fl_preserve_transparency/v1745105574/Gorro_Celeste_Choosen_ldend5.jpg?_s=public-apps'
  },
  {
    id: 18,
    name: 'Gorro Negro Savior',
    category: 'gorros',
    Estado: 'DISPONIBLE',
    Tamaño: 'STANDARD',
    price: 39.9,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1745105574/Gorro_Negro_Savior_pcj98c.jpg'
  },
  {
    id: 19,
    name: 'Gorro Blanco Savior',
    category: 'gorros',
    Estado: 'DISPONIBLE',
    Tamaño: 'STANDARD',
    price: 39.9,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1745105575/Gorro_Blanco_Savior_n5derf.jpg'
  },
  {
    id: 20,
    name: 'Gorro Rojo Savior',
    category: 'gorros',
    Estado: 'DISPONIBLE',
    Tamaño: 'STANDARD',
    price: 39.9,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1745105577/Gorro_Rojo_Savior_tfkse7.jpg'
  },
  {
    id: 21,
    name: 'Gorro Azul Acero Savior',
    category: 'gorros',
    Estado: 'NO DISPONIBLE',
    Tamaño: 'STANDARD',
    price: 39.9,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1745105576/Gorro_Azul_Savior_k6hhqk.jpg'
  },
  {
    id: 22,
    name: 'Casaca Negra Vintage',
    category: 'casacas',
    Estado: 'SOLO DISPONIBLE',
    Tamaño: 'M - L',
    price: 95.0,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1745107452/Casaca_vintage_lsanbz.jpg'
  },
  {
    id: 23,
    name: 'Buso Negro Vintage',
    category: 'pantalones',
    Estado: 'SOLO DISPONIBLE',
    Tamaño: 'M - L',
    price: 75.0,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1745105793/Buso_Vintage_B_W_uuzxcd.jpg'
  },
  {
    id: 25,
    name: 'Hoodie Negro Faith',
    category: 'casacas',
    Estado: 'NO DISPONIBLE',
    Tamaño: null,
    price: 120.0,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1745108612/Polera_Faith_vqggss.jpg'
  }
]

export default function Collection() {
  const [filter, setFilter] = useState('')
  const [sort, setSort] = useState('name')
  const searchParams = useSearchParams()
  const category = searchParams.get('category')

  useEffect(() => {
    setFilter(category || '')
    console.log('category ==>', category)
  }, [])

  const filteredProducts = products
    .filter(
      (product) =>
        product.name.toLowerCase().includes(filter.toLowerCase()) ||
        product.category.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name)
      if (sort === 'price-asc') return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price
      return 0
    })

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-8'>Our Collection</h1>
      <div className='flex flex-col md:flex-row gap-4 mb-8'>
        <Input
          type='text'
          placeholder='Search products...'
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className='md:w-64'
        />
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className='md:w-48'>
            <SelectValue placeholder='Sort by' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='name'>Name</SelectItem>
            <SelectItem value='price-asc'>Price: Low to High</SelectItem>
            <SelectItem value='price-desc'>Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
