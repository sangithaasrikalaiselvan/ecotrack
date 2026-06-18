"use client"

import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useCarbonStore } from "@/stores/carbon-store"
import { calculateFootprint, saveRecord } from "@/lib/api/carbon"

import Link from "next/link"

import { StepIndicator } from "@/components/shared/StepIndicator"
import { LoadingOverlay } from "@/components/shared/LoadingOverlay"
import { VehicleCard } from "@/components/calculator/VehicleCard"
import { BreakdownDonut } from "@/components/charts/BreakdownDonut"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowRight, ArrowLeft } from "lucide-react"

const calculatorSchema = z.object({
  vehicle_type: z.enum(["petrol_car", "diesel_car", "electric_car", "motorcycle", "bus", "train", "cycle", "walking"]),
  km_per_day: z.number().min(0).max(1000),
  days_per_week: z.number().min(0).max(7),
  monthly_kwh: z.number().min(0).max(10000, "Please enter a valid kWh"),
  country_code: z.string().min(2).max(2),
  diet_type: z.enum(["vegan", "vegetarian", "flexitarian", "mixed", "high_meat"]),
  waste_habit: z.enum(["recycle_always", "recycle_sometimes", "no_recycling"]),
})

type CalculatorForm = z.infer<typeof calculatorSchema>

const steps = ["Transport", "Electricity", "Food & Waste", "Results"]

const vehicleOptions = [
  { id: "petrol_car", label: "Petrol Car", icon: "🚗" },
  { id: "diesel_car", label: "Diesel Car", icon: "🚙" },
  { id: "electric_car", label: "Electric Car", icon: "⚡" },
  { id: "motorcycle", label: "Motorcycle", icon: "🏍️" },
  { id: "bus", label: "Bus", icon: "🚌" },
  { id: "train", label: "Train", icon: "🚂" },
  { id: "cycle", label: "Cycle", icon: "🚲" },
  { id: "walking", label: "Walking", icon: "🚶" },
]

const dietOptions = [
  { id: "vegan", label: "Vegan", desc: "Plant-based only", icon: "🌱" },
  { id: "vegetarian", label: "Vegetarian", desc: "No meat", icon: "🥗" },
  { id: "flexitarian", label: "Flexitarian", desc: "Occasionally meat", icon: "🍽️" },
  { id: "mixed", label: "Mixed", desc: "Regular meat", icon: "🥩" },
  { id: "high_meat", label: "High Meat", desc: "Meat every day", icon: "🍖" },
]

export default function CalculatorPage() {
  const { currentRecord, setCurrentRecord, isCalculating, setCalculating } = useCarbonStore()
  const [currentStep, setCurrentStep] = useState(0)
  const [animatedScore, setAnimatedScore] = useState(0)

  const { register, control, handleSubmit, watch, formState: { errors }, trigger } = useForm<CalculatorForm>({
    resolver: zodResolver(calculatorSchema),
    mode: "onChange",
    defaultValues: {
      vehicle_type: "petrol_car",
      km_per_day: 15,
      days_per_week: 5,
      monthly_kwh: 150,
      country_code: "IN",
      diet_type: "mixed",
      waste_habit: "recycle_sometimes"
    }
  })

  const watchKwh = watch("monthly_kwh")
  const [kwhEstimate, setKwhEstimate] = useState(0)

  // Debounced estimation for electricity
  useEffect(() => {
    const handler = setTimeout(() => {
      // rough estimation for display
      setKwhEstimate(watchKwh * 0.82)
    }, 500)
    return () => clearTimeout(handler)
  }, [watchKwh])

  // Results animation
  useEffect(() => {
    if (currentStep === 3 && currentRecord) {
      let current = 0
      const timer = setInterval(() => {
        current += (currentRecord.green_score / 60)
        if (current >= currentRecord.green_score) {
          setAnimatedScore(currentRecord.green_score)
          clearInterval(timer)
        } else {
          setAnimatedScore(Math.round(current))
        }
      }, 25)
      return () => clearInterval(timer)
    }
  }, [currentStep, currentRecord])

  const nextStep = async () => {
    let fieldsToValidate: (keyof CalculatorForm)[] = []
    if (currentStep === 0) fieldsToValidate = ["vehicle_type", "km_per_day", "days_per_week"]
    if (currentStep === 1) fieldsToValidate = ["monthly_kwh", "country_code"]

    const isStepValid = await trigger(fieldsToValidate)
    if (isStepValid) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => setCurrentStep(prev => prev - 1)

  const onSubmit = async (data: CalculatorForm) => {
    setCalculating(true)
    try {
      const result = await calculateFootprint(data)
      setCurrentRecord(result)
      setCurrentStep(3) // move to results

      // Auto-save in background
      await saveRecord(result)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Calculation failed", error)
    } finally {
      setCalculating(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-6">
      <StepIndicator steps={steps} currentStep={currentStep} />

      {isCalculating && <LoadingOverlay message="Calculating your footprint..." />}

      <div className="mt-8 bg-card rounded-2xl shadow-sm border border-border p-6 sm:p-8">
        {currentStep < 3 ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

            {/* STEP 1: TRANSPORT */}
            <div className={currentStep === 0 ? "block" : "hidden"}>
              <h2 className="text-2xl font-bold mb-6">How do you get around?</h2>

              <div className="space-y-8">
                <div>
                  <Label className="text-base mb-4 block">Primary Vehicle Type</Label>
                  <Controller
                    name="vehicle_type"
                    control={control}
                    render={({ field }) => (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {vehicleOptions.map(opt => (
                          <VehicleCard
                            key={opt.id}
                            type={opt.id}
                            label={opt.label}
                            icon={opt.icon}
                            selected={field.value === opt.id}
                            onSelect={() => field.onChange(opt.id)}
                          />
                        ))}
                      </div>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-base">Kilometers per day</Label>
                    <span className="text-xl font-bold text-eco-primary">{watch("km_per_day")} km</span>
                  </div>
                  <Controller
                    name="km_per_day"
                    control={control}
                    render={({ field }) => (
                      <Slider
                        aria-label="Kilometers per day"
                        aria-valuemin={0}
                        aria-valuemax={200}
                        aria-valuenow={field.value}
                        min={0} max={200} step={1}
                        value={[field.value]}
                        onValueChange={(vals) => field.onChange(Array.isArray(vals) ? vals[0] : vals)}
                      />
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-base block">Days per week</Label>
                  <Controller
                    name="days_per_week"
                    control={control}
                    render={({ field }) => (
                      <div className="flex space-x-2">
                        {[1, 2, 3, 4, 5, 6, 7].map(d => (
                          <Button
                            key={d} type="button"
                            variant={field.value === d ? "default" : "outline"}
                            className={field.value === d ? "bg-eco-primary" : ""}
                            onClick={() => field.onChange(d)}
                          >
                            {d}
                          </Button>
                        ))}
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* STEP 2: ELECTRICITY */}
            <div className={currentStep === 1 ? "block" : "hidden"}>
              <h2 className="text-2xl font-bold mb-6">Home Energy Use</h2>

              <div className="space-y-8">
                <div className="space-y-2">
                  <Label htmlFor="monthly_kwh" className="text-base">Monthly Electricity (kWh)</Label>
                  <Input id="monthly_kwh" type="number" {...register("monthly_kwh", { valueAsNumber: true })} className="text-2xl h-14" />
                  <p className="text-sm text-muted-foreground">Check your electricity bill for this number</p>
                  {errors.monthly_kwh && <p className="text-red-500 text-sm">{errors.monthly_kwh.message}</p>}
                </div>

                <div className="p-4 bg-eco-surface dark:bg-green-950/30 rounded-xl flex items-center justify-between border border-green-100 dark:border-green-900">
                  <div className="text-eco-primary font-medium">Estimated Emissions</div>
                  <div className="text-xl font-bold text-eco-primary">≈ {kwhEstimate.toFixed(1)} kg CO₂</div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country_code" className="text-base">Country</Label>
                  <select id="country_code" {...register("country_code")} className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="IN">India</option>
                    <option value="US">United States</option>
                    <option value="GB">United Kingdom</option>
                    <option value="DE">Germany</option>
                  </select>
                </div>
              </div>
            </div>

            {/* STEP 3: FOOD & WASTE */}
            <div className={currentStep === 2 ? "block" : "hidden"}>
              <h2 className="text-2xl font-bold mb-6">Diet & Waste</h2>

              <div className="space-y-8">
                <div>
                  <Label className="text-base mb-4 block">Diet Type</Label>
                  <Controller
                    name="diet_type"
                    control={control}
                    render={({ field }) => (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {dietOptions.map(opt => (
                          <Card
                            key={opt.id} onClick={() => field.onChange(opt.id)}
                            className={`cursor-pointer transition-all ${field.value === opt.id ? 'border-eco-primary ring-1 ring-eco-primary bg-eco-surface dark:bg-green-900/20' : 'hover:border-green-300'}`}
                          >
                            <CardContent className="p-4 flex items-center space-x-4">
                              <span className="text-3xl">{opt.icon}</span>
                              <div>
                                <div className="font-medium">{opt.label}</div>
                                <div className="text-sm text-muted-foreground">{opt.desc}</div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  />
                </div>

                <div>
                  <Label className="text-base mb-4 block">Waste Habits</Label>
                  <Controller
                    name="waste_habit"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup value={field.value} onValueChange={field.onChange} className="space-y-3">
                        <div className="flex items-center space-x-2 border p-4 rounded-xl">
                          <RadioGroupItem value="recycle_always" id="r1" />
                          <Label htmlFor="r1" className="cursor-pointer">♻️ Recycle Always</Label>
                        </div>
                        <div className="flex items-center space-x-2 border p-4 rounded-xl">
                          <RadioGroupItem value="recycle_sometimes" id="r2" />
                          <Label htmlFor="r2" className="cursor-pointer">🔄 Sometimes</Label>
                        </div>
                        <div className="flex items-center space-x-2 border p-4 rounded-xl">
                          <RadioGroupItem value="no_recycling" id="r3" />
                          <Label htmlFor="r3" className="cursor-pointer">🗑️ Never</Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              {currentStep > 0 ? (
                <Button type="button" variant="outline" onClick={prevStep}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
              ) : <div></div>}

              {currentStep < 2 ? (
                <Button type="button" className="bg-eco-primary hover:bg-eco-secondary" onClick={nextStep} aria-label={currentStep === 0 ? "Continue to electricity step" : "Continue to food and waste step"}>
                  Next <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button type="submit" className="bg-eco-primary hover:bg-eco-secondary text-white font-semibold" aria-label="Calculate my carbon footprint">
                  Calculate Results
                </Button>
              )}
            </div>
          </form>
        ) : (
          /* STEP 4: RESULTS */
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {currentRecord && (
              <div className="text-center space-y-8">
                <h2 className="text-3xl font-bold">Your Results are Ready!</h2>

                <div className="flex justify-center">
                  <div className="relative">
                    <svg className="w-48 h-48 transform -rotate-90">
                      <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="none" className="text-gray-100 dark:text-gray-800" />
                      <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="none"
                        strokeDasharray={2 * Math.PI * 88}
                        strokeDashoffset={2 * Math.PI * 88 * (1 - animatedScore / 100)}
                        strokeLinecap="round"
                        className="text-eco-primary transition-all duration-300"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-5xl font-bold text-eco-primary">{animatedScore}</span>
                      <span className="text-sm font-medium text-muted-foreground uppercase mt-1">Green Score</span>
                    </div>
                  </div>
                </div>

                <div className="bg-eco-surface dark:bg-green-950/20 p-6 rounded-2xl inline-block w-full max-w-sm border border-green-100 dark:border-green-900">
                  <div className="text-sm text-muted-foreground mb-1">Total Monthly Footprint</div>
                  <div className="text-4xl font-black text-eco-primary mb-2">{currentRecord.total_kg} kg CO₂</div>
                  <div className="text-sm font-medium">{currentRecord.equivalent}</div>
                </div>

                <div className="max-w-xs mx-auto">
                  <BreakdownDonut data={currentRecord.breakdown_pct} totalKg={currentRecord.total_kg} />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                  <Link href="/dashboard">
                    <Button variant="outline" className="h-12 px-6 text-base w-full">
                      View Full Dashboard
                    </Button>
                  </Link>
                  <Link href="/coach">
                    <Button className="h-12 px-6 text-base bg-eco-primary hover:bg-eco-secondary text-white w-full">
                      Chat with AI Coach
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
