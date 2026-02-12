import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'
import { performAIVerification } from '@/lib/ai/verification'
import { BetStatus } from '@prisma/client'
import { z } from 'zod'

const createBetSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  amount: z.number().positive(),
  odds: z.number().positive(),
  sport: z.string().min(1),
  eventName: z.string().min(1),
  eventDate: z.string().datetime(),
  isPublic: z.boolean().default(true),
})

/**
 * POST /api/bets
 * Create a new bet (immutable after creation)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = createBetSchema.parse(body)
    
    // TODO: Get userId from session (placeholder for now)
    const userId = body.userId || 'demo-user-id'
    
    const eventDate = new Date(validatedData.eventDate)
    const now = new Date()
    
    // Verify bet is submitted before event starts
    if (eventDate <= now) {
      return NextResponse.json(
        { error: 'Cannot submit bet after event has started' },
        { status: 400 }
      )
    }
    
    // Perform AI verification
    const verificationResult = await performAIVerification({
      betId: 'temp',
      title: validatedData.title,
      eventDate,
      submittedAt: now,
      sport: validatedData.sport,
      eventName: validatedData.eventName,
    })
    
    if (!verificationResult.isValid) {
      return NextResponse.json(
        { 
          error: 'Bet verification failed', 
          issues: verificationResult.issues 
        },
        { status: 400 }
      )
    }
    
    // Create bet (immutable - no edit/delete allowed)
    const bet = await prisma.bet.create({
      data: {
        userId,
        title: validatedData.title,
        description: validatedData.description,
        amount: validatedData.amount,
        odds: validatedData.odds,
        sport: validatedData.sport,
        eventName: validatedData.eventName,
        eventDate,
        isPublic: validatedData.isPublic,
        isVerified: verificationResult.isValid,
        verifiedAt: verificationResult.isValid ? now : null,
        aiVerificationData: verificationResult,
        status: BetStatus.PENDING,
      },
    })
    
    return NextResponse.json(bet, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Error creating bet:', error)
    return NextResponse.json(
      { error: 'Failed to create bet' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/bets
 * List bets (with filtering)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const isPublic = searchParams.get('public') === 'true'
    const status = searchParams.get('status')
    
    const bets = await prisma.bet.findMany({
      where: {
        ...(userId && { userId }),
        ...(isPublic !== undefined && { isPublic }),
        ...(status && { status: status as BetStatus }),
      },
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
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    })
    
    return NextResponse.json(bets)
  } catch (error) {
    console.error('Error fetching bets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bets' },
      { status: 500 }
    )
  }
}
