'use client'

import { useConfigData } from '@/hooks/useConfigData'
import Link from 'next/link'
import { FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa'
export default function Footer() {
  const { getFacebook, getInstagram, getTiktok } = useConfigData()
  return (
    <footer className='bg-secondary text-foreground'>
      <div className='container mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div>
            <h3 className='font-bold mb-2'>Quick Links</h3>
            <ul className='space-y-2'>
              <li>
                <Link href='/' className='hover:text-primary'>
                  Home
                </Link>
              </li>
              <li>
                <Link href='/collection' className='hover:text-primary'>
                  Productos
                </Link>
              </li>
              <li>
                <Link href='/about' className='hover:text-primary'>
                  Nosotros
                </Link>
              </li>
              <li>
                <Link href='/contact' className='hover:text-primary'>
                  Contactanos
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className='font-bold mb-2'>Follow Us</h3>
            <div className='flex flex-col'>
              <Link
                href={getFacebook()}
                className='hover:text-primary flex items-center gap-1 mb-2'
                target='_blank'
              >
                <FaFacebook className='h-8 w-7' /> Facebook
              </Link>
              <Link
                href={getInstagram()}
                className='hover:text-primary flex items-center gap-1 mb-2'
                target='_blank'
              >
                <FaInstagram className='h-8 w-7' /> Instagram
              </Link>
              <Link
                href={getTiktok()}
                className='hover:text-primary flex items-center gap-1 mb-2'
                target='_blank'
              >
                <FaTiktok className='h-8 w-7' /> Tiktok
              </Link>
            </div>
          </div>
        </div>
        <div className='mt-8 text-center text-sm text-gray-500'>
          © 2025 Savior. Todos los derechos reservados. By{' '}
          <Link
            href='https://marteldev.com/'
            target='_blank'
            className='text-foreground'
          >
            Terry
          </Link>
        </div>
      </div>
    </footer>
  )
}
