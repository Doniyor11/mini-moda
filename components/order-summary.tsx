"use client"

import { useCart } from "@/context/cart-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

export function OrderSummary() {
  const { items, totalPrice, totalItems } = useCart()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("uz-UZ").format(price) + " so'm"
  }

  const deliveryFee = 15000
  const finalTotal = totalPrice + deliveryFee

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Buyurtma tafsilotlari</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mahsulotlar ro'yxati */}
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-3">
              <div className="w-12 h-12 relative bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={item.product.image_url || "/placeholder.svg"}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{item.product.name}</p>
                <p className="text-xs text-gray-500">
                  {item.size} • {item.quantity} ta
                </p>
              </div>
              <p className="text-sm font-medium">{formatPrice(item.product.price * item.quantity)}</p>
            </div>
          ))}
        </div>

        <Separator />

        {/* Narx hisob-kitobi */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Mahsulotlar ({totalItems} ta):</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Yetkazib berish:</span>
            <span>{formatPrice(deliveryFee)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold text-lg">
            <span>Jami to'lov:</span>
            <span className="text-pink-600">{formatPrice(finalTotal)}</span>
          </div>
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Buyurtma tasdiqlanganidan keyin 1-2 ish kuni ichida yetkazib beriladi</p>
          <p>• 100,000 so'mdan yuqori buyurtmalar uchun yetkazib berish bepul</p>
        </div>
      </CardContent>
    </Card>
  )
}
