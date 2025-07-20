import { supabase } from "@/lib/supabase"
import { OrdersTable } from "@/components/admin/orders-table"

export default async function AdminOrdersPage() {
  const { data: orders, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching orders:", error)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Buyurtmalar</h1>
        <p className="text-gray-600">Barcha buyurtmalarni boshqaring</p>
      </div>

      <OrdersTable orders={orders || []} />
    </div>
  )
}
