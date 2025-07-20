"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

export function ProductFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [priceRange, setPriceRange] = useState([0, 200000])

  const categories = [
    { id: "futbolka", label: "Futbolka" },
    { id: "ko'ylak", label: "Ko'ylak" },
    { id: "shim", label: "Shim" },
    { id: "bodi", label: "Bodi" },
    { id: "kombinatsiya", label: "Kombinatsiya" },
  ]

  const ageGroups = [
    { id: "0-2", label: "0-2 yosh" },
    { id: "3-5", label: "3-5 yosh" },
    { id: "6-10", label: "6-10 yosh" },
  ]

  const colors = [
    { id: "oq", label: "Oq" },
    { id: "qora", label: "Qora" },
    { id: "qizil", label: "Qizil" },
    { id: "ko'k", label: "Ko'k" },
    { id: "yashil", label: "Yashil" },
    { id: "sari", label: "Sari" },
    { id: "pushti", label: "Pushti" },
    { id: "binafsha", label: "Binafsha" },
  ]

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    router.push(`/products?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push("/products")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtrlar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Kategoriya */}
          <div>
            <h3 className="font-medium mb-3">Kategoriya</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={category.id}
                    checked={searchParams.get("category") === category.id}
                    onCheckedChange={(checked) => updateFilter("category", checked ? category.id : null)}
                  />
                  <Label htmlFor={category.id} className="text-sm">
                    {category.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Yosh guruhi */}
          <div>
            <h3 className="font-medium mb-3">Yosh guruhi</h3>
            <div className="space-y-2">
              {ageGroups.map((group) => (
                <div key={group.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={group.id}
                    checked={searchParams.get("age_group") === group.id}
                    onCheckedChange={(checked) => updateFilter("age_group", checked ? group.id : null)}
                  />
                  <Label htmlFor={group.id} className="text-sm">
                    {group.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Rang */}
          <div>
            <h3 className="font-medium mb-3">Rang</h3>
            <div className="space-y-2">
              {colors.map((color) => (
                <div key={color.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={color.id}
                    checked={searchParams.get("color") === color.id}
                    onCheckedChange={(checked) => updateFilter("color", checked ? color.id : null)}
                  />
                  <Label htmlFor={color.id} className="text-sm">
                    {color.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Narx oralig'i */}
          <div>
            <h3 className="font-medium mb-3">Narx oralig'i</h3>
            <div className="space-y-4">
              <Slider value={priceRange} onValueChange={setPriceRange} max={200000} step={5000} className="w-full" />
              <div className="flex justify-between text-sm text-gray-600">
                <span>{priceRange[0].toLocaleString()} so'm</span>
                <span>{priceRange[1].toLocaleString()} so'm</span>
              </div>
              <Button
                onClick={() => {
                  updateFilter("min_price", priceRange[0].toString())
                  updateFilter("max_price", priceRange[1].toString())
                }}
                className="w-full"
                size="sm"
              >
                Qo'llash
              </Button>
            </div>
          </div>

          <Button onClick={clearFilters} variant="outline" className="w-full bg-transparent">
            Filtrlarni tozalash
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
