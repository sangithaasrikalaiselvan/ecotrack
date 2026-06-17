export interface User {
  id: string
  name: string
  email: string
  country_code: string
}

export interface CarbonRecord {
  transport_kg: number
  electricity_kg: number
  food_kg: number
  waste_kg: number
  total_kg: number
  green_score: number
  equivalent: string
  breakdown_pct: {
    transport: number
    electricity: number
    food: number
    waste: number
  }
  country_avg_kg: number
  record_id: string
}

export interface SimulateResult {
  original_kg: number
  projected_kg: number
  reduction_kg: number
  reduction_pct: number
  new_green_score: number
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface CarbonCalculateRequest {
  vehicle_type: "petrol_car" | "diesel_car" | "electric_car" | "motorcycle" | "bus" | "train" | "cycle" | "walking"
  km_per_day: number
  days_per_week: number
  monthly_kwh: number
  diet_type: "vegan" | "vegetarian" | "flexitarian" | "mixed" | "high_meat"
  waste_habit: "recycle_always" | "recycle_sometimes" | "no_recycling"
  country_code: string
}

export interface SimulateRequest {
  base_result: CarbonRecord
  reduce_transport_pct?: number
  reduce_electricity_pct?: number
  switch_diet_to?: string
  switch_waste_to?: string
}
