import { supabase } from "@/lib/supabase"
import { AdminStats } from "@/components/admin/admin-stats"
import { RecentOrders } from "@/components/admin/recent-orders"
import { TopProducts } from "@/components/admin/top-products"

export default async function AdminDashboard() {
  // Statistikalar
  const { count: totalProducts } = await supabase.from("products").select("*", { count: "exact", head: true })

  const { count: totalOrders } = await supabase.from("orders").select("*", { count: "exact", head: true })

  const { count: newOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "new")

  const { data: revenueData } = await supabase.from("orders").select("total_price").eq("status", "delivered")

  const totalRevenue = revenueData?.reduce((sum, order) => sum + order.total_price, 0) || 0

  // So'nggi buyurtmalar
  const { data: recentOrders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">MiniModa boshqaruv paneli</p>
      </div>

      <AdminStats
        totalProducts={totalProducts || 0}
        totalOrders={totalOrders || 0}
        newOrders={newOrders || 0}
        totalRevenue={totalRevenue}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentOrders orders={recentOrders || []} />
        <TopProducts />
      </div>
    </div>
  )
}
