"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingBag, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { isAuthenticated, logout } from "@/lib/auth"
import ShoppingCartPanel from "./ShoppingCartPanel"
import { useCart } from "@/contexts/CartContext"
import UserMenu from "./UserMenu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { cartItems } = useCart()

  const handleLogout = () => {
    logout()
    // Redirect to home page or login page after logout
  }

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen)
  }

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold">
            Elegant Bags
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
            </li>
            <li>
              <Link href="/collection" className="hover:text-primary">
                Collection
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-primary">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-primary">
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={toggleCart} className="relative">
            <ShoppingBag className="h-6 w-6" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {cartItems.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </Button>

          {isAuthenticated() ? (
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
          )}

          {/* Mobile Menu Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px]">
              <div className="flex flex-col h-full">
                <div className="py-6">
                  <nav className="flex flex-col space-y-4">
                    <Link href="/" className="text-lg hover:text-primary">
                      Home
                    </Link>
                    <Link href="/collection" className="text-lg hover:text-primary">
                      Collection
                    </Link>
                    <Link href="/about" className="text-lg hover:text-primary">
                      About
                    </Link>
                    <Link href="/contact" className="text-lg hover:text-primary">
                      Contact
                    </Link>
                  </nav>
                </div>

                {!isAuthenticated() && (
                  <div className="mt-auto pb-6 flex flex-col space-y-2">
                    <Link href="/login">
                      <Button variant="outline" className="w-full">
                        Login
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button className="w-full">Register</Button>
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <ShoppingCartPanel isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  )
}

