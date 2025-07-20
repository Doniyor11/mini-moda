const TELEGRAM_BOT_TOKEN = "7821544940:AAEXLpGVSJolxtrvKceaBiezRVF5RwynbeY"
const TELEGRAM_CHAT_ID = "-4940711522"

export async function sendTelegramMessage(message: string, inlineKeyboard?: any) {
  try {
    const payload: any = {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: "HTML",
    }

    // Agar inline keyboard berilgan bo'lsa, qo'shish
    if (inlineKeyboard) {
      payload.reply_markup = {
        inline_keyboard: inlineKeyboard,
      }
    }

    console.log("📤 Telegram'ga yuborilayotgan payload:", JSON.stringify(payload, null, 2))

    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    const responseData = await response.json()
    console.log("📥 Telegram API javob:", responseData)

    if (!response.ok) {
      console.error("❌ Telegram API xatoligi:", responseData)
      throw new Error(`Telegram API error: ${response.status} - ${responseData.description || "Unknown error"}`)
    }

    return responseData
  } catch (error) {
    console.error("Telegram xabar yuborishda xatolik:", error)
    throw error
  }
}

export async function sendOrderNotification(orderData: any) {
  try {
    const message = formatOrderForTelegram(orderData)

    // Inline keyboard yaratish (tel: URL'siz)
    const inlineKeyboard = [
      [
        {
          text: "📋 Admin panelda ko'rish",
          url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://minimoda.vercel.app"}/admin/orders`,
        },
      ],
      [
        {
          text: "✅ Tasdiqlash",
          callback_data: `confirm_${orderData.id?.slice(0, 8) || "unknown"}`,
        },
        {
          text: "❌ Bekor qilish",
          callback_data: `cancel_${orderData.id?.slice(0, 8) || "unknown"}`,
        },
      ],
    ]

    await sendTelegramMessage(message, inlineKeyboard)
    console.log("✅ Telegram xabari inline keyboard bilan yuborildi")
  } catch (error) {
    console.error("❌ Telegram xabar yuborishda xatolik:", error)
    // Agar inline keyboard bilan xatolik bo'lsa, oddiy xabar yuborishga harakat qilamiz
    try {
      console.log("🔄 Inline keyboard'siz qayta urinish...")
      const simpleMessage = formatOrderForTelegram(orderData)
      await sendTelegramMessage(simpleMessage)
      console.log("✅ Oddiy Telegram xabari yuborildi")
    } catch (fallbackError) {
      console.error("❌ Oddiy xabar ham yuborilmadi:", fallbackError)
      throw fallbackError
    }
  }
}

// HTML belgilarini escape qilish funksiyasi
function escapeHtml(text: string): string {
  if (!text) return ""
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

// Telefon raqamini tozalash va formatlash
function formatPhoneNumber(phone: string): string {
  if (!phone) return "N/A"
  // Faqat raqamlar, + va bo'shliqlarni qoldirish
  const cleaned = phone.replace(/[^\d+\s\-()]/g, "")
  return cleaned || "N/A"
}

export function formatOrderForTelegram(orderData: any) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("uz-UZ").format(price) + " so'm"
  }

  // Ma'lumotlarni tozalash va escape qilish
  const orderId = orderData.id?.slice(0, 8) || "N/A"
  const fullName = escapeHtml(orderData.full_name || "N/A")
  const phone = formatPhoneNumber(orderData.phone || "N/A")
  const address = escapeHtml(orderData.address || "")
  const notes = escapeHtml(orderData.notes || "")

  let message = `🛍️ <b>YANGI BUYURTMA!</b>

📋 <b>Buyurtma raqami:</b> #${orderId}
👤 <b>Mijoz:</b> ${fullName}
📞 <b>Telefon:</b> ${phone}
`

  // Address ni to'g'ri ko'rsatish
  if (orderData.delivery_method === "courier" && address && address.trim() && address !== "O'zi olib ketish") {
    message += `📍 <b>Manzil:</b> ${address}
`
  } else if (orderData.delivery_method === "pickup") {
    message += `📍 <b>Yetkazib berish:</b> O'zi olib ketish
`
  }

  message += `🚚 <b>Usul:</b> ${orderData.delivery_method === "courier" ? "Kuryer orqali" : "O'zi olib ketish"}
💳 <b>To'lov:</b> ${orderData.payment_method === "cash" ? "Naqd pul" : "Plastik karta"}

📦 <b>Mahsulotlar:</b>
`

  if (orderData.items && Array.isArray(orderData.items)) {
    orderData.items.forEach((item: any, index: number) => {
      const productName = escapeHtml(item.product_name || "N/A")
      const size = escapeHtml(item.size || "N/A")
      const quantity = item.quantity || 0
      const price = item.price || 0
      const total = item.total || 0

      message += `${index + 1}. <b>${productName}</b>
   • O'lcham: ${size}
   • Miqdor: ${quantity} ta
   • Narx: ${formatPrice(price)}
   • Jami: ${formatPrice(total)}

`
    })
  }

  message += `💰 <b>JAMI SUMMA: ${formatPrice(orderData.total_price || 0)}</b>

`

  // Notes faqat agar mavjud va bo'sh bo'lmasa
  if (notes && notes.trim()) {
    message += `📝 <b>Izoh:</b> ${notes}

`
  }

  message += `⏰ <b>Vaqt:</b> ${new Date().toLocaleString("uz-UZ")}

🔗 <b>Admin panel:</b> ${process.env.NEXT_PUBLIC_SITE_URL || "https://minimoda.vercel.app"}/admin/orders

💡 <b>Mijozga qo'ng'iroq qilish uchun telefon raqamini nusxalang</b>`

  // Xabar uzunligini tekshirish (Telegram 4096 belgi chegarasi)
  if (message.length > 4000) {
    console.warn("⚠️ Telegram xabari juda uzun, qisqartirilmoqda...")
    message = message.substring(0, 3900) + "\n\n... (qisqartirildi)"
  }

  console.log("📝 Telegram uchun tayyorlangan xabar:", message)
  console.log("📏 Xabar uzunligi:", message.length)

  return message
}

// Contact form uchun alohida function
export async function sendContactMessage(message: string) {
  try {
    // Contact xabarini ham tozalash
    const cleanMessage = escapeHtml(message)
    await sendTelegramMessage(cleanMessage)
    console.log("✅ Contact xabari yuborildi")
  } catch (error) {
    console.error("❌ Contact xabar yuborishda xatolik:", error)
    throw error
  }
}
