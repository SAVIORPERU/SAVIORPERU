import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-100 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold mb-2">Quick Links</h3>
            <ul className="space-y-2">
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
          </div>
          <div>
            <h3 className="font-bold mb-2">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:text-primary">
                  Shipping
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">Follow Us</h3>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-primary">
                <Facebook />
              </Link>
              <Link href="#" className="hover:text-primary">
                <Instagram />
              </Link>
              <Link href="#" className="hover:text-primary">
                <Twitter />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-gray-500">© 2025 Elegant Bags. All rights reserved.</div>
      </div>
    </footer>
  )
}

