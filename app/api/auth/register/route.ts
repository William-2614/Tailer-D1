import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma/client'

const registerSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  username: z
    .string()
    .trim()
    .min(3)
    .max(24)
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only include letters, numbers, and underscores'),
  email: z.string().trim().email(),
  password: z.string().min(8).max(100),
  isCreator: z.boolean().optional().default(false),
})

/**
 * POST /api/auth/register
 * Creates a user account with hashed password and starter statistics.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = registerSchema.parse(body)

    const normalizedEmail = validatedData.email.toLowerCase()
    const normalizedUsername = validatedData.username.toLowerCase()

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: normalizedEmail }, { username: normalizedUsername }],
      },
      select: { email: true, username: true },
    })

    if (existingUser?.email === normalizedEmail) {
      return NextResponse.json({ error: 'Email is already in use' }, { status: 409 })
    }

    if (existingUser?.username === normalizedUsername) {
      return NextResponse.json({ error: 'Username is already in use' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(validatedData.password, 12)

    const createdUser = await prisma.user.create({
      data: {
        name: validatedData.name,
        username: normalizedUsername,
        email: normalizedEmail,
        passwordHash,
        isCreator: validatedData.isCreator,
        statistics: {
          create: {},
        },
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
      },
    })

    return NextResponse.json({ user: createdUser }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error registering user:', error)
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
  }
}
