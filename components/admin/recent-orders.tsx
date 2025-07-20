import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Order {
  id: string
  full_name: string
  total_price: number
  status: string
  created_at: string
}

interface RecentOrdersProps {
  orders: Order[]
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("uz-UZ").format(price) + " so'm"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("uz-UZ")
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      new: { label: "Yangi", variant: "default" as const },
      processing: { label: "Jarayonda", variant: "secondary" as const },
      delivered: { label: "Yetkazildi", variant: "default" as const },
    }

    const statusInfo = statusMap[status as keyof typeof statusMap] || {
      label: status,
      variant: "default" as const,
    }

    return (
      <Badge variant={statusInfo.variant} className={status === "new" ? "bg-orange-100 text-orange-800" : ""}>
        {statusInfo.label}
      </Badge>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>So'nggi buyurtmalar</CardTitle>
        <Link href="/admin/orders">
          <Button variant="outline" size="sm" className="bg-transparent">
            Barchasini ko'rish
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Buyurtmalar yo'q</p>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">#{order.id.slice(0, 8)}</p>
                  <p className="text-sm text-gray-600">{order.full_name}</p>
                  <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{formatPrice(order.total_price)}</p>
                  {getStatusBadge(order.status)}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
