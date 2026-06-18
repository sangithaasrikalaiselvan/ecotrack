'use client'

import React, { useMemo } from 'react'
import { ThermometerSun, Leaf, Car, Zap, Utensils, Trash2, Globe, ArrowRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { toast } from 'sonner'

const BreakdownDonut = dynamic(
  () => import("@/components/charts/BreakdownDonut").then(mod => mod.BreakdownDonut),
  { ssr: false, loading: () => <div className="h-[300px] w-full bg-muted/20 animate-pulse rounded-full flex items-center justify-center">Loading chart...</div> }
)

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

export default function DashboardPage() {
  const { data: record, isLoading: loading } = useQuery<CarbonResult>({
    queryKey: ['carbonSample'],
    queryFn: async () => {
      try {
        const res = await fetch('http://localhost:8000/api/v1/carbon/sample')
        if (!res.ok) throw new Error('Failed to fetch')
        return await res.json()
      } catch (err: unknown) {
        if (err instanceof Error) {
          toast.error(err.message)
        } else {
          toast.error('Something went wrong. Please try again.')
        }
        throw err
      }
    }
  })

  const sources = useMemo(() => {
    if (!record) return []
    return [
      { name: 'Transport', pct: record.breakdown_pct.transport, icon: <Car className="w-5 h-5" /> },
      { name: 'Electricity', pct: record.breakdown_pct.electricity, icon: <Zap className="w-5 h-5" /> },
      { name: 'Food', pct: record.breakdown_pct.food, icon: <Utensils className="w-5 h-5" /> },
      { name: 'Waste', pct: record.breakdown_pct.waste, icon: <Trash2 className="w-5 h-5" /> },
    ]
  }, [record])
  const topSource = useMemo(() => {
    if (!sources.length) return { name: '', pct: 0, icon: null }
    return sources.reduce((prev, current) => (prev.pct > current.pct) ? prev : current)
  }, [sources])

  const chartData = useMemo(() => {
    if (!record) return []
    return [
      { name: 'Transport', value: record.breakdown_pct.transport, rawKg: (record.total_kg * record.breakdown_pct.transport) / 100 },
      { name: 'Electricity', value: record.breakdown_pct.electricity, rawKg: (record.total_kg * record.breakdown_pct.electricity) / 100 },
      { name: 'Food', value: record.breakdown_pct.food, rawKg: (record.total_kg * record.breakdown_pct.food) / 100 },
      { name: 'Waste', value: record.breakdown_pct.waste, rawKg: (record.total_kg * record.breakdown_pct.waste) / 100 },
    ].filter(item => item.value > 0)
  }, [record])

  if (loading || !record) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-muted animate-pulse rounded-xl" />)}
        </div>
      </div>
    )
  }

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
          <p className="text-xs text-muted-foreground mt-2 font-medium">
            {record.green_score > 50 ? `+${record.green_score - 50} above average` : record.green_score < 50 ? `${record.green_score - 50} below average` : 'Exactly average'}
          </p>
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
            <BreakdownDonut data={record.breakdown_pct} totalKg={record.total_kg} />
            <table className="sr-only">
              <caption>Carbon footprint breakdown data</caption>
              <thead>
                <tr>
                  <th scope="col">Category</th>
                  <th scope="col">kg CO₂</th>
                  <th scope="col">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((d) => (
                  <tr key={d.name}>
                    <td>{d.name}</td>
                    <td>{d.rawKg} kg</td>
                    <td>{d.value}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
