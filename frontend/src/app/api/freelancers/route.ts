import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getOrSetCache } from '@/lib/redis'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') ?? ''
    const skill = searchParams.get('skill') ?? ''
    
    const page = Math.max(1, Number(searchParams.get('page')) || 1)
    const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit')) || 10))
    const skip = (page - 1) * limit

    // ✅ Redis cache key
    const cacheKey = `freelancers:list:${search}:${skill}:${page}:${limit}`

    const data = await getOrSetCache(cacheKey, 90, async () => {
      const whereClause: any = {}

      if (search) {
        whereClause.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { user: { full_name: { contains: search, mode: 'insensitive' } } },
        ]
      }

      if (skill) {
        whereClause.skills = {
          some: { skill: { name: { equals: skill, mode: 'insensitive' } } },
        }
      }

      const [freelancers, total] = await Promise.all([
        prisma.freelancerProfile.findMany({
          where: whereClause,
          include: {
            user: {
              select: {
                full_name: true,
                email: true,
              },
            },
            skills: {
              include: {
                skill: true,
              },
            },
          },
          skip,
          take: limit,
        }),
        prisma.freelancerProfile.count({ where: whereClause }),
      ])

      return {
        freelancers,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      }
    })

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}
