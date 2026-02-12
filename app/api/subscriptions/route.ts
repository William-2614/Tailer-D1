import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'
import { stripe, createSubscriptionPrice, PLATFORM_FEE_PERCENTAGE } from '@/lib/stripe/client'
import { SubscriptionStatus } from '@prisma/client'
import { z } from 'zod'

const createSubscriptionSchema = z.object({
  creatorId: z.string(),
  paymentMethodId: z.string(),
})

/**
 * POST /api/subscriptions
 * Create a new subscription to a creator
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createSubscriptionSchema.parse(body)
    
    // TODO: Get userId from session
    const userId = body.userId || 'demo-user-id'
    
    // Get creator
    const creator = await prisma.user.findUnique({
      where: { id: validatedData.creatorId },
    })
    
    if (!creator || !creator.isCreator || !creator.subscriptionPrice) {
      return NextResponse.json(
        { error: 'Creator not found or subscription not available' },
        { status: 404 }
      )
    }
    
    // Check if subscription already exists
    const existingSubscription = await prisma.subscription.findUnique({
      where: {
        userId_creatorId: {
          userId,
          creatorId: validatedData.creatorId,
        },
      },
    })
    
    if (existingSubscription && existingSubscription.status === SubscriptionStatus.ACTIVE) {
      return NextResponse.json(
        { error: 'Subscription already exists' },
        { status: 400 }
      )
    }
    
    // Get or create Stripe customer
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    let stripeCustomerId = existingSubscription?.stripeCustomerId
    
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
      })
      stripeCustomerId = customer.id
    }
    
    // Create or get Stripe price
    const price = await createSubscriptionPrice(
      validatedData.creatorId,
      parseFloat(creator.subscriptionPrice.toString())
    )
    
    // Create Stripe subscription
    const stripeSubscription = await stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [{ price: price.id }],
      default_payment_method: validatedData.paymentMethodId,
      application_fee_percent: PLATFORM_FEE_PERCENTAGE,
    })
    
    // Create subscription in database
    const subscription = await prisma.subscription.create({
      data: {
        userId,
        creatorId: validatedData.creatorId,
        stripeSubscriptionId: stripeSubscription.id,
        stripePriceId: price.id,
        stripeCustomerId,
        status: SubscriptionStatus.ACTIVE,
        price: creator.subscriptionPrice,
      },
    })
    
    return NextResponse.json(subscription, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Error creating subscription:', error)
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/subscriptions
 * Get user's subscriptions
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const creatorId = searchParams.get('creatorId')
    
    if (!userId && !creatorId) {
      return NextResponse.json(
        { error: 'userId or creatorId required' },
        { status: 400 }
      )
    }
    
    const subscriptions = await prisma.subscription.findMany({
      where: {
        ...(userId && { userId }),
        ...(creatorId && { creatorId }),
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
      },
    })
    
    return NextResponse.json(subscriptions)
  } catch (error) {
    console.error('Error fetching subscriptions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subscriptions' },
      { status: 500 }
    )
  }
}
