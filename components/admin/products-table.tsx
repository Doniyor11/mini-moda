"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Edit, Trash2, Search, Eye, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  sizes: string[]
  age_group: string
  color: string
  image_url: string
  created_at: string
}

interface ProductsTableProps {
  products: Product[]
}

export function ProductsTable({ products: initialProducts }: ProductsTableProps) {
  const [products, setProducts] = useState(initialProducts)
  const [searchQuery, setSearchQuery] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { toast } = useToast()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("uz-UZ").format(price) + " so'm"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("uz-UZ")
  }

  const getImageUrl = (imageUrl: string | null | undefined) => {
    if (!imageUrl) {
      return "/placeholder.svg?height=100&width=100&text=Rasm+yo'q"
    }

    // Agar URL to'liq bo'lsa, o'zini qaytarish
    if (imageUrl.startsWith("http")) {
      return imageUrl
    }

    // Agar nisbiy yo'l bo'lsa, placeholder qaytarish
    return "/placeholder.svg?height=100&width=100&text=Rasm+yuklanmagan"
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.color.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleDelete = async (product: Product) => {
    setDeletingId(product.id)

    try {
      console.log("🗑️ Mahsulot o'chirilmoqda:", product.id, product.name)

      // API orqali o'chirish
      const response = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      })

      console.log("📥 Delete API javob:", response.status, response.statusText)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("❌ Delete API xatoligi:", errorData)
        throw new Error(errorData.error || `Server xatoligi: ${response.status}`)
      }

      const result = await response.json()
      console.log("✅ Delete API natija:", result)

      // Local state'dan o'chirish
      setProducts((prevProducts) => prevProducts.filter((p) => p.id !== product.id))

      toast({
        title: "Mahsulot o'chirildi",
        description: "Mahsulot va uning rasmi muvaffaqiyatli o'chirildi",
      })

      console.log("✅ Mahsulot muvaffaqiyatli o'chirildi va UI yangilandi")
    } catch (error: any) {
      console.error("❌ Mahsulotni o'chirishda xatolik:", error)
      toast({
        title: "Xatolik",
        description: error.message || "Mahsulotni o'chirishda xatolik yuz berdi",
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Mahsulotlar ro'yxati ({filteredProducts.length})</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Mahsulot qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredProducts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Mahsulotlar topilmadi</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2">Mahsulot</th>
                  <th className="text-left py-3 px-2">Kategoriya</th>
                  <th className="text-left py-3 px-2">Narx</th>
                  <th className="text-left py-3 px-2">O'lchamlar</th>
                  <th className="text-left py-3 px-2">Yosh</th>
                  <th className="text-left py-3 px-2">Sana</th>
                  <th className="text-right py-3 px-2">Amallar</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 relative bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={getImageUrl(product.image_url) || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                            onError={(e) => {
                              console.error("Admin table rasm xatoligi:", product.image_url)
                              const target = e.target as HTMLImageElement
                              target.src = "/placeholder.svg?height=100&width=100&text=Xatolik"
                            }}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500 capitalize">{product.color}</p>
                          {/* Debug ma'lumotlari */}
                          {process.env.NODE_ENV === "development" && (
                            <p className="text-xs text-gray-400 truncate max-w-32" title={product.image_url}>
                              {product.image_url ? "URL mavjud" : "URL yo'q"}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <Badge variant="secondary" className="capitalize">
                        {product.category}
                      </Badge>
                    </td>
                    <td className="py-4 px-2 font-medium">{formatPrice(product.price)}</td>
                    <td className="py-4 px-2">
                      <div className="flex flex-wrap gap-1">
                        {product.sizes.slice(0, 2).map((size) => (
                          <Badge key={size} variant="outline" className="text-xs">
                            {size}
                          </Badge>
                        ))}
                        {product.sizes.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{product.sizes.length - 2}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-2 text-sm text-gray-600">{product.age_group}</td>
                    <td className="py-4 px-2 text-sm text-gray-600">{formatDate(product.created_at)}</td>
                    <td className="py-4 px-2">
                      <div className="flex items-center justify-end space-x-2">
                        <Link href={`/product/${product.id}`}>
                          <Button variant="outline" size="sm" className="bg-transparent">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </Link>
                        <Link href={`/admin/products/${product.id}/edit`}>
                          <Button variant="outline" size="sm" className="bg-transparent">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 bg-transparent"
                              disabled={deletingId === product.id}
                            >
                              {deletingId === product.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Trash2 className="h-3 w-3" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Mahsulotni o'chirish</AlertDialogTitle>
                              <AlertDialogDescription>
                                <strong>"{product.name}"</strong> mahsulotini o'chirishni xohlaysizmi?
                                <br />
                                Bu amalni bekor qilib bo'lmaydi. Mahsulot va uning rasmi butunlay o'chiriladi.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(product)}
                                className="bg-red-600 hover:bg-red-700"
                                disabled={deletingId === product.id}
                              >
                                {deletingId === product.id ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    O'chirilmoqda...
                                  </>
                                ) : (
                                  "O'chirish"
                                )}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
