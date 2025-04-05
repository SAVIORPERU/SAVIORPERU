"use client"

import { useCart } from "@/contexts/CartContext"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface ShoppingCartPanelProps {
  isOpen: boolean
  onClose: () => void
}

export default function ShoppingCartPanel({ isOpen, onClose }: ShoppingCartPanelProps) {
  const { cartItems, removeFromCart, clearCart, getCartTotal } = useCart()

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />

      {/* Cart Panel */}
      <div className="fixed inset-y-0 right-0 w-[280px] sm:w-[350px] bg-white shadow-lg p-4 transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        {cartItems.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <>
            <ul className="space-y-4 mb-4">
              {cartItems.map((item) => (
                <li key={item.id} className="flex flex-col">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{item.name}</span>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">
                      <X size={16} />
                    </button>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Qty: {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t pt-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span>Subtotal:</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Button onClick={clearCart} variant="outline" className="w-full">
                Clear Cart
              </Button>
              <Button className="w-full">Checkout</Button>
            </div>
          </>
        )}
      </div>
    </>
  )
}

