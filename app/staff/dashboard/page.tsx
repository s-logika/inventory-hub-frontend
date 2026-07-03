"use client"

import { useEffect, useState } from "react"
import { SectionCards } from "@/components/section-cards"
import { getDashboard } from "@/lib/api"
import { DashboardStats } from "@/types/sale"
import { Badge } from "@/components/ui/badge"
import { AlertTriangleIcon } from "lucide-react"

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    getDashboard().then(({ ok, data }) => {
      if (ok) setStats(data)
      else setError("Failed to load dashboard data.")
    })
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <p className="text-sm text-muted-foreground">Overview of your inventory and sales</p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <SectionCards stats={stats} />

      {stats && stats.low_stock_items.length > 0 && (
        <div>
          <h3 className="mb-3 text-lg font-medium">Low Stock Items</h3>
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Product</th>
                  <th className="px-4 py-3 text-left font-medium">SKU</th>
                  <th className="px-4 py-3 text-left font-medium">Quantity</th>
                  <th className="px-4 py-3 text-left font-medium">Threshold</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.low_stock_items.map((p) => (
                  <tr key={p.id} className="border-b last:border-0">
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.sku}</td>
                    <td className="px-4 py-3">{p.quantity}</td>
                    <td className="px-4 py-3">{p.low_stock_threshold}</td>
                    <td className="px-4 py-3">
                      <Badge variant="destructive" className="gap-1">
                        <AlertTriangleIcon className="size-3" />
                        Low Stock
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
