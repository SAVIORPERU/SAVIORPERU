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
import { products } from '../../data/Productos'
import './page.css'

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
