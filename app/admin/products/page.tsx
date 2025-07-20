import { supabase } from "@/lib/supabase"
import { ProductsTable } from "@/components/admin/products-table"
import { Button } from "@/components/ui/button"
import { Plus, RefreshCw } from "lucide-react"
import Link from "next/link"

// Cache'ni disable qilish
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function AdminProductsPage() {
  console.log("Admin products sahifasi yuklanyapti...")

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Admin: Mahsulotlarni olishda xatolik:", error)
  } else {
    console.log("Admin: Olingan mahsulotlar soni:", products?.length || 0)
    products?.forEach((product, index) => {
      console.log(`Admin mahsulot ${index + 1}:`, {
        id: product.id,
        name: product.name,
        image_url: product.image_url,
        has_image: !!product.image_url,
      })
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mahsulotlar</h1>
          <p className="text-gray-600">Barcha mahsulotlarni boshqaring</p>
        </div>
        <div className="flex items-center space-x-2">
          <form action={() => window.location.reload()}>
            <Button type="submit" variant="outline" size="sm" className="bg-transparent">
              <RefreshCw className="h-4 w-4 mr-2" />
              Yangilash
            </Button>
          </form>
          <Link href="/admin/products/new">
            <Button className="bg-pink-600 hover:bg-pink-700">
              <Plus className="h-4 w-4 mr-2" />
              Yangi mahsulot
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistika */}
      {process.env.NODE_ENV === "development" && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded">
          <h3 className="font-medium text-blue-800 mb-2">📊 Statistika</h3>
          <div className="grid grid-cols-2 gap-4 text-sm text-blue-700">
            <p>
              <strong>Jami mahsulotlar:</strong> {products?.length || 0}
            </p>
            <p>
              <strong>Rasmli mahsulotlar:</strong> {products?.filter((p) => p.image_url).length || 0}
            </p>
          </div>
        </div>
      )}

      <ProductsTable products={products || []} />
    </div>
  )
}
