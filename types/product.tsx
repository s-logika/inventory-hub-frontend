export type Product = {
  id: number
  name: string
  sku: string
  price: number
  quantity: number
  category: string | null
  manufacturer: string | null
  low_stock_threshold: number
  is_low_stock: boolean
  created_at: string | null
}
