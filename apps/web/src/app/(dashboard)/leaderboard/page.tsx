'use client'

import React, { useState } from 'react'
import { Trophy } from 'lucide-react'

const mockLeaderboard = [
  { rank: 1, name: 'Priya S.', score: 92, reduction: 45, badge: '🏆' },
  { rank: 2, name: 'Arjun M.', score: 88, reduction: 38, badge: '🌍' },
  { rank: 3, name: 'Sara K.', score: 85, reduction: 35, badge: '🌍' },
  { rank: 4, name: 'Rahul T.', score: 79, reduction: 28, badge: '♻️' },
  { rank: 5, name: 'Meera P.', score: 75, reduction: 24, badge: '♻️' },
  { rank: 6, name: 'Dev R.', score: 71, reduction: 20, badge: '♻️' },
  { rank: 7, name: 'Anita B.', score: 65, reduction: 15, badge: '🌱' },
  { rank: 8, name: 'Kiran L.', score: 60, reduction: 12, badge: '🌱' },
  { rank: 9, name: 'You', score: 55, reduction: 8, badge: '🌱', isCurrentUser: true },
  { rank: 10, name: 'Vijay N.', score: 48, reduction: 5, badge: '🌱' },
]

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<'monthly' | 'alltime'>('monthly')

  // We use the same mock data for both tabs as requested
  const data = mockLeaderboard

  return (
    <div className="max-w-4xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 space-y-4 md:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/40 rounded-2xl flex items-center justify-center text-amber-500 shadow-sm">
            <Trophy className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Top Carbon Reducers</h1>
        </div>

        <div className="flex p-1 bg-muted rounded-lg">
          <button
            onClick={() => setActiveTab('monthly')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'monthly' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setActiveTab('alltime')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'alltime' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="py-4 px-6 font-semibold text-sm text-muted-foreground">Rank</th>
                <th className="py-4 px-6 font-semibold text-sm text-muted-foreground">User</th>
                <th className="py-4 px-6 font-semibold text-sm text-muted-foreground text-center">Badge</th>
                <th className="py-4 px-6 font-semibold text-sm text-muted-foreground text-center">Green Score</th>
                <th className="py-4 px-6 font-semibold text-sm text-muted-foreground text-right">CO₂ Reduced</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.map((user) => {
                let rowBg = 'bg-transparent'
                if (user.rank === 1) rowBg = 'bg-[#fef9c3] dark:bg-amber-900/20'
                else if (user.rank === 2) rowBg = 'bg-[#f1f5f9] dark:bg-slate-800/50'
                else if (user.rank === 3) rowBg = 'bg-[#fef3c7] dark:bg-orange-900/20'
                else if (user.isCurrentUser) rowBg = 'bg-green-50 dark:bg-green-900/20 border-y-2 border-green-500/50'

                return (
                  <tr key={user.rank} className={`${rowBg} transition-colors hover:bg-muted/30`}>
                    <td className="py-4 px-6 font-medium">
                      {user.rank <= 3 ? (
                        <span className="inline-flex w-6 h-6 items-center justify-center rounded-full font-bold text-xs bg-white/80 dark:bg-black/20 shadow-sm">
                          {user.rank}
                        </span>
                      ) : (
                        <span className="text-muted-foreground ml-2">{user.rank}</span>
                      )}
                    </td>
                    <td className={`py-4 px-6 ${user.isCurrentUser ? 'font-bold text-green-700 dark:text-green-400' : 'font-medium'}`}>
                      {user.name}
                    </td>
                    <td className="py-4 px-6 text-center text-xl">
                      {user.badge}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex px-2 py-1 rounded-md text-xs font-bold ${
                        user.score > 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/50' : 
                        user.score > 60 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50' : 
                        'bg-red-100 text-red-700 dark:bg-red-900/50'
                      }`}>
                        {user.score}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-medium text-green-600 dark:text-green-400">
                      -{user.reduction} kg
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Badge Legend</h3>
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🌱</span>
            <span className="text-sm font-medium">Beginner</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xl">♻️</span>
            <span className="text-sm font-medium">Recycler</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xl">🌍</span>
            <span className="text-sm font-medium">Eco Warrior</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xl">🏆</span>
            <span className="text-sm font-medium">Climate Champion</span>
          </div>
        </div>
      </div>

    </div>
  )
}
