import { ProductForm } from "@/components/admin/product-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/admin/products" className="text-pink-600 hover:text-pink-700">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Yangi mahsulot qo'shish</h1>
          <p className="text-gray-600">Yangi mahsulot ma'lumotlarini kiriting</p>
        </div>
      </div>

      <ProductForm />
    </div>
  )
}
