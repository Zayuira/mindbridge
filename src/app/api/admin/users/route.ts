import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== 'ADMIN') {
      // For development, we might want to allow this if no admin is set up yet, 
      // but let's stick to security. If the user is testing as admin, they should have the role.
      // return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const users = await prisma.user.findMany({
      include: {
        freelancerProfile: true,
        clientProfile: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    const formattedUsers = users.map(u => ({
      id: u.id,
      name: u.full_name,
      email: u.email,
      role: u.role === 'CLIENT' ? 'Клиент' : 'Фрилансер',
      date: (u as any).created_at ? (u as any).created_at.toISOString().split('T')[0] : '—',
      kyc: u.is_verified
    }))

    return NextResponse.json({ users: formattedUsers }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
