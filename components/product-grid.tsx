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

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("uz-UZ").format(price) + " so'm"
  }

  const getImageUrl = (imageUrl: string | null | undefined) => {
    if (!imageUrl) {
      return "/placeholder.svg?height=400&width=400&text=Rasm+yo'q"
    }

    // Agar URL to'liq bo'lsa, o'zini qaytarish
    if (imageUrl.startsWith("http")) {
      return imageUrl
    }

    // Agar nisbiy yo'l bo'lsa, placeholder qaytarish
    return "/placeholder.svg?height=400&width=400&text=Rasm+yuklanmagan"
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Hech qanday mahsulot topilmadi</p>
        <Link href="/products">
          <Button className="mt-4 bg-transparent" variant="outline">
            Barcha mahsulotlarni ko'rish
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <CardContent className="p-0">
            <Link href={`/product/${product.id}`}>
              <div className="aspect-square relative bg-gray-100">
                <Image
                  src={getImageUrl(product.image_url) || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={false}
                  onError={(e) => {
                    console.error("Rasm yuklashda xatolik:", product.image_url)
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.svg?height=400&width=400&text=Rasm+xatoligi"
                  }}
                  onLoad={() => {
                    console.log("Rasm muvaffaqiyatli yuklandi:", product.image_url)
                  }}
                />
              </div>
            </Link>
            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
                <p className="text-sm text-gray-500 capitalize">
                  {product.category} • {product.color}
                </p>
              </div>
              <p className="text-lg font-bold text-pink-600">{formatPrice(product.price)}</p>
              <Link href={`/product/${product.id}`}>
                <Button className="w-full bg-pink-600 hover:bg-pink-700">Batafsil ko'rish</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
