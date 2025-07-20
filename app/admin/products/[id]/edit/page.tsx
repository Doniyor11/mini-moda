import { supabase } from "@/lib/supabase"
import { ProductForm } from "@/components/admin/product-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const { data: product, error } = await supabase.from("products").select("*").eq("id", params.id).single()

  if (error || !product) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/admin/products" className="text-pink-600 hover:text-pink-700">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mahsulotni tahrirlash</h1>
          <p className="text-gray-600">{product.name}</p>
        </div>
      </div>

      <ProductForm product={product} isEdit={true} />
    </div>
  )
}
