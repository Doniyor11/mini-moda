import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/context/cart-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { ErrorBoundary } from "@/components/error-boundary"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MiniModa - Bolalar kiyimi",
  description: "0-10 yoshgacha bo'lgan bolalar uchun sifatli va chiroyli kiyim-kechak",
  keywords: "bolalar kiyimi, futbolka, ko'ylak, shim, Toshkent, Uzbekistan",
  authors: [{ name: "MiniModa" }],
  openGraph: {
    title: "MiniModa - Bolalar kiyimi",
    description: "0-10 yoshgacha bo'lgan bolalar uchun sifatli va chiroyli kiyim-kechak",
    type: "website",
    locale: "uz_UZ",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uz">
      <body className={inter.className}>
        <ErrorBoundary>
          <CartProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </CartProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
