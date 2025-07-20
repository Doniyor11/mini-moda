"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Save, Truck } from "lucide-react"

interface DeliverySettings {
  deliveryFee: string
  freeDeliveryLimit: string
  courierFee: string
  expressDeliveryFee: string
}

export function DeliverySettings() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState<DeliverySettings>({
    deliveryFee: "15000",
    freeDeliveryLimit: "100000",
    courierFee: "15000",
    expressDeliveryFee: "25000",
  })

  useEffect(() => {
    // Local storage'dan sozlamalarni yuklash
    const savedSettings = localStorage.getItem("delivery_settings")
    if (savedSettings) {
      setSettings({ ...settings, ...JSON.parse(savedSettings) })
    }
  }, [])

  const handleInputChange = (key: keyof DeliverySettings, value: string) => {
    setSettings({
      ...settings,
      [key]: value,
    })
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Validatsiya
      const deliveryFee = Number.parseInt(settings.deliveryFee)
      const freeDeliveryLimit = Number.parseInt(settings.freeDeliveryLimit)
      const courierFee = Number.parseInt(settings.courierFee)
      const expressDeliveryFee = Number.parseInt(settings.expressDeliveryFee)

      if (isNaN(deliveryFee) || deliveryFee < 0) {
        throw new Error("Yetkazib berish narxi to'g'ri kiritilmagan")
      }
      if (isNaN(freeDeliveryLimit) || freeDeliveryLimit < 0) {
        throw new Error("Bepul yetkazib berish chegarasi to'g'ri kiritilmagan")
      }
      if (isNaN(courierFee) || courierFee < 0) {
        throw new Error("Kuryer narxi to'g'ri kiritilmagan")
      }
      if (isNaN(expressDeliveryFee) || expressDeliveryFee < 0) {
        throw new Error("Tezkor yetkazib berish narxi to'g'ri kiritilmagan")
      }

      // Local storage'ga saqlash
      localStorage.setItem("delivery_settings", JSON.stringify(settings))

      // Global settings'ga ham saqlash
      const globalSettings = JSON.parse(localStorage.getItem("admin_settings") || "{}")
      const updatedGlobalSettings = {
        ...globalSettings,
        ...settings,
      }
      localStorage.setItem("admin_settings", JSON.stringify(updatedGlobalSettings))

      toast({
        title: "Sozlamalar saqlandi",
        description: "Yetkazib berish sozlamalari muvaffaqiyatli yangilandi",
      })
    } catch (error: any) {
      toast({
        title: "Xatolik",
        description: error.message || "Sozlamalarni saqlashda xatolik yuz berdi",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (price: string) => {
    const num = Number.parseInt(price || "0")
    return new Intl.NumberFormat("uz-UZ").format(num) + " so'm"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Truck className="h-5 w-5 mr-2" />
          Yetkazib berish sozlamalari
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="deliveryFee">Oddiy yetkazib berish (so'm)</Label>
            <Input
              id="deliveryFee"
              type="number"
              min="0"
              step="1000"
              value={settings.deliveryFee}
              onChange={(e) => handleInputChange("deliveryFee", e.target.value)}
              placeholder="15000"
              disabled={isLoading}
            />
            <p className="text-sm text-gray-500 mt-1">{formatPrice(settings.deliveryFee)}</p>
          </div>

          <div>
            <Label htmlFor="courierFee">Kuryer orqali yetkazib berish (so'm)</Label>
            <Input
              id="courierFee"
              type="number"
              min="0"
              step="1000"
              value={settings.courierFee}
              onChange={(e) => handleInputChange("courierFee", e.target.value)}
              placeholder="15000"
              disabled={isLoading}
            />
            <p className="text-sm text-gray-500 mt-1">{formatPrice(settings.courierFee)}</p>
          </div>

          <div>
            <Label htmlFor="expressDeliveryFee">Tezkor yetkazib berish (so'm)</Label>
            <Input
              id="expressDeliveryFee"
              type="number"
              min="0"
              step="1000"
              value={settings.expressDeliveryFee}
              onChange={(e) => handleInputChange("expressDeliveryFee", e.target.value)}
              placeholder="25000"
              disabled={isLoading}
            />
            <p className="text-sm text-gray-500 mt-1">{formatPrice(settings.expressDeliveryFee)}</p>
          </div>

          <div>
            <Label htmlFor="freeDeliveryLimit">Bepul yetkazib berish chegarasi (so'm)</Label>
            <Input
              id="freeDeliveryLimit"
              type="number"
              min="0"
              step="10000"
              value={settings.freeDeliveryLimit}
              onChange={(e) => handleInputChange("freeDeliveryLimit", e.target.value)}
              placeholder="100000"
              disabled={isLoading}
            />
            <p className="text-sm text-gray-500 mt-1">
              {formatPrice(settings.freeDeliveryLimit)} dan yuqori buyurtmalar uchun bepul
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">💡 Maslahat</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Raqobatbardosh narxlar belgilang</li>
            <li>• Bepul yetkazib berish chegarasini optimal qilib qo'ying</li>
            <li>• Tezkor yetkazib berish uchun qo'shimcha haq oling</li>
            <li>• Mijozlar uchun aniq va tushunarli bo'lsin</li>
          </ul>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isLoading} className="bg-pink-600 hover:bg-pink-700">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saqlanmoqda...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Sozlamalarni saqlash
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
