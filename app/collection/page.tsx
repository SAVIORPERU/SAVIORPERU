"use client"

import { useState } from "react"
import ProductCard from "@/components/product-card"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

const products = [
  { id: 1, name: "Classic Tote", price: 129.99, image: "/placeholder.svg?height=300&width=300", category: "Tote" },
  { id: 2, name: "Elegant Clutch", price: 79.99, image: "/placeholder.svg?height=300&width=300", category: "Clutch" },
  {
    id: 3,
    name: "Leather Shoulder Bag",
    price: 159.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Shoulder",
  },
  {
    id: 4,
    name: "Mini Crossbody",
    price: 89.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Crossbody",
  },
  {
    id: 5,
    name: "Everyday Satchel",
    price: 119.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Satchel",
  },
  { id: 6, name: "Evening Clutch", price: 69.99, image: "/placeholder.svg?height=300&width=300", category: "Clutch" },
  { id: 7, name: "Work Tote", price: 149.99, image: "/placeholder.svg?height=300&width=300", category: "Tote" },
  { id: 8, name: "Weekend Duffel", price: 179.99, image: "/placeholder.svg?height=300&width=300", category: "Duffel" },
]

export default function Collection() {
  const [filter, setFilter] = useState("")
  const [sort, setSort] = useState("name")

  const filteredProducts = products
    .filter(
      (product) =>
        product.name.toLowerCase().includes(filter.toLowerCase()) ||
        product.category.toLowerCase().includes(filter.toLowerCase()),
    )
    .sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name)
      if (sort === "price-asc") return a.price - b.price
      if (sort === "price-desc") return b.price - a.price
      return 0
    })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Collection</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <Input
          type="text"
          placeholder="Search products..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="md:w-64"
        />
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="md:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

