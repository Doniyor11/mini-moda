"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function AdminHeader() {
  const [adminEmail, setAdminEmail] = useState("")
  const [newOrdersCount, setNewOrdersCount] = useState(0)

  useEffect(() => {
    const email = localStorage.getItem("admin_email") || "Admin"
    setAdminEmail(email)
    getNewOrdersCount()
  }, [])

  const getNewOrdersCount = async () => {
    try {
      const { count } = await supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "new")
      setNewOrdersCount(count || 0)
    } catch (error) {
      console.error("Error fetching new orders count:", error)
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="lg:hidden w-8" /> {/* Spacer for mobile menu button */}
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" className="relative bg-transparent">
            <Bell className="h-4 w-4" />
            {newOrdersCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {newOrdersCount}
              </Badge>
            )}
          </Button>

          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-pink-100 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-pink-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">{adminEmail}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
