import { Product } from "./product"

export type SaleItem = {
  id: number
  sale_id: number
  product_id: number
  product_name: string | null
  quantity: number
  unit_price: number
  subtotal: number
}

export type Sale = {
  id: number
  staff_id: number
  total_amount: number
  created_at: string | null
  items: SaleItem[]
}

export type DashboardStats = {
  total_revenue: number
  units_sold: number
  total_sales: number
  low_stock_count: number
  low_stock_items: Product[]
}
