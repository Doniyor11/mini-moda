"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ImageUpload } from "@/components/admin/image-upload"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Save, AlertCircle } from "lucide-react"

interface ProductFormProps {
  product?: any
  isEdit?: boolean
}

export function ProductForm({ product, isEdit = false }: ProductFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    category: product?.category || "",
    age_group: product?.age_group || "",
    color: product?.color || "",
    image_url: product?.image_url || "",
    sizes: product?.sizes || [],
  })

  // Product o'zgarganda formData'ni yangilash
  useEffect(() => {
    if (product) {
      console.log("🔄 Product ma'lumotlari yuklandi:", product)
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        category: product.category || "",
        age_group: product.age_group || "",
        color: product.color || "",
        image_url: product.image_url || "",
        sizes: product.sizes || [],
      })
    }
  }, [product])

  const categories = [
    { value: "futbolka", label: "Futbolka" },
    { value: "ko'ylak", label: "Ko'ylak" },
    { value: "shim", label: "Shim" },
    { value: "bodi", label: "Bodi" },
    { value: "kombinatsiya", label: "Kombinatsiya" },
  ]

  const ageGroups = [
    { value: "0-2", label: "0-2 yosh" },
    { value: "3-5", label: "3-5 yosh" },
    { value: "6-10", label: "6-10 yosh" },
  ]

  const colors = [
    { value: "oq", label: "Oq" },
    { value: "qora", label: "Qora" },
    { value: "qizil", label: "Qizil" },
    { value: "ko'k", label: "Ko'k" },
    { value: "yashil", label: "Yashil" },
    { value: "sari", label: "Sari" },
    { value: "pushti", label: "Pushti" },
    { value: "binafsha", label: "Binafsha" },
  ]

  const availableSizes = [
    "0-6 oy",
    "6-12 oy",
    "12-18 oy",
    "1-2",
    "2-3",
    "3-4",
    "4-5",
    "5-6",
    "6-7",
    "7-8",
    "8-9",
    "9-10",
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSizeChange = (size: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      sizes: checked ? [...prev.sizes, size] : prev.sizes.filter((s) => s !== size),
    }))
  }

  const handleImageChange = (imageUrl: string) => {
    console.log("🖼️ ProductForm: Rasm URL o'zgartirildi:", imageUrl)
    setFormData((prev) => ({
      ...prev,
      image_url: imageUrl,
    }))
  }

  const generatePlaceholderImage = () => {
    const query = encodeURIComponent(`${formData.name} ${formData.color} ${formData.category}`)
    return `/placeholder.svg?height=400&width=400&text=${query}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setIsSaving(true)

    try {
      console.log("📝 Form submit boshlandi...")
      console.log("📋 Joriy form ma'lumotlari:", formData)

      // Validatsiya
      if (!formData.name?.trim()) {
        throw new Error("Mahsulot nomini kiriting")
      }
      if (!formData.price || Number.parseFloat(formData.price) <= 0) {
        throw new Error("To'g'ri narx kiriting")
      }
      if (!formData.category) {
        throw new Error("Kategoriyani tanlang")
      }
      if (!formData.age_group) {
        throw new Error("Yosh guruhini tanlang")
      }
      if (!formData.color) {
        throw new Error("Rangni tanlang")
      }
      if (formData.sizes.length === 0) {
        throw new Error("Kamida bitta o'lcham tanlang")
      }

      const price = Number.parseFloat(formData.price)
      if (isNaN(price) || price <= 0) {
        throw new Error("Narx to'g'ri kiritilmagan")
      }

      // Image URL ni tayyorlash
      let finalImageUrl = formData.image_url?.trim()

      // Agar rasm URL'i bo'sh yoki placeholder bo'lsa, yangi placeholder yaratish
      if (!finalImageUrl || finalImageUrl.includes("/placeholder.svg")) {
        finalImageUrl = generatePlaceholderImage()
        console.log("🖼️ Placeholder rasm yaratildi:", finalImageUrl)
      } else {
        console.log("🖼️ Haqiqiy rasm URL ishlatiladi:", finalImageUrl)
      }

      const productData = {
        name: formData.name.trim(),
        description: formData.description?.trim() || "",
        price: price,
        category: formData.category,
        age_group: formData.age_group,
        color: formData.color,
        image_url: finalImageUrl,
        sizes: formData.sizes,
      }

      console.log("💾 Ma'lumotlar bazasiga saqlanayotgan ma'lumotlar:", productData)

      // API orqali saqlash
      const apiUrl = isEdit ? `/api/products/${product.id}` : "/api/products"
      const method = isEdit ? "PUT" : "POST"

      console.log(`📡 API chaqiruvi: ${method} ${apiUrl}`)

      const response = await fetch(apiUrl, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      })

      console.log("📥 API javob:", response.status, response.statusText)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("❌ API xatoligi:", errorData)
        throw new Error(errorData.error || `Server xatoligi: ${response.status}`)
      }

      const result = await response.json()
      console.log("✅ API natija:", result)

      if (result.success && result.product) {
        console.log("✅ Mahsulot muvaffaqiyatli saqlandi:", result.product)

        // Tekshirish: rasm URL to'g'ri saqlandimi?
        if (result.product.image_url !== finalImageUrl) {
          console.warn("⚠️ Rasm URL mos kelmaydi:", {
            expected: finalImageUrl,
            actual: result.product.image_url,
          })
        } else {
          console.log("✅ Rasm URL to'g'ri saqlandi")
        }

        toast({
          title: isEdit ? "Mahsulot yangilandi" : "Mahsulot qo'shildi",
          description: isEdit ? "Mahsulot muvaffaqiyatli yangilandi" : "Yangi mahsulot muvaffaqiyatli qo'shildi",
        })

        // Sahifani yangilash
        setTimeout(() => {
          router.push("/admin/products")
          router.refresh()
        }, 1500)
      } else {
        throw new Error("Server javobida xatolik")
      }
    } catch (error: any) {
      console.error("❌ Mahsulotni saqlashda xatolik:", error)
      toast({
        title: "Xatolik",
        description: error.message || "Mahsulotni saqlashda xatolik yuz berdi",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Debug ma'lumotlari */}
      {process.env.NODE_ENV === "development" && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-sm text-blue-800 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              Debug Ma'lumotlari
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-blue-700 space-y-1">
            <p>
              <strong>Current Image URL:</strong> {formData.image_url || "yo'q"}
            </p>
            <p>
              <strong>Is Edit Mode:</strong> {isEdit ? "Ha" : "Yo'q"}
            </p>
            {product && (
              <p>
                <strong>Product ID:</strong> {product.id}
              </p>
            )}
            <p>
              <strong>Form Valid:</strong>{" "}
              {formData.name && formData.price && formData.category && formData.sizes.length > 0 ? "Ha" : "Yo'q"}
            </p>
            <p>
              <strong>Is Saving:</strong> {isSaving ? "Ha" : "Yo'q"}
            </p>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Asosiy ma'lumotlar */}
          <Card>
            <CardHeader>
              <CardTitle>Asosiy ma'lumotlar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Mahsulot nomi *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Masalan: Oq futbolka"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="description">Tavsif</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Mahsulot haqida batafsil ma'lumot"
                  rows={3}
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="price">Narx (so'm) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  placeholder="45000"
                  disabled={isLoading}
                />
              </div>

              {/* Rasm yuklash */}
              <ImageUpload
                currentImageUrl={formData.image_url}
                onImageChange={handleImageChange}
                disabled={isLoading}
              />
            </CardContent>
          </Card>

          {/* Kategoriya va xususiyatlar */}
          <Card>
            <CardHeader>
              <CardTitle>Kategoriya va xususiyatlar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Kategoriya *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Kategoriyani tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Yosh guruhi *</Label>
                <Select
                  value={formData.age_group}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, age_group: value }))}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Yosh guruhini tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {ageGroups.map((group) => (
                      <SelectItem key={group.value} value={group.value}>
                        {group.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Rang *</Label>
                <Select
                  value={formData.color}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, color: value }))}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Rangni tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {colors.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        {color.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>O'lchamlar * (kamida bittasini tanlang)</Label>
                <div className="grid grid-cols-3 gap-2 mt-2 max-h-40 overflow-y-auto">
                  {availableSizes.map((size) => (
                    <div key={size} className="flex items-center space-x-2">
                      <Checkbox
                        id={size}
                        checked={formData.sizes.includes(size)}
                        onCheckedChange={(checked) => handleSizeChange(size, checked as boolean)}
                        disabled={isLoading}
                      />
                      <Label htmlFor={size} className="text-sm">
                        {size}
                      </Label>
                    </div>
                  ))}
                </div>
                {formData.sizes.length > 0 && (
                  <p className="text-sm text-gray-600 mt-2">Tanlangan: {formData.sizes.join(", ")}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
            className="bg-transparent"
          >
            Bekor qilish
          </Button>
          <Button type="submit" className="bg-pink-600 hover:bg-pink-700" disabled={isLoading}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saqlanmoqda...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isEdit ? "Yangilash" : "Saqlash"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
