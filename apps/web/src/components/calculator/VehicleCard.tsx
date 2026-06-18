"use client"

import { Card } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

interface VehicleCardProps {
  type: string
  label: string
  icon: string
  selected: boolean
  onSelect: () => void
}

export function VehicleCard({ label, icon, selected, onSelect }: VehicleCardProps): React.ReactElement {
  return (
    <Card 
      onClick={onSelect}
      role="button"
      aria-pressed={selected}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
      className={`relative cursor-pointer transition-all duration-200 overflow-hidden group
        ${selected 
          ? 'border-eco-primary ring-1 ring-eco-primary bg-eco-surface dark:bg-green-900/20' 
          : 'hover:border-green-300 hover:bg-gray-50 dark:hover:bg-gray-900'}`}
    >
      <div className="p-4 flex flex-col items-center text-center space-y-2">
        <div className="text-3xl mb-1 transform transition-transform group-hover:scale-110">
          {icon}
        </div>
        <div className={`text-sm font-medium ${selected ? 'text-eco-primary' : 'text-foreground'}`}>
          {label}
        </div>
      </div>
      
      {selected && (
        <div className="absolute top-2 right-2 text-eco-primary animate-in zoom-in duration-200">
          <CheckCircle2 className="w-5 h-5 fill-white dark:fill-background" />
        </div>
      )}
    </Card>
  )
}
