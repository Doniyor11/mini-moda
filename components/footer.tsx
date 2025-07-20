import Link from "next/link"
import { Facebook, Instagram, MessageCircle, Phone, Mail, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brend ma'lumotlari */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-r from-pink-400 to-purple-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">MM</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                MiniModa
              </span>
            </div>
            <p className="text-gray-300 text-sm">
              0-10 yoshgacha bo'lgan bolalar uchun sifatli va chiroyli kiyim-kechak mahsulotlari. Har bir bola o'zini
              maxsus his qilishi uchun!
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://t.me/minimoda_support" className="text-gray-400 hover:text-pink-400 transition-colors">
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Tezkor havolalar */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tezkor havolalar</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="text-gray-300 hover:text-pink-400 transition-colors">
                  Barcha mahsulotlar
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=futbolka"
                  className="text-gray-300 hover:text-pink-400 transition-colors"
                >
                  Futbolkalar
                </Link>
              </li>
              <li>
                <Link href="/products?category=ko'ylak" className="text-gray-300 hover:text-pink-400 transition-colors">
                  Ko'ylaklar
                </Link>
              </li>
              <li>
                <Link href="/products?category=shim" className="text-gray-300 hover:text-pink-400 transition-colors">
                  Shimlar
                </Link>
              </li>
              <li>
                <Link href="/products?age_group=0-2" className="text-gray-300 hover:text-pink-400 transition-colors">
                  Yangi tug'ilganlar
                </Link>
              </li>
            </ul>
          </div>

          {/* Mijozlar uchun */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Mijozlar uchun</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-pink-400 transition-colors">
                  Biz bilan bog'lanish
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-pink-400 transition-colors">
                  Yetkazib berish
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-pink-400 transition-colors">
                  Qaytarish va almashtirish
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-pink-400 transition-colors">
                  O'lcham jadvali
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-pink-400 transition-colors">
                  Tez-tez so'raladigan savollar
                </a>
              </li>
            </ul>
          </div>

          {/* Aloqa ma'lumotlari */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Aloqa</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-pink-400" />
                <span className="text-gray-300">+998 90 123 45 67</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-pink-400" />
                <span className="text-gray-300">info@minimoda.uz</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-pink-400 mt-0.5" />
                <span className="text-gray-300">Toshkent shahar, Chilonzor tumani</span>
              </div>
              <div className="text-gray-400 text-xs">Ish vaqti: Har kuni 9:00 - 20:00</div>
            </div>
          </div>
        </div>

        {/* Pastki qism */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">© 2024 MiniModa. Barcha huquqlar himoyalangan.</div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                Maxfiylik siyosati
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                Foydalanish shartlari
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                Oferta
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
