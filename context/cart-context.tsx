"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"

interface CartItem {
  id: string
  product_id: string
  quantity: number
  size: string
  product: {
    id: string
    name: string
    price: number
    image_url: string
  }
}

interface CartContextType {
  items: CartItem[]
  addToCart: (productId: string, size: string, quantity?: number) => Promise<void>
  removeFromCart: (itemId: string) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  totalPrice: number
  totalItems: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [guestId, setGuestId] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Generate guest ID if not exists
    const storedGuestId = localStorage.getItem("guest_id")
    if (!storedGuestId) {
      const newGuestId = crypto.randomUUID()
      localStorage.setItem("guest_id", newGuestId)
      setGuestId(newGuestId)
    } else {
      setGuestId(storedGuestId)
    }
  }, [])

  useEffect(() => {
    if (guestId) {
      loadCartItems()
    }
  }, [guestId])

  const loadCartItems = async () => {
    try {
      const { data: user } = await supabase.auth.getUser()

      const { data, error } = await supabase
        .from("cart_items")
        .select(`
          *,
          product:products (
            id,
            name,
            price,
            image_url
          )
        `)
        .eq(user.user ? "user_id" : "guest_id", user.user?.id || guestId)

      if (error) throw error

      setItems(data || [])
    } catch (error) {
      console.error("Error loading cart:", error)
    }
  }

  const addToCart = async (productId: string, size: string, quantity = 1) => {
    try {
      const { data: user } = await supabase.auth.getUser()

      // Check if item already exists
      const existingItem = items.find((item) => item.product_id === productId && item.size === size)

      if (existingItem) {
        await updateQuantity(existingItem.id, existingItem.quantity + quantity)
        return
      }

      const { error } = await supabase.from("cart_items").insert({
        user_id: user.user?.id || null,
        guest_id: !user.user ? guestId : null,
        product_id: productId,
        size,
        quantity,
      })

      if (error) throw error

      await loadCartItems()
      toast({
        title: "Savatga qo'shildi",
        description: "Mahsulot savatga muvaffaqiyatli qo'shildi",
      })
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Xatolik",
        description: "Mahsulotni savatga qo'shishda xatolik yuz berdi",
        variant: "destructive",
      })
    }
  }

  const removeFromCart = async (itemId: string) => {
    try {
      const { error } = await supabase.from("cart_items").delete().eq("id", itemId)

      if (error) throw error

      await loadCartItems()
      toast({
        title: "O'chirildi",
        description: "Mahsulot savatdan o'chirildi",
      })
    } catch (error) {
      console.error("Error removing from cart:", error)
      toast({
        title: "Xatolik",
        description: "Mahsulotni o'chirishda xatolik yuz berdi",
        variant: "destructive",
      })
    }
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        await removeFromCart(itemId)
        return
      }

      const { error } = await supabase.from("cart_items").update({ quantity }).eq("id", itemId)

      if (error) throw error

      await loadCartItems()
    } catch (error) {
      console.error("Error updating quantity:", error)
      toast({
        title: "Xatolik",
        description: "Miqdorni o'zgartirishda xatolik yuz berdi",
        variant: "destructive",
      })
    }
  }

  const clearCart = async () => {
    try {
      const { data: user } = await supabase.auth.getUser()

      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq(user.user ? "user_id" : "guest_id", user.user?.id || guestId)

      if (error) throw error

      setItems([])
    } catch (error) {
      console.error("Error clearing cart:", error)
    }
  }

  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPrice,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
