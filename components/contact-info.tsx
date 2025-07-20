"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react"

export function ContactInfo() {
  return (
    <div className="space-y-6">
      {/* Aloqa ma'lumotlari */}
      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-pink-100 rounded-lg">
                <Phone className="h-5 w-5 text-pink-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Telefon</h3>
                <p className="text-gray-600">+998 90 123 45 67</p>
                <p className="text-sm text-gray-500">Har kuni 9:00 - 20:00</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-pink-100 rounded-lg">
                <Mail className="h-5 w-5 text-pink-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Email</h3>
                <p className="text-gray-600">info@minimoda.uz</p>
                <p className="text-sm text-gray-500">24 soat ichida javob beramiz</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-pink-100 rounded-lg">
                <MapPin className="h-5 w-5 text-pink-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Manzil</h3>
                <p className="text-gray-600">Toshkent shahar</p>
                <p className="text-gray-600">Chilonzor tumani</p>
                <p className="text-sm text-gray-500">Aniq manzil buyurtma vaqtida beriladi</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-pink-100 rounded-lg">
                <Clock className="h-5 w-5 text-pink-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Ish vaqti</h3>
                <p className="text-gray-600">Dushanba - Yakshanba</p>
                <p className="text-gray-600">9:00 - 20:00</p>
                <p className="text-sm text-gray-500">Bayramlar bundan mustasno</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tezkor aloqa */}
      <Card className="bg-gradient-to-r from-pink-50 to-purple-50">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="p-3 bg-white rounded-full w-fit mx-auto">
              <MessageCircle className="h-6 w-6 text-pink-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Tezkor yordam kerakmi?</h3>
              <p className="text-sm text-gray-600 mb-4">Telegram orqali tezroq javob olishingiz mumkin</p>
              <Button
                className="bg-pink-600 hover:bg-pink-700"
                onClick={() => window.open("https://t.me/minimoda_support", "_blank")}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Telegram'da yozish
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Qo'shimcha ma'lumot */}
      <Card className="border-l-4 border-l-pink-600">
        <CardContent className="p-4">
          <h3 className="font-medium text-gray-900 mb-2">Muhim ma'lumot</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Buyurtmalar har kuni qabul qilinadi</li>
            <li>• Toshkent bo'ylab bepul yetkazib berish</li>
            <li>• 100,000 so'mdan yuqori buyurtmalarda chegirma</li>
            <li>• Sifat kafolati - 30 kun</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
