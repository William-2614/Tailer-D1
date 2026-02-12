import { NextRequest, NextResponse } from 'next/server'
import { getUserStatistics } from '@/lib/stats/calculator'

/**
 * GET /api/stats/[userId]
 * Get public statistics for any user (free to view)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const stats = await getUserStatistics(params.userId)
    
    if (!stats) {
      return NextResponse.json(
        { error: 'Statistics not found' },
        { status: 404 }
      )
    }
    
    // Format stats for public viewing (all stats are public)
    const publicStats = {
      totalBets: stats.totalBets,
      wonBets: stats.wonBets,
      lostBets: stats.lostBets,
      pushBets: stats.pushBets,
      pendingBets: stats.pendingBets,
      winPercentage: parseFloat(stats.winPercentage.toString()),
      roi: parseFloat(stats.roi.toString()),
      totalProfit: parseFloat(stats.totalProfit.toString()),
      totalWagered: parseFloat(stats.totalWagered.toString()),
      currentWinStreak: stats.currentWinStreak,
      currentLossStreak: stats.currentLossStreak,
      longestWinStreak: stats.longestWinStreak,
      longestLossStreak: stats.longestLossStreak,
      updatedAt: stats.updatedAt,
    }
    
    return NextResponse.json(publicStats)
  } catch (error) {
    console.error('Error fetching statistics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}
