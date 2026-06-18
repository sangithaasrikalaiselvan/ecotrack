"use client"

import { Check } from "lucide-react"

interface StepIndicatorProps {
  steps: string[]
  currentStep: number
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2" role="list">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep

          return (
            <div key={step} role="listitem" aria-current={isCurrent ? "step" : undefined} aria-label={`Step ${index + 1} of ${steps.length}: ${step}`} className="flex flex-col items-center relative z-10">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-300
                  ${isCompleted ? 'bg-eco-primary text-white' : 
                    isCurrent ? 'bg-green-100 text-eco-primary border-2 border-eco-primary dark:bg-green-900/50' : 
                    'bg-gray-100 text-gray-400 dark:bg-gray-800'}`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <span className={`mt-2 text-xs font-medium hidden sm:block ${isCurrent ? 'text-eco-primary' : 'text-muted-foreground'}`}>
                {step}
              </span>
            </div>
          )
        })}
      </div>
      <div className="relative mt-[-2.2rem] sm:mt-[-2.75rem] mb-8 sm:mb-10 w-full h-1 bg-gray-100 dark:bg-gray-800 rounded-full z-0 pointer-events-none">
        <div 
          className="absolute top-0 left-0 h-full bg-eco-primary transition-all duration-500 ease-in-out rounded-full"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  )
}
