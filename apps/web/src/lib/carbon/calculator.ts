export const EMISSION_FACTORS = {
  petrol_car: 0.192,
  diesel_car: 0.171,
  electric_car: 0.053,
  motorcycle: 0.114,
  bus: 0.089,
  train: 0.041,
  cycle: 0.0,
  walking: 0.0
} as const

export const FOOD_FACTORS = {
  vegan: 30,
  vegetarian: 50,
  flexitarian: 70,
  mixed: 90,
  high_meat: 150
} as const

export const WASTE_FACTORS = {
  recycle_always: 10,
  recycle_sometimes: 20,
  no_recycling: 40
} as const

export function calculateTransport(vehicle: string, kmPerDay: number, daysPerWeek: number): number {
  if (kmPerDay <= 0 || daysPerWeek <= 0) return 0
  const factor = EMISSION_FACTORS[vehicle as keyof typeof EMISSION_FACTORS] ?? 0
  return factor * kmPerDay * daysPerWeek * 4.33
}

export function calculateFood(dietType: string): number {
  return FOOD_FACTORS[dietType as keyof typeof FOOD_FACTORS] ?? 90
}

export function calculateWaste(wasteHabit: string): number {
  return WASTE_FACTORS[wasteHabit as keyof typeof WASTE_FACTORS] ?? 20
}

export function calculateGreenScore(totalKg: number, countryAvgKg: number): number {
  let score = 100 - ((totalKg / countryAvgKg) * 50)
  if (score > 100) score = 100
  if (score < 0) score = 0
  return Math.round(score)
}
