import { supabase } from "@/lib/supabase"
import { ProductGrid } from "@/components/product-grid"
import { ProductFilters } from "@/components/product-filters"
import { Suspense } from "react"

interface SearchParams {
  category?: string
  age_group?: string
  color?: string
  size?: string
  min_price?: string
  max_price?: string
  sort?: string
  search?: string
}

// Cache'ni disable qilish
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  console.log("Products sahifasi yuklanyapti...")

  let query = supabase.from("products").select("*")

  // Filtrlar
  if (searchParams.category) {
    query = query.eq("category", searchParams.category)
  }
  if (searchParams.age_group) {
    query = query.eq("age_group", searchParams.age_group)
  }
  if (searchParams.color) {
    query = query.eq("color", searchParams.color)
  }
  if (searchParams.min_price) {
    query = query.gte("price", Number.parseInt(searchParams.min_price))
  }
  if (searchParams.max_price) {
    query = query.lte("price", Number.parseInt(searchParams.max_price))
  }
  if (searchParams.search) {
    query = query.ilike("name", `%${searchParams.search}%`)
  }

  // Saralash
  if (searchParams.sort === "price_asc") {
    query = query.order("price", { ascending: true })
  } else if (searchParams.sort === "price_desc") {
    query = query.order("price", { ascending: false })
  } else {
    query = query.order("created_at", { ascending: false })
  }

  const { data: products, error } = await query

  if (error) {
    console.error("Mahsulotlarni olishda xatolik:", error)
  } else {
    console.log("Olingan mahsulotlar soni:", products?.length || 0)
    products?.forEach((product, index) => {
      console.log(`Mahsulot ${index + 1}:`, {
        id: product.id,
        name: product.name,
        image_url: product.image_url,
        has_image: !!product.image_url,
      })
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-1/4">
          <Suspense fallback={<div>Yuklanmoqda...</div>}>
            <ProductFilters />
          </Suspense>
        </aside>
        <main className="lg:w-3/4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Mahsulotlar</h1>
            <p className="text-gray-600">{products?.length || 0} ta mahsulot topildi</p>

            {/* Debug ma'lumotlari */}
            {process.env.NODE_ENV === "development" && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
                <p>
                  <strong>Debug:</strong> Ma'lumotlar bazasidan {products?.length || 0} ta mahsulot olindi
                </p>
                <p>
                  <strong>Rasmli mahsulotlar:</strong> {products?.filter((p) => p.image_url).length || 0} ta
                </p>
              </div>
            )}
          </div>
          <ProductGrid products={products || []} />
        </main>
      </div>
    </div>
  )
}
