"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Shield } from "lucide-react"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Oddiy parol tekshiruvi (haqiqiy loyihada bu xavfsiz bo'lishi kerak)
    if (email === "admin@minimoda.uz" && password === "admin123") {
      // Local storage'ga admin session saqlash
      localStorage.setItem("admin_session", "true")
      localStorage.setItem("admin_email", email)

      toast({
        title: "Muvaffaqiyatli kirish",
        description: "Admin panelga xush kelibsiz!",
      })
      router.push("/admin")
    } else {
      toast({
        title: "Kirish xatoligi",
        description: "Email yoki parol noto'g'ri",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  const handleQuickLogin = () => {
    setEmail("admin@minimoda.uz")
    setPassword("admin123")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-pink-600" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Admin Panel</h2>
          <p className="mt-2 text-sm text-gray-600">MiniModa boshqaruv paneli</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Tizimga kirish</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@minimoda.uz"
                />
              </div>
              <div>
                <Label htmlFor="password">Parol</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
              </div>
              <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Kirish...
                  </>
                ) : (
                  "Kirish"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center space-y-4">
          <div className="text-sm text-gray-500">
            <p className="font-semibold">Test uchun kirish ma'lumotlari:</p>
            <p>
              📧 Email: <code className="bg-gray-100 px-2 py-1 rounded">admin@minimoda.uz</code>
            </p>
            <p>
              🔑 Parol: <code className="bg-gray-100 px-2 py-1 rounded">admin123</code>
            </p>
          </div>

          <Button onClick={handleQuickLogin} variant="outline" className="w-full bg-transparent">
            Tezkor kirish (test uchun)
          </Button>
        </div>
      </div>
    </div>
  )
}
