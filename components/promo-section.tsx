import { Button } from "@/components/ui/button"
import { Truck, Shield, Headphones, Gift } from "lucide-react"
import Link from "next/link"

export function PromoSection() {
  const features = [
    {
      icon: Truck,
      title: "Tezkor yetkazib berish",
      description: "1-2 kun ichida eshigingizgacha",
    },
    {
      icon: Shield,
      title: "Sifat kafolati",
      description: "30 kun qaytarish kafolati",
    },
    {
      icon: Headphones,
      title: "24/7 qo'llab-quvvatlash",
      description: "Har qanday savolingizga javob",
    },
    {
      icon: Gift,
      title: "Maxsus chegirmalar",
      description: "Doimiy mijozlar uchun bonuslar",
    },
  ]

  return (
    <section className="bg-gradient-to-r from-pink-100 via-purple-50 to-pink-100 py-16">
      <div className="container mx-auto px-4">
        {/* Asosiy promo */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Maxsus takliflar va <span className="text-pink-600">xizmatlar</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Sifatli mahsulotlar va professional xizmat. 100,000 so'mdan yuqori buyurtmalar uchun bepul yetkazib berish.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="bg-pink-600 hover:bg-pink-700 text-lg px-8 py-3 shadow-lg">
                Mahsulotlarni ko'rish
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-3 bg-white hover:bg-pink-50 border-2 border-pink-200 hover:border-pink-300"
              >
                Bog'lanish
              </Button>
            </Link>
          </div>
        </div>

        {/* Xususiyatlar */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center group"
            >
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-pink-200 transition-colors">
                <feature.icon className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
