"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabase"
import { sendTelegramMessage } from "@/lib/telegram"
import { useToast } from "@/components/ui/use-toast"
import { Search, Eye, Phone } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Order {
  id: string
  full_name: string
  phone: string
  address: string
  total_price: number
  status: string
  delivery_method: string
  payment_method: string
  items: any[]
  notes: string
  created_at: string
}

interface OrdersTableProps {
  orders: Order[]
}

export function OrdersTable({ orders: initialOrders }: OrdersTableProps) {
  const [orders, setOrders] = useState(initialOrders)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const { toast } = useToast()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("uz-UZ").format(price) + " so'm"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("uz-UZ")
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      new: { label: "Yangi", className: "bg-orange-100 text-orange-800" },
      processing: { label: "Jarayonda", className: "bg-blue-100 text-blue-800" },
      delivered: { label: "Yetkazildi", className: "bg-green-100 text-green-800" },
    }

    const statusInfo = statusMap[status as keyof typeof statusMap] || {
      label: status,
      className: "bg-gray-100 text-gray-800",
    }

    return <Badge className={statusInfo.className}>{statusInfo.label}</Badge>
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.phone.includes(searchQuery) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId)

      if (error) throw error

      setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))

      // Telegram'ga status o'zgarishi haqida xabar yuborish
      const order = orders.find((o) => o.id === orderId)
      if (order) {
        const statusLabels = {
          new: "Yangi",
          processing: "Jarayonda",
          delivered: "Yetkazildi",
        }

        const message = `📋 <b>BUYURTMA HOLATI O'ZGARDI</b>

🆔 Buyurtma: #${order.id.slice(0, 8)}
👤 Mijoz: ${order.full_name}
📞 Telefon: ${order.phone}

📊 Yangi holat: <b>${statusLabels[newStatus as keyof typeof statusLabels] || newStatus}</b>

⏰ O'zgartirildi: ${new Date().toLocaleString("uz-UZ")}`

        try {
          await sendTelegramMessage(message)
        } catch (telegramError) {
          console.error("Telegram xabar yuborishda xatolik:", telegramError)
        }
      }

      toast({
        title: "Holat yangilandi",
        description: "Buyurtma holati muvaffaqiyatli yangilandi",
      })
    } catch (error) {
      console.error("Error updating order status:", error)
      toast({
        title: "Xatolik",
        description: "Buyurtma holatini yangilashda xatolik yuz berdi",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle>Buyurtmalar ro'yxati ({filteredOrders.length})</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barchasi</SelectItem>
                <SelectItem value="new">Yangi</SelectItem>
                <SelectItem value="processing">Jarayonda</SelectItem>
                <SelectItem value="delivered">Yetkazildi</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredOrders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Buyurtmalar topilmadi</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2">Buyurtma</th>
                  <th className="text-left py-3 px-2">Mijoz</th>
                  <th className="text-left py-3 px-2">Summa</th>
                  <th className="text-left py-3 px-2">Holat</th>
                  <th className="text-left py-3 px-2">Sana</th>
                  <th className="text-right py-3 px-2">Amallar</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-2">
                      <div>
                        <p className="font-medium text-gray-900">#{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-gray-500 capitalize">
                          {order.delivery_method === "courier" ? "Kuryer" : "Olib ketish"}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div>
                        <p className="font-medium text-gray-900">{order.full_name}</p>
                        <p className="text-sm text-gray-500 flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {order.phone}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-2 font-medium">{formatPrice(order.total_price)}</td>
                    <td className="py-4 px-2">
                      <Select value={order.status} onValueChange={(value) => handleStatusChange(order.id, value)}>
                        <SelectTrigger className="w-32">{getStatusBadge(order.status)}</SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">Yangi</SelectItem>
                          <SelectItem value="processing">Jarayonda</SelectItem>
                          <SelectItem value="delivered">Yetkazildi</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-4 px-2 text-sm text-gray-600">{formatDate(order.created_at)}</td>
                    <td className="py-4 px-2">
                      <div className="flex items-center justify-end">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="bg-transparent">
                              <Eye className="h-3 w-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Buyurtma tafsilotlari #{order.id.slice(0, 8)}</DialogTitle>
                              <DialogDescription>{formatDate(order.created_at)} da berilgan</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium mb-2">Mijoz ma'lumotlari</h4>
                                  <p>
                                    <strong>Ism:</strong> {order.full_name}
                                  </p>
                                  <p>
                                    <strong>Telefon:</strong> {order.phone}
                                  </p>
                                  {order.address && (
                                    <p>
                                      <strong>Manzil:</strong> {order.address}
                                    </p>
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Buyurtma ma'lumotlari</h4>
                                  <p>
                                    <strong>Holat:</strong> {getStatusBadge(order.status)}
                                  </p>
                                  <p>
                                    <strong>Yetkazib berish:</strong>{" "}
                                    {order.delivery_method === "courier" ? "Kuryer orqali" : "O'zi olib ketish"}
                                  </p>
                                  <p>
                                    <strong>To'lov:</strong> {order.payment_method === "cash" ? "Naqd" : "Karta"}
                                  </p>
                                </div>
                              </div>

                              {order.items && order.items.length > 0 && (
                                <div>
                                  <h4 className="font-medium mb-2">Mahsulotlar</h4>
                                  <div className="space-y-2">
                                    {order.items.map((item: any, index: number) => (
                                      <div
                                        key={index}
                                        className="flex justify-between items-center p-2 bg-gray-50 rounded"
                                      >
                                        <div>
                                          <p className="font-medium">{item.product_name}</p>
                                          <p className="text-sm text-gray-600">
                                            O'lcham: {item.size} • Miqdor: {item.quantity}
                                          </p>
                                        </div>
                                        <p className="font-medium">{formatPrice(item.total)}</p>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="border-t pt-2 mt-2">
                                    <p className="text-right font-bold">Jami: {formatPrice(order.total_price)}</p>
                                  </div>
                                </div>
                              )}

                              {order.notes && (
                                <div>
                                  <h4 className="font-medium mb-2">Izoh</h4>
                                  <p className="text-gray-600">{order.notes}</p>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
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
