import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getOrSetCache } from '@/lib/redis'

export const dynamic = 'force-dynamic'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params

    // ✅ Redis cache — фрилансер дэлгэрэнгүй 120 секунд
    const cacheKey = `freelancers:detail:${id}`

    const freelancer = await getOrSetCache(cacheKey, 120, async () => {
      return prisma.freelancerProfile.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              full_name: true,
              email: true,
              createdAt: true,
              is_verified: true,
            },
          },
          skills: {
            include: {
              skill: true,
            },
          },
          contracts: true,
        },
      })
    })

    if (!freelancer) {
      return NextResponse.json({ error: 'Freelancer not found' }, { status: 404 })
    }

    return NextResponse.json({ freelancer }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 },
    )
  }
}
