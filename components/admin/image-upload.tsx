"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Upload, X, Loader2, ImageIcon, Check } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  currentImageUrl?: string
  onImageChange: (imageUrl: string) => void
  disabled?: boolean
}

export function ImageUpload({ currentImageUrl, onImageChange, disabled }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl || "")
  const [urlInput, setUrlInput] = useState(currentImageUrl || "")
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // currentImageUrl o'zgarganda state'ni yangilash
  useEffect(() => {
    if (currentImageUrl !== previewUrl) {
      setPreviewUrl(currentImageUrl || "")
      setUrlInput(currentImageUrl || "")
    }
  }, [currentImageUrl])

  const validateImageFile = (file: File): string | null => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return "Faqat JPEG, PNG va WebP formatdagi rasmlar qabul qilinadi"
    }

    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return "Rasm hajmi 5MB dan oshmasligi kerak"
    }

    return null
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    console.log("🖼️ Fayl tanlandi:", {
      name: file.name,
      type: file.type,
      size: file.size,
    })

    // Fayl validatsiyasi
    const validationError = validateImageFile(file)
    if (validationError) {
      toast({
        title: "Fayl xatoligi",
        description: validationError,
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    setUploadSuccess(false)

    try {
      // FormData yaratish
      const formData = new FormData()
      formData.append("file", file)

      console.log("📤 API'ga yuborilmoqda...")

      // API'ga yuborish
      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      })

      console.log("📥 API javob:", response.status, response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("❌ API xatoligi:", errorText)
        throw new Error(`Server xatoligi: ${response.status}`)
      }

      const result = await response.json()
      console.log("✅ API natija:", result)

      if (!result.url) {
        throw new Error("Rasm URL'i qaytarilmadi")
      }

      // State'larni yangilash
      const newUrl = result.url
      console.log("🔄 URL yangilanmoqda:", newUrl)

      setPreviewUrl(newUrl)
      setUrlInput(newUrl)
      setUploadSuccess(true)

      // Parent komponentga xabar berish
      onImageChange(newUrl)

      console.log("✅ Rasm muvaffaqiyatli yuklandi va parent'ga yuborildi")

      toast({
        title: "Rasm yuklandi",
        description: "Rasm muvaffaqiyatli yuklandi va saqlandi",
      })

      // Success indikatorini 3 soniyadan keyin yashirish
      setTimeout(() => setUploadSuccess(false), 3000)
    } catch (error: any) {
      console.error("❌ Upload error:", error)
      toast({
        title: "Yuklash xatoligi",
        description: error.message || "Rasmni yuklashda xatolik yuz berdi",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      // Input'ni tozalash
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemoveImage = () => {
    console.log("🗑️ Rasm o'chirilmoqda")
    setPreviewUrl("")
    setUrlInput("")
    setUploadSuccess(false)
    onImageChange("")

    toast({
      title: "Rasm o'chirildi",
      description: "Rasm muvaffaqiyatli o'chirildi",
    })
  }

  const handleUrlChange = (url: string) => {
    setUrlInput(url)
  }

  const handleUrlSubmit = () => {
    const trimmedUrl = urlInput.trim()
    console.log("🔗 URL qo'lda kiritildi:", trimmedUrl)

    if (trimmedUrl && trimmedUrl !== previewUrl) {
      setPreviewUrl(trimmedUrl)
      onImageChange(trimmedUrl)
      console.log("✅ URL yangilandi va parent'ga yuborildi")

      toast({
        title: "URL yangilandi",
        description: "Rasm URL'i muvaffaqiyatli yangilandi",
      })
    } else if (!trimmedUrl) {
      setPreviewUrl("")
      onImageChange("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleUrlSubmit()
    }
  }

  return (
    <div className="space-y-4">
      <Label>Mahsulot rasmi</Label>

      {/* Rasm preview */}
      {previewUrl ? (
        <div className="relative inline-block">
          <div className="w-32 h-32 relative bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
            <Image
              src={previewUrl || "/placeholder.svg"}
              alt="Preview"
              fill
              className="object-cover"
              onError={(e) => {
                console.error("❌ Rasm yuklashda xatolik:", previewUrl)
                setPreviewUrl("")
                setUrlInput("")
                onImageChange("")
                toast({
                  title: "Rasm xatoligi",
                  description: "Rasmni yuklashda xatolik yuz berdi",
                  variant: "destructive",
                })
              }}
              onLoad={() => {
                console.log("✅ Rasm muvaffaqiyatli ko'rsatildi:", previewUrl)
              }}
            />
            {uploadSuccess && (
              <div className="absolute top-1 right-1 bg-green-500 text-white rounded-full p-1">
                <Check className="h-3 w-3" />
              </div>
            )}
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
            onClick={handleRemoveImage}
            disabled={disabled}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div className="w-32 h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
          <ImageIcon className="h-8 w-8 text-gray-400" />
        </div>
      )}

      {/* Fayl yuklash */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || disabled}
            className="bg-transparent"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Yuklanmoqda...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Rasm yuklash
              </>
            )}
          </Button>

          {uploadSuccess && (
            <div className="flex items-center text-green-600 text-sm">
              <Check className="h-4 w-4 mr-1" />
              Yuklandi!
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
            disabled={disabled}
          />
        </div>

        <p className="text-xs text-gray-500">JPEG, PNG, WebP formatida, maksimal 5MB</p>
      </div>

      {/* URL orqali qo'shish */}
      <div className="space-y-2">
        <Label htmlFor="image_url">Yoki URL orqali qo'shing</Label>
        <div className="flex gap-2">
          <Input
            id="image_url"
            value={urlInput}
            onChange={(e) => handleUrlChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="https://example.com/image.jpg"
            disabled={disabled}
            className="flex-1"
          />
          <Button
            type="button"
            onClick={handleUrlSubmit}
            disabled={disabled}
            variant="outline"
            className="bg-transparent"
          >
            Qo'llash
          </Button>
        </div>
        <p className="text-xs text-gray-500">URL kiriting va "Qo'llash" tugmasini bosing</p>
      </div>

      {/* Debug ma'lumotlari */}
      {process.env.NODE_ENV === "development" && (
        <div className="text-xs text-gray-400 bg-gray-50 p-2 rounded border">
          <p>
            <strong>Preview URL:</strong> {previewUrl || "yo'q"}
          </p>
          <p>
            <strong>Input URL:</strong> {urlInput || "yo'q"}
          </p>
          <p>
            <strong>Current URL:</strong> {currentImageUrl || "yo'q"}
          </p>
          <p>
            <strong>Upload Success:</strong> {uploadSuccess ? "Ha" : "Yo'q"}
          </p>
        </div>
      )}
    </div>
  )
}
