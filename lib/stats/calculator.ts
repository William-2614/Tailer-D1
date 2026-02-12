import { prisma } from '../prisma/client'
import { BetResult, BetStatus } from '@prisma/client'

/**
 * Calculate and update user statistics
 */
export async function updateUserStatistics(userId: string) {
  // Get all completed bets for the user
  const bets = await prisma.bet.findMany({
    where: {
      userId,
      status: BetStatus.COMPLETED,
    },
    orderBy: {
      resultDate: 'asc',
    },
  })

  let wonBets = 0
  let lostBets = 0
  let pushBets = 0
  let totalWagered = 0
  let totalProfit = 0

  // Calculate streaks
  let currentWinStreak = 0
  let currentLossStreak = 0
  let longestWinStreak = 0
  let longestLossStreak = 0
  let tempWinStreak = 0
  let tempLossStreak = 0

  bets.forEach((bet) => {
    const amount = parseFloat(bet.amount.toString())
    totalWagered += amount

    if (bet.result === BetResult.WON) {
      wonBets++
      const payout = bet.payout ? parseFloat(bet.payout.toString()) : 0
      totalProfit += payout - amount

      tempWinStreak++
      tempLossStreak = 0
      if (tempWinStreak > longestWinStreak) {
        longestWinStreak = tempWinStreak
      }
    } else if (bet.result === BetResult.LOST) {
      lostBets++
      totalProfit -= amount

      tempLossStreak++
      tempWinStreak = 0
      if (tempLossStreak > longestLossStreak) {
        longestLossStreak = tempLossStreak
      }
    } else if (bet.result === BetResult.PUSH) {
      pushBets++
      tempWinStreak = 0
      tempLossStreak = 0
    }
  })

  currentWinStreak = tempWinStreak
  currentLossStreak = tempLossStreak

  // Get pending bets count
  const pendingBets = await prisma.bet.count({
    where: {
      userId,
      status: {
        in: [BetStatus.PENDING, BetStatus.IN_PROGRESS],
      },
    },
  })

  const totalBets = wonBets + lostBets + pushBets
  const winPercentage = totalBets > 0 ? (wonBets / totalBets) * 100 : 0
  const roi = totalWagered > 0 ? (totalProfit / totalWagered) * 100 : 0

  // Update or create statistics
  await prisma.userStatistics.upsert({
    where: { userId },
    update: {
      totalBets,
      wonBets,
      lostBets,
      pushBets,
      pendingBets,
      totalWagered,
      totalProfit,
      roi,
      winPercentage,
      currentWinStreak,
      currentLossStreak,
      longestWinStreak,
      longestLossStreak,
    },
    create: {
      userId,
      totalBets,
      wonBets,
      lostBets,
      pushBets,
      pendingBets,
      totalWagered,
      totalProfit,
      roi,
      winPercentage,
      currentWinStreak,
      currentLossStreak,
      longestWinStreak,
      longestLossStreak,
    },
  })

  return {
    totalBets,
    wonBets,
    lostBets,
    pushBets,
    pendingBets,
    totalWagered,
    totalProfit,
    roi,
    winPercentage,
    currentWinStreak,
    currentLossStreak,
    longestWinStreak,
    longestLossStreak,
  }
}

/**
 * Get user statistics
 */
export async function getUserStatistics(userId: string) {
  let stats = await prisma.userStatistics.findUnique({
    where: { userId },
  })

  if (!stats) {
    // Create initial statistics if they don't exist
    await updateUserStatistics(userId)
    stats = await prisma.userStatistics.findUnique({
      where: { userId },
    })
  }

  return stats
}
