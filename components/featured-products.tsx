import ProductCard from "./product-card"

const featuredProducts = [
  { id: 1, name: "Classic Tote", price: 129.99, image: "/placeholder.svg?height=300&width=300" },
  { id: 2, name: "Elegant Clutch", price: 79.99, image: "/placeholder.svg?height=300&width=300" },
  { id: 3, name: "Leather Shoulder Bag", price: 159.99, image: "/placeholder.svg?height=300&width=300" },
  { id: 4, name: "Mini Crossbody", price: 89.99, image: "/placeholder.svg?height=300&width=300" },
]

export default function FeaturedProducts() {
  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Featured Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

