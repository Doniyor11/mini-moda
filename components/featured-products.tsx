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

interface FeaturedProductsProps {
  title: string
  products: Product[]
  viewAllLink?: string
}

export function FeaturedProducts({ title, products, viewAllLink }: FeaturedProductsProps) {
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

  if (products.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
            <p className="text-gray-600">Eng so'nggi qo'shilgan mahsulotlar</p>
          </div>
          {viewAllLink && (
            <Link href={viewAllLink}>
              <Button variant="outline" className="bg-transparent">
                Barchasini ko'rish
              </Button>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product) => (
            <Link key={product.id} href={`/product/${product.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-0">
                  <div className="aspect-square relative bg-gray-100">
                    <Image
                      src={getImageUrl(product.image_url) || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover hover:scale-105 transition-transform"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg?height=300&width=300&text=Xatolik"
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-sm text-gray-500 capitalize mb-2">
                      {product.category} • {product.color}
                    </p>
                    <p className="text-lg font-bold text-pink-600">{formatPrice(product.price)}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
