"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { sendContactMessage } from "@/lib/telegram"
import { Loader2, Send } from "lucide-react"

export function ContactForm() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  })

  const subjects = [
    { value: "order", label: "Buyurtma haqida savol" },
    { value: "product", label: "Mahsulot haqida ma'lumot" },
    { value: "delivery", label: "Yetkazib berish" },
    { value: "return", label: "Qaytarish/Almashtirish" },
    { value: "complaint", label: "Shikoyat" },
    { value: "other", label: "Boshqa" },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Telegram'ga xabar yuborish
      const selectedSubject = subjects.find((s) => s.value === formData.subject)?.label || formData.subject

      const message = `📞 <b>YANGI ALOQA XABARI</b>

👤 <b>Ism:</b> ${formData.name}
📱 <b>Telefon:</b> <a href="tel:${formData.phone}">${formData.phone}</a>
📧 <b>Email:</b> ${formData.email || "Ko'rsatilmagan"}
📋 <b>Mavzu:</b> ${selectedSubject}

💬 <b>Xabar:</b>
${formData.message}

⏰ <b>Vaqt:</b> ${new Date().toLocaleString("uz-UZ")}`

      await sendContactMessage(message)

      // Formani tozalash
      setFormData({
        name: "",
        phone: "",
        email: "",
        subject: "",
        message: "",
      })

      toast({
        title: "Xabar yuborildi!",
        description: "Tez orada siz bilan bog'lanamiz",
      })
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Xatolik",
        description: "Xabar yuborishda xatolik yuz berdi. Qaytadan urinib ko'ring.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Ismingiz *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="To'liq ismingizni kiriting"
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
          </div>

          <div>
            <Label htmlFor="email">Email (ixtiyoriy)</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="email@example.com"
              disabled={isLoading}
            />
          </div>

          <div>
            <Label>Mavzu *</Label>
            <Select
              value={formData.subject}
              onValueChange={(value) => setFormData({ ...formData, subject: value })}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Mavzuni tanlang" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.value} value={subject.value}>
                    {subject.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="message">Xabar *</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              placeholder="Xabaringizni batafsil yozing..."
              rows={5}
              disabled={isLoading}
            />
          </div>

          <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Yuborilmoqda...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Xabar yuborish
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
