'use client'

import React, { useState, useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { useRouter } from 'next/navigation'
import { LogOut, Mail, Globe, Calendar, Award } from 'lucide-react'

interface Stats {
  total_kg: number
  green_score: number
}

const BADGES = [
  { slug: 'first_track', label: 'First Steps', icon: '🌱', earned: true },
  { slug: 'eco_warrior', label: 'Eco Warrior', icon: '🌍', earned: false },
  { slug: 'recycler', label: 'Recycler', icon: '♻️', earned: false },
  { slug: 'champion', label: 'Climate Champion', icon: '🏆', earned: false },
]

export default function ProfilePage() {
  const { user, logout } = useAuthStore()
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSample = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/v1/carbon/sample')
        if (!res.ok) throw new Error('Failed to fetch stats')
        const data = await res.json()
        setStats({ total_kg: data.total_kg, green_score: data.green_score })
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchSample()
  }, [])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (loading || !user || !stats) {
    return (
      <div className="space-y-8 animate-pulse max-w-4xl mx-auto">
        <div className="h-48 bg-card border border-border rounded-2xl"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="h-32 bg-muted rounded-xl"></div>
          <div className="h-32 bg-muted rounded-xl"></div>
          <div className="h-32 bg-muted rounded-xl"></div>
          <div className="h-32 bg-muted rounded-xl"></div>
        </div>
        <div className="h-64 bg-card border border-border rounded-2xl"></div>
      </div>
    )
  }

  const initial = user.name ? user.name.charAt(0).toUpperCase() : 'U'

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">

      {/* SECTION A — Profile Card */}
      <section className="bg-card border border-border rounded-3xl p-8 shadow-sm flex flex-col md:flex-row items-center text-center md:text-left space-y-6 md:space-y-0 md:space-x-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-green-500/20 to-green-600/5 dark:from-green-900/30 dark:to-background z-0"></div>

        <div className="w-32 h-32 bg-green-600 text-white rounded-full flex items-center justify-center text-5xl font-bold shadow-lg border-4 border-background z-10">
          {initial}
        </div>

        <div className="flex-1 z-10">
          <h1 className="text-3xl font-bold text-foreground mb-2">{user.name}</h1>
          <div className="flex flex-col md:flex-row gap-3 text-muted-foreground text-sm font-medium">
            <div className="flex items-center justify-center md:justify-start">
              <Mail className="w-4 h-4 mr-2" />
              {user.email}
            </div>
            <div className="flex items-center justify-center md:justify-start">
              <Globe className="w-4 h-4 mr-2" />
              {user.country_code}
            </div>
            <div className="flex items-center justify-center md:justify-start">
              <Calendar className="w-4 h-4 mr-2" />
              Member since June 2025
            </div>
          </div>
        </div>
      </section>

      {/* SECTION B — Stats Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm text-center">
          <div className="text-sm font-medium text-muted-foreground mb-2">Total Calculations</div>
          <div className="text-3xl font-bold text-foreground">1</div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm text-center">
          <div className="text-sm font-medium text-muted-foreground mb-2">Current Green Score</div>
          <div className="text-3xl font-bold text-green-600">{stats.green_score}</div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm text-center">
          <div className="text-sm font-medium text-muted-foreground mb-2">Best Score Ever</div>
          <div className="text-3xl font-bold text-green-600">{stats.green_score}</div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm text-center">
          <div className="text-sm font-medium text-muted-foreground mb-2">Carbon Tracked</div>
          <div className="text-3xl font-bold text-foreground">{stats.total_kg} <span className="text-base text-muted-foreground">kg</span></div>
        </div>
      </section>

      {/* SECTION C — Achievements */}
      <section className="bg-card border border-border rounded-2xl p-8 shadow-sm">
        <div className="flex items-center space-x-3 mb-8">
          <Award className="w-6 h-6 text-amber-500" />
          <h2 className="text-2xl font-bold text-foreground">Your Badges</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {BADGES.map((badge) => (
            <div
              key={badge.slug}
              className={`flex flex-col items-center p-6 rounded-2xl border transition-all ${badge.earned
                  ? 'border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-900/20 shadow-md transform hover:scale-105'
                  : 'border-border bg-muted/50 grayscale opacity-50'
                }`}
            >
              <div className="text-5xl mb-4">{badge.icon}</div>
              <div className="font-bold text-center mb-1 text-foreground">{badge.label}</div>
              {!badge.earned && (
                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Locked</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION D — Danger Zone */}
      <section className="pt-8 flex justify-center md:justify-end">
        <button
          onClick={handleLogout}
          className="inline-flex items-center justify-center px-6 py-3 border-2 border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 font-bold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Log Out
        </button>
      </section>

    </div>
  )
}
