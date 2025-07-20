import { supabase } from "@/lib/supabase"
import { HeroSection } from "@/components/hero-section"
import { CategoryGrid } from "@/components/category-grid"
import { PromoSection } from "@/components/promo-section"
import { FeaturedProducts } from "@/components/featured-products"

// Cache'ni disable qilish
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function HomePage() {
  console.log("🏠 Asosiy sahifa yuklanyapti...")

  // Barcha mahsulotlarni olish
  const { data: allProducts, error: allError } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })

  if (allError) {
    console.error("❌ Barcha mahsulotlarni olishda xatolik:", allError)
  } else {
    console.log("✅ Jami mahsulotlar:", allProducts?.length || 0)
  }

  // Kategoriya bo'yicha mahsulotlar
  const { data: futbolkalar } = await supabase.from("products").select("*").eq("category", "futbolka").limit(4)

  const { data: koylaklar } = await supabase.from("products").select("*").eq("category", "ko'ylak").limit(4)

  const { data: shimlar } = await supabase.from("products").select("*").eq("category", "shim").limit(4)

  const { data: bodilar } = await supabase.from("products").select("*").eq("category", "bodi").limit(4)

  // Yangi mahsulotlar (oxirgi 8 ta)
  const { data: newProducts } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(8)

  console.log("📊 Kategoriya statistikasi:", {
    futbolkalar: futbolkalar?.length || 0,
    koylaklar: koylaklar?.length || 0,
    shimlar: shimlar?.length || 0,
    bodilar: bodilar?.length || 0,
    yangi: newProducts?.length || 0,
  })

  return (
    <div>
      <HeroSection />
      <PromoSection />

      {/* Yangi mahsulotlar */}
      {newProducts && newProducts.length > 0 && (
        <FeaturedProducts title="Yangi mahsulotlar" products={newProducts} viewAllLink="/products?sort=newest" />
      )}

      {/* Kategoriyalar */}
      <CategoryGrid
        futbolkalar={futbolkalar || []}
        koylaklar={koylaklar || []}
        shimlar={shimlar || []}
        bodilar={bodilar || []}
      />

      {/* Debug ma'lumotlari */}
      {process.env.NODE_ENV === "development" && (
        <div className="container mx-auto px-4 py-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-bold text-blue-800 mb-2">🐛 Debug Ma'lumotlari</h3>
            <div className="text-sm text-blue-700 space-y-1">
              <p>
                <strong>Jami mahsulotlar:</strong> {allProducts?.length || 0}
              </p>
              <p>
                <strong>Futbolkalar:</strong> {futbolkalar?.length || 0}
              </p>
              <p>
                <strong>Ko'ylaklar:</strong> {koylaklar?.length || 0}
              </p>
              <p>
                <strong>Shimlar:</strong> {shimlar?.length || 0}
              </p>
              <p>
                <strong>Bodilar:</strong> {bodilar?.length || 0}
              </p>
              <p>
                <strong>Yangi mahsulotlar:</strong> {newProducts?.length || 0}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
