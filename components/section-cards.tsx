"use client"

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUpIcon, PackageIcon, ShoppingCartIcon, AlertTriangleIcon } from "lucide-react"
import { DashboardStats } from "@/types/sale"

export function SectionCards({ stats }: { stats: DashboardStats | null }) {
  return (
    <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card>
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {stats ? `$${stats.total_revenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "—"}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="flex items-center gap-2 font-medium">
            <TrendingUpIcon className="size-4 text-green-500" />
            Lifetime sales revenue
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Units Sold</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {stats ? stats.units_sold.toLocaleString() : "—"}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="flex items-center gap-2 font-medium">
            <ShoppingCartIcon className="size-4 text-blue-500" />
            Total units sold across all orders
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Total Orders</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {stats ? stats.total_sales.toLocaleString() : "—"}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="flex items-center gap-2 font-medium">
            <PackageIcon className="size-4 text-purple-500" />
            Recorded sales transactions
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Low Stock Alerts</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {stats ? stats.low_stock_count : "—"}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="flex items-center gap-2 font-medium">
            <AlertTriangleIcon className="size-4 text-amber-500" />
            {stats?.low_stock_count ? (
              <Badge variant="destructive" className="text-xs">Requires attention</Badge>
            ) : (
              <span className="text-muted-foreground">All stock levels healthy</span>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
