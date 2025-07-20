"use client"

import { useCart } from "@/context/cart-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { getDeliverySettings, calculateDeliveryFee, formatPrice as formatDeliveryPrice } from "@/lib/delivery"

export function CartSummary() {
  const { items, totalPrice, totalItems } = useCart()

  const formatPrice = (price: number) => {
    return formatDeliveryPrice(price)
  }

  const deliverySettings = getDeliverySettings()
  const deliveryFee = calculateDeliveryFee(totalPrice, "courier")
  const finalTotal = totalPrice + deliveryFee

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Buyurtma xulosasi</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
            <span>Jami:</span>
            <span className="text-pink-600">{formatPrice(finalTotal)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Link href="/checkout">
            <Button className="w-full bg-pink-600 hover:bg-pink-700" size="lg">
              Buyurtma berish
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="outline" className="w-full bg-transparent">
              Xaridni davom ettirish
            </Button>
          </Link>
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Bepul yetkazib berish 100,000 so'mdan yuqori buyurtmalar uchun</p>
          <p>• Barcha narxlar so'm hisobida</p>
        </div>
      </CardContent>
    </Card>
  )
}
