import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id
    const role = (session.user as any).role

    let contracts
    if (role === 'CLIENT') {
      const clientProfile = await prisma.clientProfile.findUnique({
        where: { user_id: userId },
      })
      if (!clientProfile) return NextResponse.json({ contracts: [] })

      contracts = await prisma.contract.findMany({
        where: { client_id: clientProfile.id },
        include: {
          job: { select: { title: true, description: true } },
          freelancer: { include: { user: { select: { full_name: true, email: true } } } },
        },
        orderBy: { createdAt: 'desc' },
      })
    } else {
      const freelancerProfile = await prisma.freelancerProfile.findUnique({
        where: { user_id: userId },
      })
      if (!freelancerProfile) return NextResponse.json({ contracts: [] })

      contracts = await prisma.contract.findMany({
        where: { freelancer_id: freelancerProfile.id },
        include: {
          job: { select: { title: true, description: true } },
          client: { include: { user: { select: { full_name: true, email: true } } } },
        },
        orderBy: { createdAt: 'desc' },
      })
    }

    return NextResponse.json({ contracts }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 },
    )
  }
}
