'use client'

import React from 'react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-white dark:from-green-950 dark:to-background p-4">
      <div className="w-full max-w-md mb-8 text-center">
        <h1 className="text-3xl font-bold text-green-600 tracking-tight">EcoTrack AI</h1>
      </div>
      {children}
    </div>
  )
}
