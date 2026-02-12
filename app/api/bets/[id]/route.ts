import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'
import { BetResult, BetStatus } from '@prisma/client'
import { updateUserStatistics } from '@/lib/stats/calculator'
import { z } from 'zod'

const updateResultSchema = z.object({
  result: z.enum(['WON', 'LOST', 'PUSH']),
  payout: z.number().optional(),
})

/**
 * GET /api/bets/[id]
 * Get a specific bet (no delete allowed)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bet = await prisma.bet.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            isCreator: true,
          },
        },
      },
    })
    
    if (!bet) {
      return NextResponse.json(
        { error: 'Bet not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(bet)
  } catch (error) {
    console.error('Error fetching bet:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bet' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/bets/[id]
 * Update bet result ONLY (no editing of bet details - immutability enforced)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = updateResultSchema.parse(body)
    
    // Get existing bet
    const existingBet = await prisma.bet.findUnique({
      where: { id: params.id },
    })
    
    if (!existingBet) {
      return NextResponse.json(
        { error: 'Bet not found' },
        { status: 404 }
      )
    }
    
    // Only allow result updates, not bet details (immutability)
    if (existingBet.status === BetStatus.COMPLETED) {
      return NextResponse.json(
        { error: 'Cannot update result of completed bet' },
        { status: 400 }
      )
    }
    
    // Update bet result
    const bet = await prisma.bet.update({
      where: { id: params.id },
      data: {
        result: validatedData.result as BetResult,
        payout: validatedData.payout || 0,
        status: BetStatus.COMPLETED,
        resultDate: new Date(),
      },
    })
    
    // Update user statistics
    await updateUserStatistics(bet.userId)
    
    return NextResponse.json(bet)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Error updating bet:', error)
    return NextResponse.json(
      { error: 'Failed to update bet' },
      { status: 500 }
    )
  }
}

/**
 * DELETE method not implemented - bets are immutable
 */
export async function DELETE() {
  return NextResponse.json(
    { error: 'Bets cannot be deleted - immutability is enforced' },
    { status: 405 }
  )
}
