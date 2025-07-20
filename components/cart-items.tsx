"use client"

import { useCart } from "@/context/cart-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, Minus } from "lucide-react"
import Image from "next/image"

export function CartItems() {
  const { items, removeFromCart, updateQuantity } = useCart()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("uz-UZ").format(price) + " so'm"
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              {/* Mahsulot rasmi */}
              <div className="w-20 h-20 relative bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={item.product.image_url || "/placeholder.svg"}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Mahsulot ma'lumotlari */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">{item.product.name}</h3>
                <p className="text-sm text-gray-500">O'lcham: {item.size}</p>
                <p className="text-lg font-semibold text-pink-600">{formatPrice(item.product.price)}</p>
              </div>

              {/* Miqdor boshqaruvi */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                  <Plus className="h-3 w-3" />
                </Button>
              </div>

              {/* Jami narx */}
              <div className="text-right">
                <p className="font-semibold text-gray-900">{formatPrice(item.product.price * item.quantity)}</p>
              </div>

              {/* O'chirish tugmasi */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeFromCart(item.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
