import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export async function POST(req: Request) {
  const { email, password } = await req.json()

  // 1️⃣ user олох
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // 2️⃣ password check
  const isValid = await bcrypt.compare(password, user.passwordHash)

  if (!isValid) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  // 3️⃣ token үүсгэх
  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' },
  )

  return NextResponse.json({
    message: 'Login success',
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  })
}
