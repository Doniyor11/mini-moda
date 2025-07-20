"use client"

import { useCart } from "@/context/cart-context"
import { CartItems } from "@/components/cart-items"
import { CartSummary } from "@/components/cart-summary"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ShoppingBag } from "lucide-react"

export default function CartPage() {
  const { items, totalPrice, totalItems } = useCart()

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto" />
          <h1 className="text-2xl font-bold text-gray-900">Savat bo'sh</h1>
          <p className="text-gray-600">Hozircha savatda hech qanday mahsulot yo'q</p>
          <Link href="/products">
            <Button className="bg-pink-600 hover:bg-pink-700">Xarid qilishni boshlash</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/products" className="inline-flex items-center text-pink-600 hover:text-pink-700 mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Xaridni davom ettirish
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">Savat ({totalItems} ta mahsulot)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CartItems />
        </div>
        <div>
          <CartSummary />
        </div>
      </div>
    </div>
  )
}
