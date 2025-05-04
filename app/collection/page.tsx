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
import { RiArrowUpDoubleLine } from 'react-icons/ri'
import './page.css'

const products = [
  {
    id: 1,
    name: 'Polo Blanco Fire',
    category: 'polos',
    Estado: 'DISPONIBLE',
    size: 'S - M - L',
    price: 45.0,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1745105696/Polo_Fire_Blanco_kjlxx3.jpg'
  },
  {
    id: 2,
    name: 'Polo Negro Heaven',
    category: 'polos',
    Estado: 'SOLO DISPONIBLE',
    size: 'M - L',
    price: 45.0,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1745105694/Polo_Heaven_Negro_zlfuln.jpg'
  },
  {
    id: 3,
    name: 'Polo Jade Forgiven',
    category: 'polos',
    Estado: 'DISPONIBLE',
    size: 'S - M - L',
    price: 45.0,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1745105695/Polo_Forgiven_Jade_ffghlh.jpg'
  },
  {
    id: 4,
    name: 'Polo Amarillo Hope',
    category: 'polos',
    Estado: 'DISPONIBLE',
    size: 'S - M - L',
    price: 45.0,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1745105695/Polo_Hope_Amarillo_larrbx.jpg'
  },
  {
    id: 5,
    name: "Polo Celeste God's Club",
    category: 'polos',
    Estado: 'DISPONIBLE',
    size: 'S - M - L',
    price: 45.0,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1745105698/Polo_God_s_club_Celeste_nrl0nw.jpg'
  },
  {
    id: 6,
    name: 'Polo Verde Peace',
    category: 'polos',
    Estado: 'DISPONIBLE',
    size: 'S - M - L',
    price: 45.0,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1745105697/Polo_Peace_Verde_Acero_bamazm.jpg'
  },
  {
    id: 9,
    name: 'Gorro Verde Faith',
    category: 'gorros',
    Estado: 'DISPONIBLE',
    price: 42.5,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1746235208/Gorro_Verde_Faith_iz5nbj.jpg'
  },
  {
    id: 10,
    name: 'Gorro Beige Faith',
    category: 'gorros',
    Estado: 'DISPONIBLE',
    price: 42.5,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1746235205/Gorro_Beige_Faith_pxfsp0.jpg'
  },
  {
    id: 11,
    name: 'Gorro Negro Faith',
    category: 'gorros',
    Estado: 'DISPONIBLE',
    price: 42.5,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1746235208/Gorro_Negro_Faith_arid6q.jpg'
  },
  {
    id: 12,
    name: 'Gorro Azul Blessed',
    category: 'gorros',
    Estado: 'DISPONIBLE',
    price: 42.5,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1746235204/Gorro_Azul_Blessed_ljhzkx.jpg'
  },
  {
    id: 13,
    name: 'Gorro Blanco Blessed',
    category: 'gorros',
    Estado: 'DISPONIBLE',
    price: 42.5,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1746235205/Gorro_Blanco_Blessed_vf7udu.jpg'
  },
  {
    id: 14,
    name: 'Gorro Negro Choosen',
    category: 'gorros',
    Estado: 'DISPONIBLE',
    price: 39.9,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1746235207/Gorro_Negro_Choosen_ychlsz.jpg'
  },
  {
    id: 15,
    name: 'Gorro Blanco Choosen',
    category: 'gorros',
    Estado: 'DISPONIBLE',
    price: 39.9,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1746235206/Gorro_Blanco_Choosen_xmxwrz.jpg'
  },
  {
    id: 16,
    name: 'Gorro Marron Choosen',
    category: 'gorros',
    Estado: 'DISPONIBLE',
    price: 39.9,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1746235206/Gorro_Marron_Choosen_zklfe8.jpg'
  },
  {
    id: 17,
    name: 'Gorro Celeste Choosen',
    category: 'gorros',
    Estado: 'DISPONIBLE',
    price: 39.9,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1746235206/Gorro_Celeste_Choosen_uzjttp.jpg'
  },
  {
    id: 18,
    name: 'Gorro Negro Savior',
    category: 'gorros',
    Estado: 'DISPONIBLE',
    price: 39.9,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1746235208/Gorro_Negro_Savior_rs8vw6.jpg'
  },
  {
    id: 19,
    name: 'Gorro Blanco Savior',
    category: 'gorros',
    Estado: 'DISPONIBLE',
    price: 39.9,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1746235206/Gorro_Blanco_Savior_rce4tq.jpg'
  },
  {
    id: 20,
    name: 'Gorro Rojo Savior',
    category: 'gorros',
    Estado: 'DISPONIBLE',
    price: 39.9,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1746235208/Gorro_Rojo_Savior_htnzzg.jpg'
  },
  {
    id: 21,
    name: 'Gorro Azul Acero Savior',
    category: 'gorros',
    Estado: 'NO DISPONIBLE',
    price: 39.9,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1746235203/Gorro_Azul_Acero_Savior_ctxbhj.jpg'
  },
  {
    id: 26,
    name: 'Bucket Azul',
    category: 'gorros',
    Estado: 'DISPONIBLE',
    price: 42.5,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1746235203/Bucket_Azul_l8b18p.jpg'
  },
  {
    id: 27,
    name: 'Bucket Negro',
    category: 'gorros',
    Estado: 'DISPONIBLE',
    price: 42.5,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1746235203/Bucket_Negro_qyhbcg.jpg'
  },
  {
    id: 28,
    name: 'Bucket Rosado',
    category: 'gorros',
    Estado: 'DISPONIBLE',
    price: 42.5,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1746235204/Bucket_Rosado_fw14ia.jpg'
  },
  {
    id: 29,
    name: 'Bucket Verde',
    category: 'gorros',
    Estado: 'DISPONIBLE',
    price: 42.5,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1746235203/Bucket_Verde_Choosen_qnxijc.jpg'
  },
  {
    id: 22,
    name: 'Casaca Negra Vintage',
    category: 'casacas',
    Estado: 'SOLO DISPONIBLE',
    size: 'M - L',
    price: 95.0,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1745107452/Casaca_vintage_lsanbz.jpg'
  },
  {
    id: 23,
    name: 'Buso Negro Vintage',
    category: 'pantalones',
    Estado: 'SOLO DISPONIBLE',
    size: 'M - L',
    price: 75.0,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1746328153/Photoroom_20250503_220710_2_xlifxz.jpg'
  },
  {
    id: 25,
    name: 'Hoodie Negro Faith',
    category: 'casacas',
    Estado: 'NO DISPONIBLE',
    size: 'S - M',
    price: 120.0,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1745108612/Polera_Faith_vqggss.jpg'
  },
  {
    id: 30,
    name: 'Polo Blanco Basico',
    category: 'polos',
    Estado: 'DISPONIBLE',
    size: 'M - L',
    price: 38.0,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1746322735/Polo_Basico_Blanco_c8nrmt.jpg'
  },
  {
    id: 31,
    name: 'Polo Negro Basico',
    category: 'polos',
    Estado: 'DISPONIBLE',
    size: 'S - M - L',
    price: 38.0,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1746322735/Polo_Basico_Negro_qedvhh.png'
  },
  {
    id: 32,
    name: 'Jogger Melange',
    category: 'Pantalones',
    Estado: 'DISPONIBLE',
    size: 'S - M - L',
    price: 69.0,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1746227958/Jogger_Franela_Melange_rylaug.jpg'
  },
  {
    id: 33,
    name: 'Jogger Negro',
    category: 'Pantalones',
    Estado: 'DISPONIBLE',
    size: 'S - M - L',
    price: 38.0,
    image:
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1746227958/Jogger_Franela_Negro_ok0juu.jpg'
  }
]

export default function Collection() {
  const [filter, setFilter] = useState('')
  const [sort, setSort] = useState('name')
  const [showCategory, setShowCategory] = useState('')
  const searchParams = useSearchParams()
  const category = searchParams.get('category')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)

    // Limpieza del event listener cuando el componente se desmonte
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  useEffect(() => {
    setFilter(category?.split(' ')[1] || '')
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
    <div className='container mx-auto px-4 py-8 relative'>
      <h1 className='text-3xl font-bold mb-8'>Colecciones</h1>
      <div className='flex flex-col md:flex-row gap-4 mb-8'>
        <Input
          type='text'
          placeholder='Search products...'
          value={filter}
          onChange={(e) => {
            setShowCategory('')
            setFilter(e.target.value)
          }}
          className='md:w-64'
        />
        <Select
          value={showCategory}
          onValueChange={(e) => {
            console.log('e ==>', e)
            setFilter(e)
            setShowCategory(e)
          }}
        >
          <SelectTrigger className='md:w-48'>
            <SelectValue placeholder='Ver todos' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='casacas'>Casacas</SelectItem>
            <SelectItem value='gorros'>Gorros</SelectItem>
            <SelectItem value='pantalones'>Pantalones</SelectItem>
            <SelectItem value='polos'>Polos</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className='md:w-48'>
            <SelectValue placeholder='Ordenar por' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='name'>Nombre</SelectItem>
            <SelectItem value='price-asc'>Precio: menos a mas</SelectItem>
            <SelectItem value='price-desc'>Precio: mas a menos</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <button className='buttonUp'>
        <RiArrowUpDoubleLine className='w-10 h-10' />
      </button>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className='buttonUp'
          aria-label='Volver arriba'
        >
          <RiArrowUpDoubleLine className='w-10 h-10' />
        </button>
      )}
    </div>
  )
}
