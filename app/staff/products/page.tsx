"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  restockProduct,
  extractError,
} from "@/lib/api"
import { Product } from "@/types/product"
import { PlusIcon, PencilIcon, Trash2Icon, PackagePlusIcon, AlertTriangleIcon } from "lucide-react"

type FormState = {
  name: string
  sku: string
  price: string
  quantity: string
  category: string
  manufacturer: string
  low_stock_threshold: string
}

const defaultForm: FormState = {
  name: "",
  sku: "",
  price: "",
  quantity: "",
  category: "",
  manufacturer: "",
  low_stock_threshold: "10",
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [form, setForm] = useState<FormState>(defaultForm)
  const [formError, setFormError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const [restockOpen, setRestockOpen] = useState(false)
  const [restockTarget, setRestockTarget] = useState<Product | null>(null)
  const [restockQty, setRestockQty] = useState("")
  const [restockError, setRestockError] = useState("")

  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  async function load() {
    setLoading(true)
    const { ok, data } = await getProducts()
    if (ok) setProducts(data.products)
    else setError("Failed to load products.")
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openAdd() {
    setEditingProduct(null)
    setForm(defaultForm)
    setFormError("")
    setSheetOpen(true)
  }

  function openEdit(p: Product) {
    setEditingProduct(p)
    setForm({
      name: p.name,
      sku: p.sku,
      price: String(p.price),
      quantity: String(p.quantity),
      category: p.category ?? "",
      manufacturer: p.manufacturer ?? "",
      low_stock_threshold: String(p.low_stock_threshold),
    })
    setFormError("")
    setSheetOpen(true)
  }

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    setFormError("")
    setSubmitting(true)
    const payload = {
      name: form.name,
      sku: form.sku,
      price: parseFloat(form.price),
      quantity: parseInt(form.quantity),
      category: form.category || null,
      manufacturer: form.manufacturer || null,
      low_stock_threshold: parseInt(form.low_stock_threshold) || 10,
    }
    const { ok, data } = editingProduct
      ? await updateProduct(editingProduct.id, payload)
      : await createProduct(payload)
    setSubmitting(false)
    if (!ok) { setFormError(extractError(data, "Failed to save product.")); return }
    setSheetOpen(false)
    load()
  }

  async function handleDelete(id: number) {
    const { ok, data } = await deleteProduct(id)
    if (!ok) { setError(extractError(data, "Failed to delete product.")); return }
    setDeleteConfirm(null)
    load()
  }

  async function handleRestock(e: React.SyntheticEvent) {
    e.preventDefault()
    if (!restockTarget) return
    setRestockError("")
    const { ok, data } = await restockProduct(restockTarget.id, parseInt(restockQty))
    if (!ok) { setRestockError(extractError(data, "Failed to restock.")); return }
    setRestockOpen(false)
    setRestockQty("")
    load()
  }

  function field(key: keyof FormState, label: string, type = "text", placeholder = "") {
    return (
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={key}>{label}</Label>
        <Input
          id={key}
          type={type}
          placeholder={placeholder}
          value={form[key]}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Products</h2>
          <p className="text-sm text-muted-foreground">Manage your product inventory</p>
        </div>
        <Button onClick={openAdd}>
          <PlusIcon className="size-4" /> Add Product
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">SKU</th>
              <th className="px-4 py-3 text-left font-medium">Price</th>
              <th className="px-4 py-3 text-left font-medium">Qty</th>
              <th className="px-4 py-3 text-left font-medium">Category</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">Loading...</td>
              </tr>
            )}
            {!loading && products.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">No products found. Add one to get started.</td>
              </tr>
            )}
            {products.map((p) => (
              <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.sku}</td>
                <td className="px-4 py-3">${p.price.toFixed(2)}</td>
                <td className="px-4 py-3">{p.quantity}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.category ?? "—"}</td>
                <td className="px-4 py-3">
                  {p.is_low_stock ? (
                    <Badge variant="destructive" className="gap-1 text-xs">
                      <AlertTriangleIcon className="size-3" /> Low Stock
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs text-green-600">In Stock</Badge>
                  )}
                </td>
                <td className="px-4 py-3">
                  {deleteConfirm === p.id ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Confirm delete?</span>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(p.id)}>Yes</Button>
                      <Button size="sm" variant="outline" onClick={() => setDeleteConfirm(null)}>No</Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEdit(p)}>
                        <PencilIcon className="size-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => { setRestockTarget(p); setRestockError(""); setRestockOpen(true) }}
                      >
                        <PackagePlusIcon className="size-3" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => setDeleteConfirm(p.id)}>
                        <Trash2Icon className="size-3" />
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{editingProduct ? "Edit Product" : "Add Product"}</SheetTitle>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
            {formError && <p className="text-sm text-destructive">{formError}</p>}
            {field("name", "Name", "text", "Widget Pro")}
            {field("sku", "SKU", "text", "WP-001")}
            {field("price", "Price", "number", "0.00")}
            {field("quantity", "Quantity", "number", "0")}
            {field("category", "Category", "text", "Electronics")}
            {field("manufacturer", "Manufacturer", "text", "Acme Corp")}
            {field("low_stock_threshold", "Low Stock Threshold", "number", "10")}
            <Button type="submit" disabled={submitting} className="mt-2">
              {submitting ? "Saving..." : editingProduct ? "Save Changes" : "Create Product"}
            </Button>
          </form>
        </SheetContent>
      </Sheet>

      <Sheet open={restockOpen} onOpenChange={setRestockOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Restock — {restockTarget?.name}</SheetTitle>
          </SheetHeader>
          <form onSubmit={handleRestock} className="flex flex-col gap-4 mt-6">
            {restockError && <p className="text-sm text-destructive">{restockError}</p>}
            <p className="text-sm text-muted-foreground">
              Current stock: <strong>{restockTarget?.quantity}</strong>
            </p>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="restock-qty">Quantity to Add</Label>
              <Input
                id="restock-qty"
                type="number"
                min="1"
                placeholder="0"
                value={restockQty}
                onChange={(e) => setRestockQty(e.target.value)}
                required
              />
            </div>
            <Button type="submit">Restock</Button>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  )
}
