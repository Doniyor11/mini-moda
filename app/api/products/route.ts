import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

// Yangi mahsulot qo'shish
export async function POST(request: NextRequest) {
  try {
    console.log("📝 POST /api/products - Yangi mahsulot qo'shish")

    const productData = await request.json()
    console.log("📋 Qabul qilingan ma'lumotlar:", productData)

    // Server client yaratish (RLS bypass uchun)
    const supabase = createServerClient()

    // Ma'lumotlarni validatsiya qilish
    if (!productData.name?.trim()) {
      return NextResponse.json({ error: "Mahsulot nomi kiritilmagan" }, { status: 400 })
    }

    if (!productData.price || productData.price <= 0) {
      return NextResponse.json({ error: "Narx to'g'ri kiritilmagan" }, { status: 400 })
    }

    if (!productData.category) {
      return NextResponse.json({ error: "Kategoriya tanlanmagan" }, { status: 400 })
    }

    // Ma'lumotlar bazasiga saqlash
    const { data, error } = await supabase
      .from("products")
      .insert({
        name: productData.name.trim(),
        description: productData.description?.trim() || "",
        price: Number.parseFloat(productData.price),
        category: productData.category,
        age_group: productData.age_group,
        color: productData.color,
        image_url: productData.image_url || null,
        sizes: productData.sizes || [],
      })
      .select()
      .single()

    if (error) {
      console.error("❌ Ma'lumotlar bazasi xatoligi:", error)
      return NextResponse.json({ error: "Ma'lumotlar bazasiga saqlashda xatolik" }, { status: 500 })
    }

    console.log("✅ Mahsulot muvaffaqiyatli qo'shildi:", data)

    return NextResponse.json({
      success: true,
      product: data,
      message: "Mahsulot muvaffaqiyatli qo'shildi",
    })
  } catch (error: any) {
    console.error("❌ API xatoligi:", error)
    return NextResponse.json({ error: "Server xatoligi" }, { status: 500 })
  }
}

// Barcha mahsulotlarni olish
export async function GET() {
  try {
    console.log("📋 GET /api/products - Barcha mahsulotlarni olish")

    const supabase = createServerClient()

    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("❌ Ma'lumotlar bazasi xatoligi:", error)
      return NextResponse.json({ error: "Ma'lumotlarni olishda xatolik" }, { status: 500 })
    }

    console.log("✅ Mahsulotlar muvaffaqiyatli olindi:", data?.length || 0)

    return NextResponse.json({
      success: true,
      products: data || [],
    })
  } catch (error: any) {
    console.error("❌ API xatoligi:", error)
    return NextResponse.json({ error: "Server xatoligi" }, { status: 500 })
  }
}
