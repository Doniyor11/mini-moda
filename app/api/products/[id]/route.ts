import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { deleteProductImage } from "@/lib/upload"

// Mahsulotni yangilash
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = params.id
    console.log("✏️ PUT /api/products/[id] - Mahsulotni yangilash, ID:", productId)

    const productData = await request.json()
    console.log("📋 Yangilanayotgan ma'lumotlar:", productData)

    // Server client yaratish
    const supabase = createServerClient()

    // Avval mavjud mahsulotni olish
    const { data: existingProduct, error: fetchError } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single()

    if (fetchError || !existingProduct) {
      console.error("❌ Mahsulot topilmadi:", fetchError)
      return NextResponse.json({ error: "Mahsulot topilmadi" }, { status: 404 })
    }

    console.log("📋 Mavjud mahsulot:", existingProduct)

    // Agar rasm o'zgargan bo'lsa, eski rasmni o'chirish
    if (
      existingProduct.image_url &&
      existingProduct.image_url !== productData.image_url &&
      existingProduct.image_url.includes("supabase") &&
      !existingProduct.image_url.includes("/placeholder.svg")
    ) {
      try {
        console.log("🗑️ Eski rasm o'chirilmoqda:", existingProduct.image_url)
        await deleteProductImage(existingProduct.image_url)
      } catch (error) {
        console.error("⚠️ Eski rasmni o'chirishda xatolik:", error)
        // Rasm o'chirishda xatolik bo'lsa ham davom etamiz
      }
    }

    // Mahsulotni yangilash
    const { data, error } = await supabase
      .from("products")
      .update({
        name: productData.name.trim(),
        description: productData.description?.trim() || "",
        price: Number.parseFloat(productData.price),
        category: productData.category,
        age_group: productData.age_group,
        color: productData.color,
        image_url: productData.image_url || null,
        sizes: productData.sizes || [],
      })
      .eq("id", productId)
      .select()
      .single()

    if (error) {
      console.error("❌ Ma'lumotlar bazasi xatoligi:", error)
      return NextResponse.json({ error: "Mahsulotni yangilashda xatolik" }, { status: 500 })
    }

    console.log("✅ Mahsulot muvaffaqiyatli yangilandi:", data)

    return NextResponse.json({
      success: true,
      product: data,
      message: "Mahsulot muvaffaqiyatli yangilandi",
    })
  } catch (error: any) {
    console.error("❌ API xatoligi:", error)
    return NextResponse.json({ error: "Server xatoligi" }, { status: 500 })
  }
}

// Mahsulotni o'chirish
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = params.id
    console.log("🗑️ DELETE /api/products/[id] - Mahsulotni o'chirish, ID:", productId)

    // Server client yaratish
    const supabase = createServerClient()

    // Avval mahsulotni olish (rasm URL'i uchun)
    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single()

    if (fetchError || !product) {
      console.error("❌ Mahsulot topilmadi:", fetchError)
      return NextResponse.json({ error: "Mahsulot topilmadi" }, { status: 404 })
    }

    console.log("📋 O'chiriladigan mahsulot:", product)

    // Agar Supabase Storage'da rasm bo'lsa, uni o'chirish
    if (
      product.image_url &&
      product.image_url.includes("supabase") &&
      !product.image_url.includes("/placeholder.svg")
    ) {
      try {
        console.log("🗑️ Rasm o'chirilmoqda:", product.image_url)
        await deleteProductImage(product.image_url)
        console.log("✅ Rasm muvaffaqiyatli o'chirildi")
      } catch (error) {
        console.error("⚠️ Rasmni o'chirishda xatolik:", error)
        // Rasm o'chirishda xatolik bo'lsa ham mahsulotni o'chirishni davom ettiramiz
      }
    }

    // Mahsulotni ma'lumotlar bazasidan o'chirish
    const { error: deleteError } = await supabase.from("products").delete().eq("id", productId)

    if (deleteError) {
      console.error("❌ Ma'lumotlar bazasidan o'chirishda xatolik:", deleteError)
      return NextResponse.json({ error: "Mahsulotni o'chirishda xatolik" }, { status: 500 })
    }

    console.log("✅ Mahsulot muvaffaqiyatli o'chirildi")

    return NextResponse.json({
      success: true,
      message: "Mahsulot muvaffaqiyatli o'chirildi",
    })
  } catch (error: any) {
    console.error("❌ API xatoligi:", error)
    return NextResponse.json({ error: "Server xatoligi" }, { status: 500 })
  }
}

// Bitta mahsulotni olish
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = params.id
    console.log("📋 GET /api/products/[id] - Bitta mahsulotni olish, ID:", productId)

    const supabase = createServerClient()

    const { data, error } = await supabase.from("products").select("*").eq("id", productId).single()

    if (error || !data) {
      console.error("❌ Mahsulot topilmadi:", error)
      return NextResponse.json({ error: "Mahsulot topilmadi" }, { status: 404 })
    }

    console.log("✅ Mahsulot muvaffaqiyatli olindi:", data)

    return NextResponse.json({
      success: true,
      product: data,
    })
  } catch (error: any) {
    console.error("❌ API xatoligi:", error)
    return NextResponse.json({ error: "Server xatoligi" }, { status: 500 })
  }
}
