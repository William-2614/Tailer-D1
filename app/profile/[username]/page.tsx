'use client'

import { useState, useEffect } from 'react'
import { use } from 'react'

interface UserStats {
  totalBets: number
  wonBets: number
  lostBets: number
  pushBets: number
  pendingBets: number
  winPercentage: number
  roi: number
  totalProfit: number
  totalWagered: number
  currentWinStreak: number
  currentLossStreak: number
  longestWinStreak: number
  longestLossStreak: number
  updatedAt: string
}

export default function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const resolvedParams = use(params)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Mock data for demonstration
    // In production, this would fetch from /api/stats/[userId]
    setTimeout(() => {
      setStats({
        totalBets: 85,
        wonBets: 52,
        lostBets: 28,
        pushBets: 5,
        pendingBets: 3,
        winPercentage: 61.18,
        roi: 9.5,
        totalProfit: 2340.50,
        totalWagered: 24637.00,
        currentWinStreak: 4,
        currentLossStreak: 0,
        longestWinStreak: 12,
        longestLossStreak: 6,
        updatedAt: new Date().toISOString(),
      })
      setLoading(false)
    }, 500)
  }, [resolvedParams.username])

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 dark:text-gray-300">Loading profile...</p>
        </div>
      </main>
    )
  }

  if (error || !stats) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-xl text-red-500">{error || 'Profile not found'}</p>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">@{resolvedParams.username}</h1>
        <p className="text-gray-600 dark:text-gray-300">
          All statistics are public and updated automatically after each bet result.
        </p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <p className="text-sm text-gray-500 mb-2">Win Rate</p>
          <p className="text-4xl font-bold text-green-500">
            {stats.winPercentage.toFixed(2)}%
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {stats.wonBets} wins / {stats.totalBets} bets
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <p className="text-sm text-gray-500 mb-2">ROI</p>
          <p className={`text-4xl font-bold ${stats.roi >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {stats.roi >= 0 ? '+' : ''}{stats.roi.toFixed(2)}%
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Return on Investment
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <p className="text-sm text-gray-500 mb-2">Total Profit</p>
          <p className={`text-4xl font-bold ${stats.totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            ${stats.totalProfit >= 0 ? '+' : ''}{stats.totalProfit.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            ${stats.totalWagered.toFixed(2)} wagered
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <p className="text-sm text-gray-500 mb-2">Current Streak</p>
          <p className="text-4xl font-bold">
            {stats.currentWinStreak > 0 ? (
              <span className="text-green-500">{stats.currentWinStreak}W 🔥</span>
            ) : stats.currentLossStreak > 0 ? (
              <span className="text-red-500">{stats.currentLossStreak}L</span>
            ) : (
              <span className="text-gray-500">-</span>
            )}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Longest: {stats.longestWinStreak}W
          </p>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-bold mb-6">Detailed Statistics</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-bold mb-3 text-lg">Bet Results</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Won:</span>
                <span className="font-semibold text-green-500">{stats.wonBets}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Lost:</span>
                <span className="font-semibold text-red-500">{stats.lostBets}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Push:</span>
                <span className="font-semibold text-gray-500">{stats.pushBets}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Pending:</span>
                <span className="font-semibold text-blue-500">{stats.pendingBets}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Total:</span>
                <span className="font-bold">{stats.totalBets}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-3 text-lg">Streaks</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Current Win:</span>
                <span className="font-semibold">{stats.currentWinStreak}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Current Loss:</span>
                <span className="font-semibold">{stats.currentLossStreak}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Longest Win:</span>
                <span className="font-semibold text-green-500">{stats.longestWinStreak} 🔥</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Longest Loss:</span>
                <span className="font-semibold text-red-500">{stats.longestLossStreak}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-3 text-lg">Financial</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Wagered:</span>
                <span className="font-semibold">${stats.totalWagered.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Profit:</span>
                <span className={`font-semibold ${stats.totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ${stats.totalProfit >= 0 ? '+' : ''}{stats.totalProfit.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">ROI:</span>
                <span className={`font-semibold ${stats.roi >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {stats.roi >= 0 ? '+' : ''}{stats.roi.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          Last updated: {new Date(stats.updatedAt).toLocaleString()}
        </p>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg">
        <h3 className="font-bold mb-2">📊 Transparency Guaranteed</h3>
        <p className="text-gray-700 dark:text-gray-300">
          All stats are calculated automatically and updated after each bet result. 
          Bets are immutable and cannot be edited or deleted, ensuring complete transparency.
        </p>
      </div>
    </main>
  )
}
