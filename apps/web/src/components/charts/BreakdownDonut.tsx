"use client"

import { useMemo } from 'react'
import { useReducedMotion } from "framer-motion"
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Label } from "recharts"

interface BreakdownDonutProps {
  data: {
    transport: number
    electricity: number
    food: number
    waste: number
  }
  totalKg: number
}

const COLORS = ["#16a34a", "#4ade80", "#86efac", "#bbf7d0"]

export function BreakdownDonut({ data, totalKg }: BreakdownDonutProps): React.ReactElement {
  const prefersReducedMotion = useReducedMotion()

  const chartData = useMemo(() => [
    { name: "Transport", value: data.transport, rawKg: (totalKg * data.transport) / 100 },
    { name: "Electricity", value: data.electricity, rawKg: (totalKg * data.electricity) / 100 },
    { name: "Food", value: data.food, rawKg: (totalKg * data.food) / 100 },
    { name: "Waste", value: data.waste, rawKg: (totalKg * data.waste) / 100 },
  ].filter(item => item.value > 0), [data, totalKg]) // only show categories with data

  return (
    <div className="h-[300px] w-full" aria-label="Carbon Footprint Breakdown Chart">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            isAnimationActive={!prefersReducedMotion}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                      <tspan x={viewBox.cx} y={(viewBox.cy || 0) - 5} className="fill-foreground text-xl font-bold">
                        {totalKg}
                      </tspan>
                      <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 15} className="fill-muted-foreground text-xs">
                        kg CO₂
                      </tspan>
                    </text>
                  )
                }
                return null
              }}
            />
          </Pie>
          <Tooltip 
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any, name: any, props: any) => [
              `${Number(value).toFixed(1)}% (${props.payload.rawKg.toFixed(1)} kg)`, 
              name
            ]}
            contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
          />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
