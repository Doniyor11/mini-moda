import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    console.log("Upload API chaqirildi")

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      console.error("Fayl topilmadi")
      return NextResponse.json({ error: "Fayl topilmadi" }, { status: 400 })
    }

    console.log("Fayl ma'lumotlari:", {
      name: file.name,
      type: file.type,
      size: file.size,
    })

    // Fayl validatsiyasi
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      console.error("Noto'g'ri fayl turi:", file.type)
      return NextResponse.json({ error: "Noto'g'ri fayl turi. Faqat JPEG, PNG, WebP qabul qilinadi" }, { status: 400 })
    }

    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      console.error("Fayl hajmi katta:", file.size)
      return NextResponse.json({ error: "Fayl hajmi 5MB dan oshmasligi kerak" }, { status: 400 })
    }

    // Server client yaratish
    const supabase = createServerClient()

    // Fayl nomini unique qilish
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg"
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `products/${fileName}`

    console.log("Fayl yo'li:", filePath)

    // Faylni ArrayBuffer'ga o'tkazish
    const arrayBuffer = await file.arrayBuffer()
    const fileBuffer = new Uint8Array(arrayBuffer)

    console.log("Supabase Storage'ga yuklash boshlandi...")

    // Faylni yuklash
    const { data, error } = await supabase.storage.from("product-images").upload(filePath, fileBuffer, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("Supabase Storage xatoligi:", error)
      return NextResponse.json(
        {
          error: `Storage xatoligi: ${error.message}`,
          details: error,
        },
        { status: 500 },
      )
    }

    console.log("Fayl muvaffaqiyatli yuklandi:", data)

    // Public URL olish
    const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(filePath)

    const publicUrl = urlData.publicUrl

    console.log("Public URL:", publicUrl)

    if (!publicUrl) {
      console.error("Public URL olinmadi")
      return NextResponse.json({ error: "Public URL olinmadi" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      path: filePath,
      fileName: fileName,
    })
  } catch (error: any) {
    console.error("API xatoligi:", error)
    return NextResponse.json(
      {
        error: "Server xatoligi",
        message: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
