'use client'

import { useState, useEffect } from 'react'

interface Creator {
  id: string
  username: string
  name?: string
  bio?: string
  subscriptionPrice?: number
  statistics?: {
    totalBets: number
    wonBets: number
    winPercentage: number
    roi: number
    totalProfit: number
    currentWinStreak: number
  }
}

export default function CreatorsPage() {
  const [creators, setCreators] = useState<Creator[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data for demonstration
    // In production, this would fetch from an API
    setCreators([
      {
        id: '1',
        username: 'pro_bettor_1',
        name: 'John Smith',
        bio: 'Professional sports analyst with 10+ years experience',
        subscriptionPrice: 29.99,
        statistics: {
          totalBets: 150,
          wonBets: 95,
          winPercentage: 63.33,
          roi: 12.5,
          totalProfit: 5420,
          currentWinStreak: 7,
        },
      },
      {
        id: '2',
        username: 'sports_guru',
        name: 'Sarah Johnson',
        bio: 'NFL and NBA specialist',
        subscriptionPrice: 19.99,
        statistics: {
          totalBets: 200,
          wonBets: 118,
          winPercentage: 59.0,
          roi: 8.2,
          totalProfit: 3280,
          currentWinStreak: 3,
        },
      },
    ])
    setLoading(false)
  }, [])

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Top Creators</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Subscribe to get access to picks before kickoff. View stats for free!
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 dark:text-gray-300">Loading creators...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {creators.map((creator) => (
            <div
              key={creator.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-1">
                    {creator.name || creator.username} ⭐
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    @{creator.username}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-500">
                    ${creator.subscriptionPrice}/mo
                  </p>
                </div>
              </div>

              {creator.bio && (
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {creator.bio}
                </p>
              )}

              {creator.statistics && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
                  <h3 className="font-bold mb-3">Public Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Win Rate</p>
                      <p className="text-xl font-bold text-green-500">
                        {creator.statistics.winPercentage}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">ROI</p>
                      <p className="text-xl font-bold text-blue-500">
                        {creator.statistics.roi}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Profit</p>
                      <p className="text-xl font-bold">
                        ${creator.statistics.totalProfit}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Win Streak</p>
                      <p className="text-xl font-bold">
                        {creator.statistics.currentWinStreak} 🔥
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      {creator.statistics.wonBets} wins out of{' '}
                      {creator.statistics.totalBets} total bets
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-semibold">
                  Subscribe
                </button>
                <button className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 px-4 py-2 rounded font-semibold">
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 bg-blue-50 dark:bg-blue-900 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Become a Creator</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Set your own subscription price and earn from your betting expertise.
          The platform takes {process.env.NEXT_PUBLIC_PLATFORM_FEE_PERCENTAGE || '10'}% via Stripe.
        </p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded font-semibold">
          Apply to be a Creator
        </button>
      </div>
    </main>
  )
}
