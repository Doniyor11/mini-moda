"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Save, TestTube, MapPin } from "lucide-react"
import { sendTelegramMessage } from "@/lib/telegram"
import { DeliverySettings } from "@/components/admin/delivery-settings"

export default function AdminSettingsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isTesting, setIsTesting] = useState(false)

  const [settings, setSettings] = useState({
    // Do'kon ma'lumotlari
    shopName: "MiniModa",
    shopDescription: "Bolalar uchun sifatli va chiroyli kiyim-kechak mahsulotlari",
    phone: "+998 90 123 45 67",
    email: "info@minimoda.uz",
    address: "Toshkent, O'zbekiston",

    // Yetkazib berish
    deliveryFee: "15000",
    freeDeliveryLimit: "100000",

    // Telegram
    telegramEnabled: true,
    telegramBotToken: "7821544940:AAEXLpGVSJolxtrvKceaBiezRVF5RwynbeY",
    telegramChatId: "-4940711522",

    // Boshqa sozlamalar
    maintenanceMode: false,
    allowGuestOrders: true,
  })

  useEffect(() => {
    // Local storage'dan sozlamalarni yuklash
    const savedSettings = localStorage.getItem("admin_settings")
    if (savedSettings) {
      setSettings({ ...settings, ...JSON.parse(savedSettings) })
    }
  }, [])

  const handleInputChange = (key: string, value: string | boolean) => {
    setSettings({
      ...settings,
      [key]: value,
    })
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Local storage'ga saqlash
      localStorage.setItem("admin_settings", JSON.stringify(settings))

      toast({
        title: "Sozlamalar saqlandi",
        description: "Barcha sozlamalar muvaffaqiyatli saqlandi",
      })
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Sozlamalarni saqlashda xatolik yuz berdi",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testTelegram = async () => {
    setIsTesting(true)
    try {
      const testMessage = `🧪 <b>SOZLAMALAR TESTI</b>

✅ MiniModa admin panelidan test xabar

📱 Bot Token: ${settings.telegramBotToken.slice(0, 10)}...
💬 Chat ID: ${settings.telegramChatId}

⏰ Test vaqti: ${new Date().toLocaleString("uz-UZ")}`

      await sendTelegramMessage(testMessage)

      toast({
        title: "Telegram test muvaffaqiyatli",
        description: "Test xabar Telegram'ga yuborildi",
      })
    } catch (error) {
      toast({
        title: "Telegram test xatoligi",
        description: "Telegram sozlamalarini tekshiring",
        variant: "destructive",
      })
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sozlamalar</h1>
        <p className="text-gray-600">Tizim sozlamalarini boshqaring</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Do'kon ma'lumotlari */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Do'kon ma'lumotlari
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="shopName">Do'kon nomi</Label>
              <Input
                id="shopName"
                value={settings.shopName}
                onChange={(e) => handleInputChange("shopName", e.target.value)}
                placeholder="MiniModa"
              />
            </div>

            <div>
              <Label htmlFor="shopDescription">Tavsif</Label>
              <Textarea
                id="shopDescription"
                value={settings.shopDescription}
                onChange={(e) => handleInputChange("shopDescription", e.target.value)}
                placeholder="Do'kon haqida qisqacha ma'lumot"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="phone">Telefon raqam</Label>
              <Input
                id="phone"
                value={settings.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+998 90 123 45 67"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="info@minimoda.uz"
              />
            </div>

            <div>
              <Label htmlFor="address">Manzil</Label>
              <Input
                id="address"
                value={settings.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Toshkent, O'zbekiston"
              />
            </div>
          </CardContent>
        </Card>

        {/* Yetkazib berish sozlamalari */}
        <Card>
          <CardHeader>
            <CardTitle>Yetkazib berish</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="deliveryFee">Yetkazib berish narxi (so'm)</Label>
              <Input
                id="deliveryFee"
                type="number"
                value={settings.deliveryFee}
                onChange={(e) => handleInputChange("deliveryFee", e.target.value)}
                placeholder="15000"
              />
            </div>

            <div>
              <Label htmlFor="freeDeliveryLimit">Bepul yetkazib berish chegarasi (so'm)</Label>
              <Input
                id="freeDeliveryLimit"
                type="number"
                value={settings.freeDeliveryLimit}
                onChange={(e) => handleInputChange("freeDeliveryLimit", e.target.value)}
                placeholder="100000"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Mehmon buyurtmalariga ruxsat</Label>
                <p className="text-sm text-gray-600">Ro'yxatdan o'tmagan foydalanuvchilar buyurtma bera oladi</p>
              </div>
              <Switch
                checked={settings.allowGuestOrders}
                onCheckedChange={(checked) => handleInputChange("allowGuestOrders", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Telegram sozlamalari */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Telegram integratsiyasi</span>
              <Button
                onClick={testTelegram}
                disabled={isTesting || !settings.telegramEnabled}
                variant="outline"
                size="sm"
                className="bg-transparent"
              >
                {isTesting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Test...
                  </>
                ) : (
                  <>
                    <TestTube className="h-4 w-4 mr-2" />
                    Test
                  </>
                )}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Telegram bildirishnomalarini yoqish</Label>
                <p className="text-sm text-gray-600">Yangi buyurtmalar haqida Telegram'ga xabar yuborish</p>
              </div>
              <Switch
                checked={settings.telegramEnabled}
                onCheckedChange={(checked) => handleInputChange("telegramEnabled", checked)}
              />
            </div>

            {settings.telegramEnabled && (
              <>
                <div>
                  <Label htmlFor="telegramBotToken">Bot Token</Label>
                  <Input
                    id="telegramBotToken"
                    value={settings.telegramBotToken}
                    onChange={(e) => handleInputChange("telegramBotToken", e.target.value)}
                    placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
                    type="password"
                  />
                </div>

                <div>
                  <Label htmlFor="telegramChatId">Chat ID</Label>
                  <Input
                    id="telegramChatId"
                    value={settings.telegramChatId}
                    onChange={(e) => handleInputChange("telegramChatId", e.target.value)}
                    placeholder="-1234567890"
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Yetkazib berish sozlamalari */}
        <div className="lg:col-span-2">
          <DeliverySettings />
        </div>

        {/* Tizim sozlamalari */}
        <Card>
          <CardHeader>
            <CardTitle>Tizim sozlamalari</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Texnik ishlar rejimi</Label>
                <p className="text-sm text-gray-600">Sayt vaqtincha yopiladi, faqat admin kirishi mumkin</p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => handleInputChange("maintenanceMode", checked)}
              />
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">Diqqat!</h4>
              <p className="text-sm text-yellow-700">
                Texnik ishlar rejimini yoqsangiz, oddiy foydalanuvchilar saytga kira olmaydi.
              </p>
            </div>
          </CardContent>
        </Card>
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
    </div>
  )
}
