'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, Menu } from 'lucide-react'
import { MdOutlineShoppingCart } from 'react-icons/md'
import { Button } from '@/components/ui/button'
import { isAuthenticated, logout } from '@/lib/auth'
import ShoppingCartPanel from './ShoppingCartPanel'
import { useCart } from '@/contexts/CartContext'
import UserMenu from './UserMenu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { PiBaseballCapDuotone } from 'react-icons/pi'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

export default function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { cartItems } = useCart()
  const pathname = usePathname()
  console.log('pathname ==>', pathname)

  const handleLogout = () => {
    logout()
    // Redirect to home page or login page after logout
  }

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen)
  }

  return (
    <header className='border-b fixed z-10 w-full bg-white'>
      <div className='container py-4 flex items-center justify-between mx-auto'>
        <div className='flex items-center'>
          <Link href='/' className='text-2xl font-bold flex items-center gap-1'>
            <Image
              src='https://res.cloudinary.com/dkw7q1u6z/image/upload/v1745110576/Logo_mk3nez.jpg'
              width={40}
              height={40}
              alt='Logo'
              className='rounded-full'
            />
            <Image
              src='/NombreMarca.JPG'
              width={100}
              height={70}
              alt='Logo'
              className='rounded-full'
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className='hidden md:block'>
          <ul className='flex space-x-4'>
            <li>
              <Link
                href='/'
                className={`hover:text-slate-400 ${
                  pathname === '/' || pathname === '' ? 'text-slate-500' : ''
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href='/collection'
                className={`hover:text-slate-400 ${
                  pathname === '/collection' ? 'text-slate-500' : ''
                }`}
              >
                Productos
              </Link>
            </li>
            <li>
              <Link
                href='/about'
                className={`hover:text-slate-400 ${
                  pathname === '/about' ? 'text-slate-500' : ''
                }`}
              >
                Nosotros
              </Link>
            </li>
            <li>
              <Link
                href='/contact'
                className={`hover:text-slate-400 ${
                  pathname === '/contact' ? 'text-slate-500' : ''
                }`}
              >
                Contactanos
              </Link>
            </li>
          </ul>
        </nav>

        <div className='flex items-center space-x-4'>
          <Button
            variant='ghost'
            size='icon'
            onClick={toggleCart}
            className='relative'
          >
            <MdOutlineShoppingCart className='h-20 w-20' />
            {cartItems.length > 0 && (
              <span className='absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs'>
                {cartItems.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </Button>

          {/* // !  aqui abajo esta el Login Descomentar para seguir trabajando */}
          {/* {isAuthenticated() ? (
            <UserMenu onLogout={handleLogout} />
          ) : (
            <div className="hidden md:flex space-x-2">
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Register</Button>
              </Link>
            </div>
          )} */}

          {/* Mobile Menu Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant='ghost' size='icon' className='md:hidden'>
                <Menu className='h-6 w-6' />
                <span className='sr-only'>Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side='right' className='w-[250px] sm:w-[300px]'>
              <SheetHeader>
                <SheetTitle className='sr-only'>Menu de navegación</SheetTitle>
              </SheetHeader>
              <div className='flex flex-col h-full'>
                <div className='py-6'>
                  <nav className='flex flex-col space-y-4'>
                    <Link href='/' className='text-lg hover:text-primary'>
                      Home
                    </Link>
                    <Link
                      href='/collection'
                      className='text-lg hover:text-primary'
                    >
                      Productos
                    </Link>
                    <Link href='/about' className='text-lg hover:text-primary'>
                      Nosotros
                    </Link>
                    <Link
                      href='/contact'
                      className='text-lg hover:text-primary'
                    >
                      Contactanos
                    </Link>
                  </nav>
                </div>

                {/* {!isAuthenticated() && (
                  <div className='mt-auto pb-6 flex flex-col space-y-2'>
                    <Link href='/login'>
                      <Button variant='outline' className='w-full'>
                        Login
                      </Button>
                    </Link>
                    <Link href='/register'>
                      <Button className='w-full'>Register</Button>
                    </Link>
                  </div>
                )} */}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <ShoppingCartPanel
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </header>
  )
}
