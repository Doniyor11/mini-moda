"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LayoutDashboard, Package, ShoppingCart, Settings, Menu, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Mahsulotlar", href: "/admin/products", icon: Package },
  { name: "Buyurtmalar", href: "/admin/orders", icon: ShoppingCart },
  { name: "Sozlamalar", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("admin_session")
    localStorage.removeItem("admin_email")
    router.push("/admin/login")
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center px-6 py-4 border-b">
        <div className="h-8 w-8 bg-gradient-to-r from-pink-400 to-purple-400 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">MM</span>
        </div>
        <span className="ml-2 text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          MiniModa
        </span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                isActive ? "bg-pink-100 text-pink-700" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
              )}
              onClick={() => setIsMobileOpen(false)}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t">
        <Button onClick={handleLogout} variant="outline" className="w-full justify-start bg-transparent">
          <LogOut className="mr-3 h-4 w-4" />
          Chiqish
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden fixed top-4 left-4 z-40 bg-white">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  )
}
