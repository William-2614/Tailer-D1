import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
})

export const PLATFORM_FEE_PERCENTAGE = parseFloat(
  process.env.PLATFORM_FEE_PERCENTAGE || '10'
)

export async function createStripeCustomer(email: string, name?: string) {
  return await stripe.customers.create({
    email,
    name: name || undefined,
  })
}

export async function createSubscriptionPrice(
  creatorId: string,
  price: number
) {
  const product = await stripe.products.create({
    name: `Subscription to Creator ${creatorId}`,
    description: 'Access to premium betting picks before kickoff',
  })

  return await stripe.prices.create({
    product: product.id,
    currency: 'usd',
    unit_amount: Math.round(price * 100), // Convert to cents
    recurring: {
      interval: 'month',
    },
  })
}

export async function calculatePlatformFee(amount: number): Promise<number> {
  return (amount * PLATFORM_FEE_PERCENTAGE) / 100
}
