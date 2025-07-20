import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { sendOrderNotification } from "@/lib/telegram"

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json()

    console.log("📝 Buyurtma ma'lumotlari:", requestData)

    // Server client yaratish (RLS bypass uchun)
    const supabase = createServerClient()

    // Address ni to'g'ri handle qilish
    let address = null
    if (requestData.delivery_method === "courier" && requestData.address) {
      address = requestData.address.trim()
    } else if (requestData.delivery_method === "pickup") {
      address = "O'zi olib ketish" // Pickup uchun default qiymat
    } else if (requestData.address) {
      address = requestData.address.trim()
    }

    // Ma'lumotlar bazasi uchun orderData
    const orderData = {
      items: requestData.items,
      total_price: requestData.total_price,
      full_name: requestData.full_name.trim(),
      phone: requestData.phone.trim(),
      address: address, // null yoki string
      delivery_method: requestData.delivery_method,
      payment_method: requestData.payment_method,
      status: requestData.status || "new",
      guest_id: requestData.guest_id,
    }

    console.log("💾 Ma'lumotlar bazasiga saqlanayotgan ma'lumotlar:", orderData)

    // Buyurtmani saqlash
    const { data, error } = await supabase.from("orders").insert(orderData).select().single()

    if (error) {
      console.error("❌ Database error:", error)
      return NextResponse.json(
        {
          error: "Ma'lumotlar bazasi xatoligi: " + error.message,
          details: error,
        },
        { status: 500 },
      )
    }

    console.log("✅ Buyurtma muvaffaqiyatli saqlandi:", data)

    // Telegram uchun to'liq ma'lumotlar (notes bilan)
    const telegramData = {
      ...orderData,
      id: data.id,
      notes: requestData.notes, // Faqat Telegram uchun
    }

    // Telegram'ga xabar yuborish (xatolik buyurtma jarayonini to'xtatmasin)
    try {
      console.log("📤 Telegram'ga xabar yuborilmoqda...")
      await sendOrderNotification(telegramData)
      console.log("✅ Telegram xabari muvaffaqiyatli yuborildi")
    } catch (telegramError) {
      console.error("❌ Telegram xabar yuborishda xatolik:", telegramError)
      // Telegram xatoligi buyurtma jarayonini to'xtatmasin - faqat log qilamiz
      console.log("⚠️ Buyurtma saqlandi, lekin Telegram xabari yuborilmadi")
    }

    return NextResponse.json({ success: true, order: data })
  } catch (error) {
    console.error("❌ API error:", error)
    return NextResponse.json(
      {
        error: "Server xatoligi: " + (error as Error).message,
        details: error,
      },
      { status: 500 },
    )
  }
}
