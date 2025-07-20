import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function TopProducts() {
  // Bu yerda eng ko'p sotilgan mahsulotlar bo'lishi kerak
  // Hozircha placeholder
  const topProducts = [
    { name: "Oq futbolka", sales: 25, revenue: 1125000 },
    { name: "Qizil ko'ylak", sales: 18, revenue: 1530000 },
    { name: "Ko'k shim", sales: 15, revenue: 975000 },
  ]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("uz-UZ").format(price) + " so'm"
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Eng ko'p sotilgan mahsulotlar</CardTitle>
        <Link href="/admin/products">
          <Button variant="outline" size="sm" className="bg-transparent">
            Barchasini ko'rish
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topProducts.map((product, index) => (
            <div key={product.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-pink-600">#{index + 1}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.sales} ta sotildi</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{formatPrice(product.revenue)}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
