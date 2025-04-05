import ProductCard from "./product-card"

const bestSellers = [
  { id: 5, name: "Everyday Satchel", price: 119.99, image: "/placeholder.svg?height=300&width=300" },
  { id: 6, name: "Evening Clutch", price: 69.99, image: "/placeholder.svg?height=300&width=300" },
  { id: 7, name: "Work Tote", price: 149.99, image: "/placeholder.svg?height=300&width=300" },
  { id: 8, name: "Weekend Duffel", price: 179.99, image: "/placeholder.svg?height=300&width=300" },
  { id: 9, name: "Mini Backpack", price: 99.99, image: "/placeholder.svg?height=300&width=300" },
  { id: 10, name: "Crossbody Bag", price: 89.99, image: "/placeholder.svg?height=300&width=300" },
]

export default function BestSellers() {
  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Best Sellers</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {bestSellers.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

