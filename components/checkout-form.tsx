"use client"

import type React from "react"

import { useState } from "react"
import { useCart } from "@/context/cart-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { calculateDeliveryFee } from "@/lib/delivery"

export function CheckoutForm() {
  const { items, totalPrice, clearCart } = useCart()
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    deliveryMethod: "courier",
    paymentMethod: "cash",
    notes: "",
  })

  const deliveryFee = calculateDeliveryFee(totalPrice, formData.deliveryMethod)
  const finalTotal = totalPrice + deliveryFee

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log("📝 Form submit boshlandi...")
    console.log("📋 Form ma'lumotlari:", formData)

    // Validatsiya
    if (!formData.fullName.trim() || !formData.phone.trim()) {
      toast({
        title: "Xatolik",
        description: "Ism va telefon raqamni to'ldiring",
        variant: "destructive",
      })
      return
    }

    if (formData.deliveryMethod === "courier" && !formData.address.trim()) {
      toast({
        title: "Xatolik",
        description: "Kuryer uchun manzilni kiriting",
        variant: "destructive",
      })
      return
    }

    if (items.length === 0) {
      toast({
        title: "Xatolik",
        description: "Savat bo'sh",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Buyurtma ma'lumotlarini tayyorlash
      const orderData = {
        items: items.map((item) => ({
          product_id: item.product_id,
          product_name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          size: item.size,
          total: item.product.price * item.quantity,
        })),
        total_price: finalTotal,
        full_name: formData.fullName.trim(),
        phone: formData.phone.trim(),
        address: formData.deliveryMethod === "courier" ? formData.address.trim() : "", // Bo'sh string yuborish
        delivery_method: formData.deliveryMethod,
        payment_method: formData.paymentMethod,
        status: "new",
        guest_id: localStorage.getItem("guest_id"),
        notes: formData.notes.trim(), // Faqat Telegram uchun
      }

      console.log("📤 API'ga yuborilayotgan ma'lumotlar:", orderData)

      // API'ga yuborish
      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      console.log("📥 API javob:", response.status, response.statusText)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("❌ API xatoligi:", errorData)
        throw new Error(errorData.error || "Buyurtma berishda xatolik")
      }

      const { order } = await response.json()
      console.log("✅ Buyurtma muvaffaqiyatli yaratildi:", order)

      // Savatni tozalash
      await clearCart()

      toast({
        title: "Buyurtma muvaffaqiyatli berildi!",
        description: `Buyurtma raqami: ${order.id.slice(0, 8)}`,
      })

      // Muvaffaqiyat sahifasiga yo'naltirish
      router.push(`/order-success?id=${order.id}`)
    } catch (error: any) {
      console.error("❌ Buyurtma berishda xatolik:", error)

      let errorMessage = "Buyurtma berishda xatolik yuz berdi. Qaytadan urinib ko'ring."

      if (error.message?.includes("network") || error.message?.includes("fetch")) {
        errorMessage = "Internet aloqasi bilan muammo. Iltimos, qaytadan urinib ko'ring."
      } else if (error.message?.includes("validation")) {
        errorMessage = "Ma'lumotlarni to'g'ri kiriting."
      } else if (error.message?.includes("address")) {
        errorMessage = "Manzil ma'lumotlarida xatolik. Iltimos, tekshirib ko'ring."
      }

      toast({
        title: "Xatolik",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Shaxsiy ma'lumotlar */}
      <Card>
        <CardHeader>
          <CardTitle>Shaxsiy ma'lumotlar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="fullName">To'liq ism *</Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
              placeholder="Ismingizni kiriting"
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="phone">Telefon raqam *</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              required
              placeholder="+998 90 123 45 67"
              disabled={isLoading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Yetkazib berish */}
      <Card>
        <CardHeader>
          <CardTitle>Yetkazib berish</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Yetkazib berish usuli</Label>
            <RadioGroup
              value={formData.deliveryMethod}
              onValueChange={(value) => setFormData({ ...formData, deliveryMethod: value })}
              className="mt-2"
              disabled={isLoading}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="courier" id="courier" />
                <Label htmlFor="courier">Kuryer orqali (15,000 so'm)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pickup" id="pickup" />
                <Label htmlFor="pickup">O'zi olib ketish (bepul)</Label>
              </div>
            </RadioGroup>
          </div>

          {formData.deliveryMethod === "courier" && (
            <div>
              <Label htmlFor="address">Yetkazib berish manzili *</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required={formData.deliveryMethod === "courier"}
                placeholder="To'liq manzilni kiriting (ko'cha, uy raqami, kvartira)"
                rows={3}
                disabled={isLoading}
              />
              <p className="text-sm text-gray-500 mt-1">
                Masalan: Toshkent shahar, Chilonzor tumani, Bunyodkor ko'chasi, 12-uy, 45-kvartira
              </p>
            </div>
          )}

          {formData.deliveryMethod === "pickup" && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">📍 Olib ketish manzili</h4>
              <p className="text-sm text-blue-700">
                <strong>Manzil:</strong> Toshkent shahar, Chilonzor tumani
                <br />
                <strong>Ish vaqti:</strong> Har kuni 9:00 - 20:00
                <br />
                <strong>Telefon:</strong> +998 90 123 45 67
              </p>
              <p className="text-xs text-blue-600 mt-2">Aniq manzil buyurtma tasdiqlanganidan keyin beriladi</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* To'lov usuli */}
      <Card>
        <CardHeader>
          <CardTitle>To'lov usuli</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={formData.paymentMethod}
            onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
            disabled={isLoading}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cash" id="cash" />
              <Label htmlFor="cash">Naqd pul</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card">Plastik karta</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Qo'shimcha izoh */}
      <Card>
        <CardHeader>
          <CardTitle>Qo'shimcha ma'lumot</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="notes">Izoh (ixtiyoriy)</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Buyurtma haqida qo'shimcha ma'lumot"
              rows={3}
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">Bu izoh faqat Telegram xabarida ko'rsatiladi</p>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700" size="lg" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Buyurtma berilmoqda...
          </>
        ) : (
          `Buyurtmani tasdiqlash (${new Intl.NumberFormat("uz-UZ").format(finalTotal)} so'm)`
        )}
      </Button>
    </form>
  )
}
