'use client'

import React, { useEffect, useState } from 'react'
import { ThermometerSun, Leaf, Car, Zap, Utensils, Trash2, Globe, ArrowRight } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts'
import Link from 'next/link'

interface BreakdownPct {
  transport: number
  electricity: number
  food: number
  waste: number
}

interface CarbonResult {
  total_kg: number
  green_score: number
  country_avg_kg: number
  equivalent: string
  breakdown_pct: BreakdownPct
}

const COLORS = ['#16a34a', '#4ade80', '#86efac', '#bbf7d0']

export default function DashboardPage() {
  const [record, setRecord] = useState<CarbonResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSample = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/v1/carbon/sample')
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setRecord(data)
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchSample()
  }, [])

  if (loading || !record) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-muted animate-pulse rounded-xl" />)}
        </div>
      </div>
    )
  }

  const sources = [
    { name: 'Transport', pct: record.breakdown_pct.transport, icon: <Car className="w-5 h-5" /> },
    { name: 'Electricity', pct: record.breakdown_pct.electricity, icon: <Zap className="w-5 h-5" /> },
    { name: 'Food', pct: record.breakdown_pct.food, icon: <Utensils className="w-5 h-5" /> },
    { name: 'Waste', pct: record.breakdown_pct.waste, icon: <Trash2 className="w-5 h-5" /> },
  ]
  const topSource = sources.reduce((prev, current) => (prev.pct > current.pct) ? prev : current)

  const chartData = [
    { name: 'Transport', value: record.breakdown_pct.transport, rawKg: (record.total_kg * record.breakdown_pct.transport) / 100 },
    { name: 'Electricity', value: record.breakdown_pct.electricity, rawKg: (record.total_kg * record.breakdown_pct.electricity) / 100 },
    { name: 'Food', value: record.breakdown_pct.food, rawKg: (record.total_kg * record.breakdown_pct.food) / 100 },
    { name: 'Waste', value: record.breakdown_pct.waste, rawKg: (record.total_kg * record.breakdown_pct.waste) / 100 },
  ].filter(item => item.value > 0)

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Impact Dashboard</h1>
        <p className="text-muted-foreground mt-1">Here is a summary of your environmental footprint.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Total Footprint</h3>
            <div className="h-8 w-8 bg-green-50 dark:bg-green-950/30 text-green-600 rounded-full flex items-center justify-center">
              <ThermometerSun className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {record.total_kg} <span className="text-sm font-normal text-muted-foreground">kg CO₂</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Green Score</h3>
            <div className="h-8 w-8 bg-green-50 dark:bg-green-950/30 text-green-600 rounded-full flex items-center justify-center">
              <Leaf className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-green-600">
            {record.green_score} <span className="text-sm font-normal text-muted-foreground">/ 100</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Top Source</h3>
            <div className="h-8 w-8 bg-green-50 dark:bg-green-950/30 text-green-600 rounded-full flex items-center justify-center">
              {topSource.icon}
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground">{topSource.name}</div>
        </div>

        {/* Card 4 */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Equivalent</h3>
            <div className="h-8 w-8 bg-green-50 dark:bg-green-950/30 text-green-600 rounded-full flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
          </div>
          <div className="text-lg font-bold text-foreground mt-2 leading-tight">{record.equivalent}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Breakdown Chart */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Emission Breakdown</h3>
          <div className="h-[300px] w-full">
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
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                        return (
                          <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                            <tspan x={viewBox.cx} y={(viewBox.cy || 0) - 5} className="fill-foreground text-xl font-bold">
                              {record.total_kg}
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
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6 flex flex-col">
          {/* Action Card */}
          <div className="bg-gradient-to-br from-green-50 to-white dark:from-green-950 dark:to-background border border-green-200 dark:border-green-900 rounded-xl p-6 shadow-sm flex-1 flex flex-col">
            <h3 className="text-lg font-semibold text-green-600 mb-4">AI Recommendation</h3>
            <p className="text-base mb-6 flex-1 text-foreground">
              Your transport emissions are higher than average. Let our AI coach analyze your habits and suggest personalized reduction strategies.
            </p>
            <Link href="/coach" className="w-full">
              <button className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-green-600 text-white hover:bg-green-700 h-10 px-4 py-2">
                Chat with AI Coach
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
