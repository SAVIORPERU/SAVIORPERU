'use client'

import React, { useState } from 'react'
import AdminDashboard from './components/Orders'
import { MdInventory2, MdShoppingBag, MdGroups2 } from 'react-icons/md'
import { IoGridSharp } from 'react-icons/io5'
import { Toaster } from 'sonner'
import UserManagement from './components/UserManagement'

const paths = [
  { name: 'Órdenes', path: 'orders', icon: MdShoppingBag },
  { name: 'Productos', path: 'products', icon: MdInventory2 },
  { name: 'Usuarios', path: 'users', icon: MdGroups2 }
]

const AdminPanel = () => {
  // Estados para Funcionalidad
  const [panel, setPanel] = useState('Órdenes')

  return (
    <>
      <div className='flex w-full bg-gray-50 font-sans antialiased text-gray-900 dark:bg-gray-900 dark:text-gray-100'>
        {/* Notificaciones Toast */}
        <Toaster position='top-right' richColors />

        {/* Sidebar */}
        <aside className='hidden w-64 flex-col border-r border-gray-200 bg-white lg:flex dark:bg-gray-800 dark:border-gray-700  pb-12'>
          <div className='flex h-16 items-center px-6 border-b border-gray-100 dark:border-gray-700'>
            <div className='flex items-center gap-2'>
              <IoGridSharp className='text-blue-600 text-2xl dark:text-blue-400' />
              <h1 className='text-lg font-bold tracking-tight text-gray-900 dark:text-white'>
                Admin E-com
              </h1>
            </div>
          </div>
          <div className='flex flex-1 flex-col justify-between overflow-y-auto px-4 py-6'>
            <nav className='flex flex-col gap-1'>
              {paths.map((item) => (
                <button
                  key={item.name}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                    item.name === panel
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50'
                  }`}
                  onClick={() => setPanel(item.name)}
                >
                  <item.icon size={20} />
                  <span className='text-sm font-medium'>{item.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>
        {panel === 'Usuarios' ? <UserManagement /> : <AdminDashboard />}
      </div>
    </>
  )
}

export default AdminPanel
