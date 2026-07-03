"use client"

import { useEffect, useState } from "react"
import { getSales } from "@/lib/api"
import { Sale } from "@/types/sale"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [expanded, setExpanded] = useState<number | null>(null)

  async function load(start?: string, end?: string) {
    setLoading(true)
    const { ok, data } = await getSales(start, end)
    if (ok) setSales(data.sales)
    else setError("Failed to load sales.")
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function handleFilter(e: React.SyntheticEvent) {
    e.preventDefault()
    load(startDate || undefined, endDate || undefined)
  }

  function handleClear() {
    setStartDate("")
    setEndDate("")
    load()
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold">Sales History</h2>
        <p className="text-sm text-muted-foreground">View and filter all recorded sales transactions</p>
      </div>

      <form onSubmit={handleFilter} className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="start-date">From</Label>
          <Input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="end-date">To</Label>
          <Input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <Button type="submit">Filter</Button>
        {(startDate || endDate) && (
          <Button type="button" variant="outline" onClick={handleClear}>Clear</Button>
        )}
      </form>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="w-10 px-4 py-3"></th>
              <th className="px-4 py-3 text-left font-medium">Order ID</th>
              <th className="px-4 py-3 text-left font-medium">Date &amp; Time</th>
              <th className="px-4 py-3 text-left font-medium">Items</th>
              <th className="px-4 py-3 text-left font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Loading...</td>
              </tr>
            )}
            {!loading && sales.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No sales found for the selected period.</td>
              </tr>
            )}
            {sales.flatMap((sale) => [
              <tr
                key={sale.id}
                className="border-b hover:bg-muted/30 cursor-pointer"
                onClick={() => setExpanded(expanded === sale.id ? null : sale.id)}
              >
                <td className="px-4 py-3 text-muted-foreground">
                  {expanded === sale.id
                    ? <ChevronUpIcon className="size-4" />
                    : <ChevronDownIcon className="size-4" />}
                </td>
                <td className="px-4 py-3 font-medium">#{sale.id}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {sale.created_at ? new Date(sale.created_at).toLocaleString() : "—"}
                </td>
                <td className="px-4 py-3">{sale.items.length} item{sale.items.length !== 1 ? "s" : ""}</td>
                <td className="px-4 py-3 font-medium">${sale.total_amount.toFixed(2)}</td>
              </tr>,
              expanded === sale.id ? (
                <tr key={`${sale.id}-detail`} className="border-b bg-muted/20">
                  <td colSpan={5} className="px-8 py-3">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-muted-foreground">
                          <th className="pb-2 text-left">Product</th>
                          <th className="pb-2 text-left">Unit Price</th>
                          <th className="pb-2 text-left">Qty</th>
                          <th className="pb-2 text-left">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sale.items.map((item) => (
                          <tr key={item.id}>
                            <td className="py-1">{item.product_name}</td>
                            <td className="py-1">${item.unit_price.toFixed(2)}</td>
                            <td className="py-1">{item.quantity}</td>
                            <td className="py-1">${item.subtotal.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              ) : null,
            ])}
          </tbody>
        </table>
      </div>
    </div>
  )
}
