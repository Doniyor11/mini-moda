import { sendTelegramMessage } from "@/lib/telegram"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const testMessage = `🧪 <b>TEST XABAR</b>

MiniModa internet-do'koni Telegram integratsiyasi test qilinmoqda.

⏰ Vaqt: ${new Date().toLocaleString("uz-UZ")}

✅ Agar bu xabarni ko'rayotgan bo'lsangiz, integratsiya ishlayapti!

📞 Test telefon: +998 90 123 45 67
📧 Test email: test@minimoda.uz`

    // Inline keyboard bilan test
    const inlineKeyboard = [
      [
        {
          text: "🌐 Saytga o'tish",
          url: "https://minimoda.vercel.app",
        },
      ],
      [
        {
          text: "📋 Admin panel",
          url: "https://minimoda.vercel.app/admin",
        },
      ],
    ]

    console.log("🧪 Test xabar inline keyboard bilan yuborilmoqda...")
    const result = await sendTelegramMessage(testMessage, inlineKeyboard)
    console.log("✅ Test xabar muvaffaqiyatli yuborildi:", result)

    return NextResponse.json({
      success: true,
      message: "Test xabar inline keyboard bilan muvaffaqiyatli yuborildi!",
      telegramResponse: result,
    })
  } catch (error: any) {
    console.error("❌ Test xabar yuborishda xatolik:", error)

    // Fallback: oddiy xabar yuborish
    try {
      console.log("🔄 Oddiy xabar bilan qayta urinish...")
      const simpleMessage = `🧪 TEST XABAR (oddiy)

MiniModa Telegram integratsiyasi ishlayapti!
Vaqt: ${new Date().toLocaleString("uz-UZ")}`

      const fallbackResult = await sendTelegramMessage(simpleMessage)

      return NextResponse.json({
        success: true,
        message: "Test xabar oddiy formatda yuborildi",
        telegramResponse: fallbackResult,
        warning: "Inline keyboard ishlamadi, lekin oddiy xabar yuborildi",
      })
    } catch (fallbackError: any) {
      return NextResponse.json(
        {
          success: false,
          error: "Xabar yuborishda xatolik yuz berdi",
          details: fallbackError.message,
        },
        { status: 500 },
      )
    }
  }
}
