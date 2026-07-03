"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getProducts, createSale, extractError } from "@/lib/api"
import { Product } from "@/types/product"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { PlusIcon, Trash2Icon, AlertTriangleIcon } from "lucide-react"

type LineItem = { product_id: number; quantity: number; product: Product }

export default function NewSalePage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [items, setItems] = useState<LineItem[]>([])
  const [selectedId, setSelectedId] = useState("")
  const [qty, setQty] = useState("1")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    getProducts().then(({ ok, data }) => { if (ok) setProducts(data.products) })
  }, [])

  function addItem() {
    setError("")
    if (!selectedId) { setError("Please select a product."); return }
    const product = products.find((p) => p.id === parseInt(selectedId))
    if (!product) return
    const quantity = parseInt(qty)
    if (!quantity || quantity <= 0) { setError("Quantity must be greater than 0."); return }
    if (quantity > product.quantity) {
      setError(`Only ${product.quantity} unit(s) available for "${product.name}".`)
      return
    }
    const existing = items.findIndex((i) => i.product_id === product.id)
    if (existing >= 0) {
      const updated = [...items]
      updated[existing] = { ...updated[existing], quantity: updated[existing].quantity + quantity }
      setItems(updated)
    } else {
      setItems([...items, { product_id: product.id, quantity, product }])
    }
    setSelectedId("")
    setQty("1")
  }

  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index))
  }

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    if (items.length === 0) { setError("Add at least one item before confirming."); return }
    setError("")
    setSubmitting(true)
    const { ok, data } = await createSale(
      items.map((i) => ({ product_id: i.product_id, quantity: i.quantity }))
    )
    setSubmitting(false)
    if (!ok) { setError(extractError(data, "Failed to record sale.")); return }
    router.push("/staff/sales")
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-semibold">Record Sale</h2>
        <p className="text-sm text-muted-foreground">Select products and quantities to record a new sale</p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex flex-wrap items-end gap-3 rounded-md border p-4">
        <div className="flex flex-col gap-1.5 flex-1 min-w-48">
          <Label htmlFor="product-select">Product</Label>
          <select
            id="product-select"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="h-9 w-full rounded-md border bg-background px-3 text-sm"
          >
            <option value="">Select a product...</option>
            {products.map((p) => (
              <option key={p.id} value={p.id} disabled={p.quantity === 0}>
                {p.name} — ${p.price.toFixed(2)} ({p.quantity} in stock)
                {p.is_low_stock ? " ⚠" : ""}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5 w-24">
          <Label htmlFor="qty">Qty</Label>
          <Input
            id="qty"
            type="number"
            min="1"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
          />
        </div>
        <Button type="button" onClick={addItem}>
          <PlusIcon className="size-4" /> Add
        </Button>
      </div>

      {items.length > 0 && (
        <>
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Product</th>
                  <th className="px-4 py-3 text-left font-medium">Unit Price</th>
                  <th className="px-4 py-3 text-left font-medium">Qty</th>
                  <th className="px-4 py-3 text-left font-medium">Subtotal</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="px-4 py-3 font-medium">
                      {item.product.name}
                      {item.product.is_low_stock && (
                        <Badge variant="destructive" className="ml-2 gap-1 text-xs">
                          <AlertTriangleIcon className="size-3" /> Low Stock
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">${item.product.price.toFixed(2)}</td>
                    <td className="px-4 py-3">{item.quantity}</td>
                    <td className="px-4 py-3">${(item.product.price * item.quantity).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <Button size="sm" variant="ghost" onClick={() => removeItem(i)}>
                        <Trash2Icon className="size-3" />
                      </Button>
                    </td>
                  </tr>
                ))}
                <tr className="bg-muted/30">
                  <td className="px-4 py-3 font-semibold" colSpan={3}>Total</td>
                  <td className="px-4 py-3 font-semibold" colSpan={2}>${total.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <form onSubmit={handleSubmit}>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Recording sale..." : "Confirm Sale"}
            </Button>
          </form>
        </>
      )}
    </div>
  )
}
