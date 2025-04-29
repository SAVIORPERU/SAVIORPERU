import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { CartProvider } from '@/contexts/CartContext'
import type React from 'react' // Import React
import { Suspense } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Savior | Calidad y Estilo',
  description:
    'Descubre nuestra colección de ropa con diseños únicos. Polos, gorros y más.',
  keywords: 'ropa, polos, gorros, moda, casacas, pantalones',
  openGraph: {
    title: 'Savior | Ropa de tendencia',
    description: 'Descubre nuestra colección de ropa con diseños únicos',
    type: 'website',
    locale: 'es_PE',
    siteName: 'Savior',
    url: 'https://savior.vercel.app',
    images: [
      {
        url: 'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1745110576/Logo_mk3nez.jpg',
        width: 1200,
        height: 630,
        alt: 'Savior Logo',
        type: 'image/jpeg'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Savior | Ropa de tendencia',
    description: 'Descubre nuestra colección de ropa con diseños únicos',
    images: [
      'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1745110576/Logo_mk3nez.jpg'
    ]
  },
  robots: {
    index: true,
    follow: true
  },
  icons: {
    icon: 'https://res.cloudinary.com/dkw7q1u6z/image/upload/v1745110576/Logo_mk3nez.jpg'
  }
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <CartProvider>
          <Header />
          <Suspense>
            <main className='pt-[72px]'>{children}</main>
          </Suspense>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
