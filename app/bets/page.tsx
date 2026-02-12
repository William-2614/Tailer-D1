'use client'

import { useState, useEffect } from 'react'

interface Bet {
  id: string
  title: string
  description?: string
  amount: number
  odds: number
  sport: string
  eventName: string
  eventDate: string
  status: string
  result?: string
  isVerified: boolean
  createdAt: string
  user: {
    username: string
    name?: string
    isCreator: boolean
  }
}

export default function BetsPage() {
  const [bets, setBets] = useState<Bet[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchBets()
  }, [filter])

  const fetchBets = async () => {
    try {
      setLoading(true)
      const url = `/api/bets${filter !== 'all' ? `?status=${filter}` : ''}`
      const response = await fetch(url)
      const data = await response.json()
      setBets(data)
    } catch (error) {
      console.error('Error fetching bets:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getResultBadge = (result?: string) => {
    if (!result) return null
    
    const colors = {
      WON: 'bg-green-500 text-white',
      LOST: 'bg-red-500 text-white',
      PUSH: 'bg-gray-500 text-white',
    }
    
    return (
      <span className={`px-2 py-1 rounded text-sm font-semibold ${colors[result as keyof typeof colors]}`}>
        {result}
      </span>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Public Bets</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          All bets are verified by AI and immutable. No edits or deletes allowed.
        </p>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
          >
            All Bets
          </button>
          <button
            onClick={() => setFilter('PENDING')}
            className={`px-4 py-2 rounded ${filter === 'PENDING' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('COMPLETED')}
            className={`px-4 py-2 rounded ${filter === 'COMPLETED' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
          >
            Completed
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 dark:text-gray-300">Loading bets...</p>
        </div>
      ) : bets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 dark:text-gray-300">No bets found</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {bets.map((bet) => (
            <div
              key={bet.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{bet.title}</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    by{' '}
                    <span className="font-semibold">
                      @{bet.user.username}
                      {bet.user.isCreator && ' ⭐'}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  {bet.isVerified && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                      ✓ Verified
                    </span>
                  )}
                  <span className={`px-3 py-1 rounded text-sm ${getStatusColor(bet.status)}`}>
                    {bet.status}
                  </span>
                  {getResultBadge(bet.result)}
                </div>
              </div>

              {bet.description && (
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {bet.description}
                </p>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Sport</p>
                  <p className="font-semibold">{bet.sport}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Event</p>
                  <p className="font-semibold">{bet.eventName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="font-semibold">${bet.amount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Odds</p>
                  <p className="font-semibold">{bet.odds}</p>
                </div>
              </div>

              <div className="text-sm text-gray-500">
                <p>Event Date: {new Date(bet.eventDate).toLocaleString()}</p>
                <p>Submitted: {new Date(bet.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
