'use client'

import React, { useEffect, useState } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, Calculator, Lightbulb, Bot, Trophy, LogOut, Leaf } from 'lucide-react'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Calculator', href: '/calculator', icon: Calculator },
  { name: 'Insights', href: '/insights', icon: Lightbulb },
  { name: 'AI Coach', href: '/coach', icon: Bot },
  { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, hydrate, logout } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    hydrate()
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [hydrate])

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/login')
    }
  }, [mounted, isAuthenticated, router])

  if (!mounted || !isAuthenticated) {
    return <div className="min-h-screen bg-background" />
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card/50 backdrop-blur-sm sticky top-0 h-screen">
        <div className="p-6 flex items-center space-x-2">
          <Leaf className="w-6 h-6 text-green-600" />
          <span className="text-xl font-bold text-green-600 tracking-tight">EcoTrack AI</span>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-green-600/10 text-green-600 font-medium' 
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-green-600' : ''}`} />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-border mt-auto">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen pb-20 md:pb-0">
        <header className="md:hidden h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40 flex items-center justify-between px-4">
          <div className="flex items-center space-x-2">
             <Leaf className="w-5 h-5 text-green-600" />
             <span className="text-lg font-bold text-green-600">EcoTrack AI</span>
          </div>
          <button onClick={handleLogout} className="text-muted-foreground p-2">
            <LogOut className="w-5 h-5" />
          </button>
        </header>

        <main className="flex-1 p-4 sm:p-8 max-w-6xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-background/80 backdrop-blur-lg z-50 px-2 pb-safe">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                  isActive ? 'text-green-600' : 'text-muted-foreground'
                }`}
              >
                <div className={`p-1.5 rounded-full ${isActive ? 'bg-green-600/10' : ''}`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium leading-none">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
