import { createServerClient } from "./supabase"

export async function uploadProductImage(file: File): Promise<string> {
  try {
    // Server client ishlatish (RLS bypass uchun)
    const serverClient = createServerClient()

    // Fayl nomini unique qilish
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `products/${fileName}`

    // Faylni Supabase Storage'ga yuklash
    const { data, error } = await serverClient.storage.from("product-images").upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("Storage upload error:", error)
      throw error
    }

    // Public URL olish
    const {
      data: { publicUrl },
    } = serverClient.storage.from("product-images").getPublicUrl(filePath)

    return publicUrl
  } catch (error) {
    console.error("Error uploading image:", error)
    throw new Error("Rasmni yuklashda xatolik yuz berdi")
  }
}

export async function deleteProductImage(imageUrl: string): Promise<void> {
  try {
    // Server client ishlatish
    const serverClient = createServerClient()

    // URL'dan fayl yo'lini ajratib olish
    const url = new URL(imageUrl)
    const pathParts = url.pathname.split("/")
    const filePath = pathParts.slice(-2).join("/") // products/filename.ext

    const { error } = await serverClient.storage.from("product-images").remove([filePath])

    if (error) {
      console.error("Storage delete error:", error)
      throw error
    }
  } catch (error) {
    console.error("Error deleting image:", error)
    // Rasm o'chirishda xatolik bo'lsa ham davom etamiz
  }
}

export function validateImageFile(file: File): string | null {
  // Fayl turi tekshiruvi
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
  if (!allowedTypes.includes(file.type)) {
    return "Faqat JPEG, PNG va WebP formatdagi rasmlar qabul qilinadi"
  }

  // Fayl hajmi tekshiruvi (5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    return "Rasm hajmi 5MB dan oshmasligi kerak"
  }

  return null
}
