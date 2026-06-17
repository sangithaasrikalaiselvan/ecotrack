"use client"

import { useEffect, useState } from "react"
import { useReducedMotion } from "framer-motion"

interface GreenScoreRingProps {
  score: number
  size?: "sm" | "md" | "lg"
}

export function GreenScoreRing({ score, size = "md" }: GreenScoreRingProps) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) {
      // eslint-disable-next-line
      setAnimatedScore(score)
      return
    }

    const duration = 1500
    const steps = 60
    const stepTime = duration / steps
    const increment = score / steps

    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= score) {
        setAnimatedScore(score)
        clearInterval(timer)
      } else {
        setAnimatedScore(Math.round(current))
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [score, prefersReducedMotion])

  let colorClass = "text-eco-primary"
  if (score <= 40) colorClass = "text-red-500"
  else if (score <= 70) colorClass = "text-amber-500"

  const dimensions = {
    sm: { size: 64, strokeWidth: 4, text: "text-lg" },
    md: { size: 120, strokeWidth: 8, text: "text-3xl" },
    lg: { size: 180, strokeWidth: 12, text: "text-5xl" },
  }

  const { size: dSize, strokeWidth, text } = dimensions[size]
  const radius = (dSize - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference

  return (
    <div className="relative flex items-center justify-center" style={{ width: dSize, height: dSize }}>
      <svg className="transform -rotate-90 w-full h-full">
        {/* Background circle */}
        <circle
          cx={dSize / 2}
          cy={dSize / 2}
          r={radius}
          className="text-gray-200 dark:text-gray-800"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx={dSize / 2}
          cy={dSize / 2}
          r={radius}
          className={`${colorClass} transition-all duration-300 ease-out`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
        />
      </svg>
      <div className={`absolute flex flex-col items-center justify-center font-bold ${colorClass}`}>
        <span className={text}>{animatedScore}</span>
      </div>
    </div>
  )
}
