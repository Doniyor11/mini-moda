import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

interface Product {
  id: string
  name: string
  price: number
  image_url: string
  category: string
  color: string
}

interface CategoryGridProps {
  futbolkalar: Product[]
  koylaklar: Product[]
  shimlar: Product[]
  bodilar: Product[]
}

export function CategoryGrid({ futbolkalar, koylaklar, shimlar, bodilar }: CategoryGridProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("uz-UZ").format(price) + " so'm"
  }

  const getImageUrl = (imageUrl: string | null | undefined) => {
    if (!imageUrl) {
      return "/placeholder.svg?height=300&width=300&text=Rasm+yo'q"
    }
    if (imageUrl.startsWith("http")) {
      return imageUrl
    }
    return "/placeholder.svg?height=300&width=300&text=Rasm+yuklanmagan"
  }

  const categories = [
    {
      title: "Futbolkalar",
      description: "Bolalar uchun qulay futbolkalar",
      products: futbolkalar,
      href: "/products?category=futbolka",
      fallbackImage: "/placeholder.svg?height=300&width=300&text=Futbolkalar",
    },
    {
      title: "Ko'ylaklar",
      description: "Qizlar uchun chiroyli ko'ylaklar",
      products: koylaklar,
      href: "/products?category=ko'ylak",
      fallbackImage: "/placeholder.svg?height=300&width=300&text=Ko'ylaklar",
    },
    {
      title: "Shimlar",
      description: "Erkak va qiz bolalar uchun shimlar",
      products: shimlar,
      href: "/products?category=shim",
      fallbackImage: "/placeholder.svg?height=300&width=300&text=Shimlar",
    },
    {
      title: "Bodilar",
      description: "Yangi tug'ilganlar uchun bodilar",
      products: bodilar,
      href: "/products?category=bodi",
      fallbackImage: "/placeholder.svg?height=300&width=300&text=Bodilar",
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Kategoriyalar</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Har xil yosh va stillar uchun kiyimlar</p>
        </div>

        <div className="space-y-16">
          {categories.map((category) => (
            <div key={category.title} className="space-y-6">
              {/* Kategoriya sarlavhasi */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{category.title}</h3>
                  <p className="text-gray-600">{category.description}</p>
                </div>
                <Link href={category.href}>
                  <Button variant="outline" className="bg-transparent">
                    Barchasini ko'rish
                  </Button>
                </Link>
              </div>

              {/* Mahsulotlar grid */}
              {category.products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {category.products.map((product) => (
                    <Link key={product.id} href={`/product/${product.id}`}>
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                        <CardContent className="p-0">
                          <div className="aspect-square relative bg-gray-100">
                            <Image
                              src={getImageUrl(product.image_url) || category.fallbackImage}
                              alt={product.name}
                              fill
                              className="object-cover hover:scale-105 transition-transform"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = category.fallbackImage
                              }}
                            />
                          </div>
                          <div className="p-4">
                            <h4 className="font-semibold text-gray-900 mb-1 line-clamp-1">{product.name}</h4>
                            <p className="text-sm text-gray-500 capitalize mb-2">{product.color}</p>
                            <p className="text-lg font-bold text-pink-600">{formatPrice(product.price)}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                // Agar mahsulot bo'lmasa, placeholder ko'rsatish
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((index) => (
                    <Link key={index} href={category.href}>
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                        <CardContent className="p-0">
                          <div className="aspect-square relative bg-gray-100">
                            <Image
                              src={category.fallbackImage || "/placeholder.svg"}
                              alt={category.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            />
                          </div>
                          <div className="p-4">
                            <h4 className="font-semibold text-gray-900 mb-1">{category.title}</h4>
                            <p className="text-sm text-gray-500">{category.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
