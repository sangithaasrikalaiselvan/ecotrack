'use client'

import React, { useState, useEffect } from 'react'
import { Car, Zap, Utensils, Trash2, Loader2, BarChart3, TrendingDown } from 'lucide-react'

interface CarbonResult {
  total_kg: number
  green_score: number
  country_avg_kg: number
  equivalent: string
  breakdown_pct: {
    transport: number
    electricity: number
    food: number
    waste: number
  }
}

interface SimulateResult {
  original_kg: number
  projected_kg: number
  reduction_kg: number
  reduction_pct: number
  new_green_score: number
}

const icons = {
  transport: <Car className="w-5 h-5" />,
  electricity: <Zap className="w-5 h-5" />,
  food: <Utensils className="w-5 h-5" />,
  waste: <Trash2 className="w-5 h-5" />
}

export default function InsightsPage() {
  const [baseResult, setBaseResult] = useState<CarbonResult | null>(null)
  const [simulateResult, setSimulateResult] = useState<SimulateResult | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [loading, setLoading] = useState(true)

  const [sliders, setSliders] = useState({
    transport: 0,
    electricity: 0,
    diet: 'mixed',
    waste: 'recycle_sometimes'
  })

  useEffect(() => {
    const fetchSample = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/v1/carbon/sample')
        if (!res.ok) throw new Error('Failed to fetch data')
        const data = await res.json()
        setBaseResult(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchSample()
  }, [])

  const handleSimulate = async () => {
    if (!baseResult) return
    setIsSimulating(true)
    try {
      const res = await fetch('http://localhost:8000/api/v1/carbon/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base_result: baseResult,
          reduce_transport_pct: sliders.transport,
          reduce_electricity_pct: sliders.electricity,
          switch_diet_to: sliders.diet,
          switch_waste_to: sliders.waste
        })
      })
      if (!res.ok) throw new Error('Failed to simulate')
      const data = await res.json()
      setSimulateResult(data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsSimulating(false)
    }
  }

  if (loading || !baseResult) {
    return (
      <div className="space-y-8 animate-pulse max-w-4xl mx-auto">
        <div className="h-10 bg-muted rounded w-64 mb-6"></div>
        <div className="h-64 bg-card rounded-2xl border border-border"></div>
        <div className="h-96 bg-card rounded-2xl border border-border mt-8"></div>
      </div>
    )
  }

  const breakdownArray = [
    { id: 'transport', name: 'Transport', pct: baseResult.breakdown_pct.transport, kg: (baseResult.total_kg * baseResult.breakdown_pct.transport) / 100 },
    { id: 'electricity', name: 'Electricity', pct: baseResult.breakdown_pct.electricity, kg: (baseResult.total_kg * baseResult.breakdown_pct.electricity) / 100 },
    { id: 'food', name: 'Food', pct: baseResult.breakdown_pct.food, kg: (baseResult.total_kg * baseResult.breakdown_pct.food) / 100 },
    { id: 'waste', name: 'Waste', pct: baseResult.breakdown_pct.waste, kg: (baseResult.total_kg * baseResult.breakdown_pct.waste) / 100 },
  ].sort((a, b) => b.pct - a.pct)

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-12">
      
      {/* SECTION A: Carbon Sources Ranking */}
      <section className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center text-green-600 mr-4">
            <BarChart3 className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Your Emission Sources</h2>
        </div>
        
        <div className="space-y-6">
          {breakdownArray.map((item) => (
            <div key={item.id} className="w-full">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center font-medium">
                  <span className="text-green-600 mr-2">{icons[item.id as keyof typeof icons]}</span>
                  <span className="text-foreground capitalize">{item.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold">{item.pct.toFixed(1)}%</span>
                  <span className="text-sm text-muted-foreground ml-2">({item.kg.toFixed(1)} kg)</span>
                </div>
              </div>
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${item.pct}%` }} 
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION B: What-If Simulator */}
      <section className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="flex items-center mb-2">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center text-green-600 mr-4">
            <TrendingDown className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">What If Simulator</h2>
        </div>
        <p className="text-muted-foreground mb-8 ml-14">Adjust sliders to see your potential savings</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ml-0 md:ml-14">
          
          <div className="space-y-3">
            <label className="text-sm font-medium flex justify-between">
              <span>Drive less</span>
              <span className="text-green-600 font-bold">Reduce by {sliders.transport}%</span>
            </label>
            <input 
              type="range" min="0" max="100" 
              value={sliders.transport} 
              onChange={(e) => setSliders({ ...sliders, transport: parseInt(e.target.value) })}
              className="w-full accent-green-600 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium flex justify-between">
              <span>Use less electricity</span>
              <span className="text-green-600 font-bold">Reduce by {sliders.electricity}%</span>
            </label>
            <input 
              type="range" min="0" max="100" 
              value={sliders.electricity} 
              onChange={(e) => setSliders({ ...sliders, electricity: parseInt(e.target.value) })}
              className="w-full accent-green-600 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium block">Change diet</label>
            <select 
              value={sliders.diet}
              onChange={(e) => setSliders({ ...sliders, diet: e.target.value })}
              className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="high_meat">High Meat</option>
              <option value="mixed">Mixed</option>
              <option value="flexitarian">Flexitarian</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium block">Waste habits</label>
            <select 
              value={sliders.waste}
              onChange={(e) => setSliders({ ...sliders, waste: e.target.value })}
              className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="no_recycling">No Recycling</option>
              <option value="recycle_sometimes">Recycle Sometimes</option>
              <option value="recycle_always">Recycle Always</option>
            </select>
          </div>

        </div>

        <div className="mt-8 ml-0 md:ml-14">
          <button 
            onClick={handleSimulate}
            disabled={isSimulating}
            className="w-full h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium flex items-center justify-center transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSimulating ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
            Calculate Savings
          </button>
        </div>
      </section>

      {/* SECTION C: Simulate Result */}
      {simulateResult && (
        <section className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-2xl p-6 md:p-8 animate-in slide-in-from-bottom-4 fade-in duration-500 shadow-sm">
          <h3 className="text-xl font-bold mb-6 text-center text-foreground">Your Potential Impact</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-card border border-border rounded-xl p-4 text-center shadow-sm">
              <div className="text-sm text-muted-foreground mb-1">Current</div>
              <div className="text-2xl font-bold">{simulateResult.original_kg.toFixed(1)} kg</div>
            </div>
            
            <div className="bg-green-100/50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl p-4 text-center shadow-sm">
              <div className="text-sm text-green-700 dark:text-green-400 mb-1">Projected</div>
              <div className="text-2xl font-bold text-green-700 dark:text-green-400">{simulateResult.projected_kg.toFixed(1)} kg</div>
            </div>
            
            <div className="bg-green-600 border border-green-600 rounded-xl p-4 text-center shadow-md text-white transform scale-105">
              <div className="text-sm text-green-100 mb-1">You Save</div>
              <div className="text-3xl font-black">{simulateResult.reduction_kg.toFixed(1)} kg</div>
              <div className="text-xs text-green-100 font-medium bg-green-700/50 inline-block px-2 py-0.5 rounded-full mt-1">
                ↓ {simulateResult.reduction_pct.toFixed(1)}% drop
              </div>
            </div>
          </div>
          
          <div className="text-center p-4 bg-white dark:bg-card rounded-xl border border-border">
            <span className="font-medium">Your new Green Score would be </span>
            <span className="text-2xl font-bold text-green-600 ml-2">{simulateResult.new_green_score}/100</span>
          </div>
        </section>
      )}

    </div>
  )
}
