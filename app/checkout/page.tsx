"use client"

import { useCart } from "@/context/cart-context"
import { CheckoutForm } from "@/components/checkout-form"
import { OrderSummary } from "@/components/order-summary"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CheckoutPage() {
  const { items, totalPrice, totalItems } = useCart()
  const router = useRouter()

  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart")
    }
  }, [items, router])

  if (items.length === 0) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/cart" className="inline-flex items-center text-pink-600 hover:text-pink-700 mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Savatga qaytish
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">Buyurtma berish</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <CheckoutForm />
        </div>
        <div>
          <OrderSummary />
        </div>
      </div>
    </div>
  )
}
