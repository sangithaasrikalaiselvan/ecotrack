"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ArrowDown, ArrowUp, Minus } from "lucide-react"

interface CarbonCardProps {
  title: string
  value: string | number
  unit?: string
  icon: React.ReactNode
  subtext?: string
  trend?: "up" | "down" | "neutral"
  colorClass?: string
}

export function CarbonCard({ title, value, unit, icon, subtext, trend, colorClass = "text-foreground" }: CarbonCardProps): React.ReactElement {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="h-8 w-8 bg-green-50 dark:bg-green-950/30 text-eco-primary rounded-full flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${colorClass}`}>
          {value}
          {unit && <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>}
        </div>
        {subtext && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center">
            {trend === "up" && <ArrowUp className="h-3 w-3 text-red-500 mr-1" />}
            {trend === "down" && <ArrowDown className="h-3 w-3 text-green-500 mr-1" />}
            {trend === "neutral" && <Minus className="h-3 w-3 text-gray-500 mr-1" />}
            {subtext}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
