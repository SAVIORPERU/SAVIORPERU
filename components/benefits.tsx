import { Truck, HeadphonesIcon, ShieldCheck } from "lucide-react"

const benefits = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over $100",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Support",
    description: "Get help anytime",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    description: "100% protected transactions",
  },
]

export default function Benefits() {
  return (
    <section className="py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <benefit.icon className="h-12 w-12 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
            <p className="text-gray-600">{benefit.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

