import { createClient } from "@supabase/supabase-js"

// Environment variable'larni tekshirish va xatolik berish
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL environment variable is required")
}

if (!supabaseKey) {
  throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable is required")
}

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey)

// Server-side client (faqat server-side ishlatish uchun)
export const createServerClient = () => {
  if (!supabaseServiceKey) {
    console.warn("SUPABASE_SERVICE_ROLE_KEY not found, using anon key for server client")
    return createClient(supabaseUrl, supabaseKey)
  }
  return createClient(supabaseUrl, supabaseServiceKey)
}

// Alternative function names for consistency
export const createSupabaseClient = () => supabase
export const createSupabaseServiceClient = createServerClient

// Development rejimida debug ma'lumotlari
if (process.env.NODE_ENV === "development") {
  console.log("🔧 Supabase Configuration:")
  console.log("- URL:", supabaseUrl ? "✅ Set" : "❌ Missing")
  console.log("- Anon Key:", supabaseKey ? "✅ Set" : "❌ Missing")
  console.log("- Service Key:", supabaseServiceKey ? "✅ Set" : "❌ Missing")
}

// Types
export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          category: string
          age_group: string
          color: string
          sizes: string[]
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          category: string
          age_group: string
          color: string
          sizes: string[]
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          category?: string
          age_group?: string
          color?: string
          sizes?: string[]
          image_url?: string | null
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          items: any[]
          total_price: number
          full_name: string
          phone: string
          address: string | null
          delivery_method: string
          payment_method: string
          status: string
          guest_id: string | null
          user_id: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          items: any[]
          total_price: number
          full_name: string
          phone: string
          address?: string | null
          delivery_method: string
          payment_method: string
          status?: string
          guest_id?: string | null
          user_id?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          items?: any[]
          total_price?: number
          full_name?: string
          phone?: string
          address?: string | null
          delivery_method?: string
          payment_method?: string
          status?: string
          guest_id?: string | null
          user_id?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      cart_items: {
        Row: {
          id: string
          user_id: string | null
          guest_id: string | null
          product_id: string
          quantity: number
          size: string
          added_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          guest_id?: string | null
          product_id: string
          quantity?: number
          size: string
          added_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          guest_id?: string | null
          product_id?: string
          quantity?: number
          size?: string
          added_at?: string
        }
      }
    }
  }
}
