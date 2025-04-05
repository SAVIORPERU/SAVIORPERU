import Image from "next/image"

export default function About() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">About Elegant Bags</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <p className="mb-4">
            Elegant Bags is a premium handbag brand dedicated to providing women with stylish, high-quality accessories
            that complement their unique style. Founded in 2010, we have been crafting exquisite handbags that blend
            timeless elegance with modern design.
          </p>
          <p className="mb-4">
            Our commitment to quality is evident in every stitch, every zipper, and every carefully selected material.
            We believe that a great handbag is not just an accessory, but an essential part of a woman's wardrobe that
            can elevate any outfit and boost confidence.
          </p>
        </div>
        <div className="relative h-64 md:h-full">
          <Image
            src="/placeholder.svg?height=400&width=600"
            alt="Elegant Bags Workshop"
            fill
            className="object-cover rounded-lg"
          />
        </div>
      </div>
      <h2 className="text-2xl font-bold mt-12 mb-6">Our Core Values</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-gray-100 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Quality</h3>
          <p>We use only the finest materials and craftsmanship to ensure our bags stand the test of time.</p>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Style</h3>
          <p>Our designs are inspired by the latest trends while maintaining a timeless appeal.</p>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Sustainability</h3>
          <p>We are committed to ethical production practices and minimizing our environmental impact.</p>
        </div>
      </div>
    </div>
  )
}

