import React from 'react'
import { headers } from 'next/headers'
import OrdersList from './OrdersList'
import { currentUser } from '@clerk/nextjs/server'

const OrdersPage = async () => {
  const headersList = headers()
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
  const user = await currentUser()
  console.log('user =>', user?.emailAddresses[0].emailAddress)

  const res = await fetch(
    `${protocol}://localhost:4000/api/orders?email=${user}`,
    {
      cache: 'no-store' // evita cache en SSR
    }
  )

  if (!res.ok) {
    return <div>Error cargando órdenes</div>
  }

  const { data, pagination } = await res.json()

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>Órdenes</h1>
      <OrdersList orders={data} pagination={pagination} />
    </div>
  )
}

export default OrdersPage
