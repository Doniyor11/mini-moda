"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Package, Clock, Phone } from "lucide-react"
import Link from "next/link"

interface Order {
  id: string
  full_name: string
  phone: string
  address: string
  total_price: number
  status: string
  created_at: string
  delivery_method: string
  payment_method: string
}

export default function OrderSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("id")
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (orderId) {
      fetchOrder()
    }
  }, [orderId])

  const fetchOrder = async () => {
    try {
      const { data, error } = await supabase.from("orders").select("*").eq("id", orderId).single()

      if (error) throw error
      setOrder(data)
    } catch (error) {
      console.error("Buyurtma ma'lumotlarini olishda xatolik:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("uz-UZ").format(price) + " so'm"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("uz-UZ", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Buyurtma topilmadi</h1>
          <Link href="/products">
            <Button className="bg-pink-600 hover:bg-pink-700">Xaridni boshlash</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Muvaffaqiyat xabari */}
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Buyurtma muvaffaqiyatli berildi!</h1>
          <p className="text-gray-600">Buyurtmangiz qabul qilindi va tez orada ishlov beriladi</p>
        </div>

        {/* Buyurtma tafsilotlari */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Buyurtma ma'lumotlari</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-500">Buyurtma raqami:</span>
                    <p className="font-medium">#{order.id.slice(0, 8)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Sana:</span>
                    <p className="font-medium">{formatDate(order.created_at)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Jami summa:</span>
                    <p className="font-medium text-pink-600">{formatPrice(order.total_price)}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Yetkazib berish</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-500">Mijoz:</span>
                    <p className="font-medium">{order.full_name}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Telefon:</span>
                    <p className="font-medium">{order.phone}</p>
                  </div>
                  {order.address && (
                    <div>
                      <span className="text-gray-500">Manzil:</span>
                      <p className="font-medium">{order.address}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-500">Usul:</span>
                    <p className="font-medium capitalize">
                      {order.delivery_method === "courier" ? "Kuryer orqali" : "O'zi olib ketish"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Keyingi qadamlar */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Keyingi qadamlar</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-pink-600 mt-0.5" />
                <div>
                  <p className="font-medium">Buyurtma tasdiqlanadi</p>
                  <p className="text-sm text-gray-600">Bizning xodimlarimiz tez orada siz bilan bog'lanadi</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Package className="h-5 w-5 text-pink-600 mt-0.5" />
                <div>
                  <p className="font-medium">Mahsulotlar tayyorlanadi</p>
                  <p className="text-sm text-gray-600">
                    Buyurtmangiz qadoqlanadi va yetkazib berish uchun tayyorlanadi
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-pink-600 mt-0.5" />
                <div>
                  <p className="font-medium">Yetkazib berish</p>
                  <p className="text-sm text-gray-600">1-2 ish kuni ichida mahsulotlar yetkazib beriladi</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Harakatlar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products">
            <Button className="bg-pink-600 hover:bg-pink-700">Xaridni davom ettirish</Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" className="bg-transparent">
              Biz bilan bog'lanish
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
