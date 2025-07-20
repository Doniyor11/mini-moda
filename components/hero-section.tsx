import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-pink-50 to-purple-50 overflow-hidden">
      <div className="container mx-auto px-4 py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Bolalar uchun{" "}
                <span className="text-pink-600 relative">
                  sifatli
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-3 text-pink-200"
                    viewBox="0 0 100 12"
                    fill="currentColor"
                  >
                    <path d="M0 8c30-4 70-4 100 0v4H0z" />
                  </svg>
                </span>{" "}
                kiyimlar
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-lg leading-relaxed">
                0-10 yosh oralig'idagi bolalar uchun zamonaviy, qulay va sifatli kiyim-kechak mahsulotlari
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products">
                <Button
                  size="lg"
                  className="bg-pink-600 hover:bg-pink-700 text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Xarid qilish
                </Button>
              </Link>
              <Link href="/products?category=futbolka">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-3 border-2 hover:bg-pink-50 hover:border-pink-300 transition-all duration-200 bg-transparent"
                >
                  Futbolkalar
                </Button>
              </Link>
            </div>

            {/* Statistika */}
            <div className="flex items-center space-x-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-600">Mahsulotlar</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">1000+</div>
                <div className="text-sm text-gray-600">Mijozlar</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">24/7</div>
                <div className="text-sm text-gray-600">Qo'llab-quvvatlash</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4 lg:gap-6">
              <div className="space-y-4 lg:space-y-6">
                <div className="bg-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <Image
                    src="/images/hero-kids-1.png"
                    alt="Qizlar kiyimi"
                    width={200}
                    height={200}
                    className="w-full h-auto rounded-xl object-cover"
                    priority
                  />
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <Image
                    src="/placeholder.svg?height=160&width=200&text=Futbolkalar&bg=f8fafc"
                    alt="Futbolkalar"
                    width={200}
                    height={160}
                    className="w-full h-auto rounded-xl object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 lg:space-y-6 pt-8">
                <div className="bg-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <Image
                    src="/placeholder.svg?height=160&width=200&text=O'g'il+bolalar&bg=f1f5f9"
                    alt="O'g'il bolalar kiyimi"
                    width={200}
                    height={160}
                    className="w-full h-auto rounded-xl object-cover"
                  />
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <Image
                    src="/placeholder.svg?height=200&width=200&text=Yangi+tug'ilganlar&bg=fef7f0"
                    alt="Yangi tug'ilganlar"
                    width={200}
                    height={200}
                    className="w-full h-auto rounded-xl object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Dekorativ elementlar */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-pink-200 rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-purple-200 rounded-full opacity-60 animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 -right-8 w-12 h-12 bg-yellow-200 rounded-full opacity-60 animate-bounce delay-500"></div>
          </div>
        </div>
      </div>

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <defs>
            <pattern id="hero-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="2" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-pattern)" />
        </svg>
      </div>
    </section>
  )
}
