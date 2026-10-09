export interface User {
  id: number
  phone: string
  email: string | null
  full_name: string | null
  is_admin: boolean
  created_at: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  image_url: string | null
  sort_order: number
  is_active: boolean
}

export interface Product {
  id: number
  name: string
  slug: string
  description: string | null
  price: number
  discount_price: number | null
  stock: number
  sku: string | null
  category_id: number | null
  category_name?: string
  category_slug?: string
  is_featured: boolean
  is_new: boolean
  is_best_seller: boolean
  is_active: boolean
  seo_title: string | null
  seo_description: string | null
  images?: ProductImage[]
  created_at: string
}

export interface ProductImage {
  id: number
  product_id: number
  image_url: string
  sort_order: number
}

export interface ProductVariant {
  id: number
  product_id: number
  name: string
  value: string
  stock: number
  price_adjustment: number
}

export interface CartItem {
  product_id: number
  name: string
  slug: string
  price: number
  discount_price: number | null
  image_url: string | null
  quantity: number
  stock: number
}

export interface Order {
  id: number
  order_number: string
  status: string
  subtotal: number
  shipping: number
  discount: number
  total: number
  full_name: string
  phone: string
  province: string | null
  city: string | null
  address: string | null
  postal_code: string | null
  notes: string | null
  created_at: string
  items?: OrderItem[]
}

export interface OrderItem {
  id: number
  order_id: number
  product_id: number | null
  product_name: string
  quantity: number
  price: number
  image_url: string | null
}

export interface Address {
  id: number
  user_id: number
  full_name: string
  phone: string
  province: string | null
  city: string | null
  address: string | null
  postal_code: string | null
  is_default: boolean
}

export interface Discount {
  id: number
  code: string
  type: string
  value: number
  product_id: number | null
  category_id: number | null
  expires_at: string | null
  usage_limit: number | null
  used_count: number
  is_active: boolean
}

export interface StoreSettings {
  [key: string]: string
}

export const ORDER_STATUS: Record<string, string> = {
  new: 'جدید',
  processing: 'در حال پردازش',
  ready_to_ship: 'آماده ارسال',
  shipped: 'ارسال شده',
  delivered: 'تحویل داده شده',
  cancelled: 'لغو شده',
}
