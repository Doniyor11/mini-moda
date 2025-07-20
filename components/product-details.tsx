"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/context/cart-context"
import { ArrowLeft, ShoppingCart } from "lucide-react"
import Link from "next/link"

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  sizes: string[]
  age_group: string
  color: string
  image_url: string
}

interface ProductDetailsProps {
  product: Product
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("uz-UZ").format(price) + " so'm"
  }

  const getImageUrl = (imageUrl: string | null | undefined) => {
    if (!imageUrl) {
      return "/placeholder.svg?height=600&width=600&text=Rasm+yo'q"
    }

    // Agar URL to'liq bo'lsa, o'zini qaytarish
    if (imageUrl.startsWith("http")) {
      return imageUrl
    }

    // Agar nisbiy yo'l bo'lsa, placeholder qaytarish
    return "/placeholder.svg?height=600&width=600&text=Rasm+yuklanmagan"
  }

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert("Iltimos, o'lchamni tanlang")
      return
    }

    await addToCart(product.id, selectedSize, quantity)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Link href="/products" className="inline-flex items-center text-pink-600 hover:text-pink-700 mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Mahsulotlarga qaytish
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Rasm */}
        <div className="space-y-4">
          <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={getImageUrl(product.image_url) || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={true}
              onError={(e) => {
                console.error("Mahsulot rasmi yuklashda xatolik:", product.image_url)
                const target = e.target as HTMLImageElement
                target.src = "/placeholder.svg?height=600&width=600&text=Rasm+xatoligi"
              }}
              onLoad={() => {
                console.log("Mahsulot rasmi muvaffaqiyatli yuklandi:", product.image_url)
              }}
            />
          </div>

          {/* Debug ma'lumotlari */}
          {process.env.NODE_ENV === "development" && (
            <div className="text-xs text-gray-400 bg-gray-50 p-2 rounded">
              <p>Original URL: {product.image_url || "yo'q"}</p>
              <p>Processed URL: {getImageUrl(product.image_url)}</p>
            </div>
          )}
        </div>

        {/* Ma'lumotlar */}
        <div className="space-y-6">
          <div>
            <Badge variant="secondary" className="mb-2">
              {product.category}
            </Badge>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-2xl font-bold text-pink-600">{formatPrice(product.price)}</p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">Tavsif</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Kategoriya:</span>
              <p className="text-gray-600 capitalize">{product.category}</p>
            </div>
            <div>
              <span className="font-medium">Rang:</span>
              <p className="text-gray-600 capitalize">{product.color}</p>
            </div>
            <div>
              <span className="font-medium">Yosh guruhi:</span>
              <p className="text-gray-600">{product.age_group} yosh</p>
            </div>
          </div>

          {/* O'lcham tanlash */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">O'lcham tanlang</h3>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSize(size)}
                  className={selectedSize === size ? "bg-pink-600 hover:bg-pink-700" : ""}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          {/* Miqdor */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Miqdor</h3>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                -
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button variant="outline" size="sm" onClick={() => setQuantity(quantity + 1)}>
                +
              </Button>
            </div>
          </div>

          {/* Savatga qo'shish */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-medium">Jami:</span>
                <span className="text-xl font-bold text-pink-600">{formatPrice(product.price * quantity)}</span>
              </div>
              <Button onClick={handleAddToCart} className="w-full bg-pink-600 hover:bg-pink-700" size="lg">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Savatga qo'shish
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
