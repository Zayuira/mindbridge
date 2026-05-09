export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { getOrSetCache, invalidateCache } from '@/lib/redis'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)

    const search = searchParams.get('search') ?? ''
    const skill = searchParams.get('skill') ?? ''

    // ✅ NaN-аас хамгаалсан
    const page = Math.max(1, Number(searchParams.get('page')) || 1)
    const limit = Math.min(
      100,
      Math.max(1, Number(searchParams.get('limit')) || 10),
    )
    const skip = (page - 1) * limit

    // ✅ Redis cache key — query параметрүүдээс үүсгэнэ
    const cacheKey = `jobs:list:${search}:${skill}:${page}:${limit}`

    const data = await getOrSetCache(cacheKey, 60, async () => {
      const whereClause: Prisma.JobWhereInput = { status: 'OPEN' }

      if (search) {
        whereClause.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ]
      }

      if (skill) {
        whereClause.skills = {
          some: { name: { equals: skill, mode: 'insensitive' } },
        }
      }

      const [jobs, totalJobs] = await Promise.all([
        prisma.job.findMany({
          where: whereClause,
          include: {
            client: {
              select: {
                user_id: true,
                company_name: true,
                user: { select: { full_name: true } },
              },
            },
            skills: true,
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.job.count({ where: whereClause }),
      ])

      return {
        jobs,
        pagination: {
          total: totalJobs,
          page,
          limit,
          totalPages: Math.ceil(totalJobs / limit),
        },
      }
    })

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 },
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const role = session.user.role as 'ADMIN' | 'CLIENT' | 'FREELANCER'
    const userId = session.user.id

    if (role !== 'CLIENT') {
      return NextResponse.json(
        { error: 'Only clients can post jobs' },
        { status: 403 },
      )
    }

    const clientProfile = await prisma.clientProfile.findUnique({
      where: { user_id: userId },
    })

    if (!clientProfile) {
      return NextResponse.json(
        { error: 'Client profile not found' },
        { status: 404 },
      )
    }

    const body = await req.json()
    const { title, description, deadline: deadlineStr, budgetMin, budgetMax, skills } = body

    if (!title || !description || !deadlineStr) {
      return NextResponse.json(
        { error: 'title, description, deadline заавал шаардлагатай' },
        { status: 400 },
      )
    }

    const deadline = new Date(deadlineStr)
    if (isNaN(deadline.getTime())) {
      return NextResponse.json(
        { error: 'deadline формат буруу байна' },
        { status: 400 },
      )
    }

    const newJob = await prisma.job.create({
      data: {
        client_id: clientProfile.id,
        title: title,
        description: description,
        budget_min: Number(budgetMin) || 0,
        budget_max: Number(budgetMax) || 0,
        status: 'OPEN',
        deadline,
        // ✅ Skills холбох (ID-гаар)
        skills: skills && Array.isArray(skills) ? {
          connect: skills.map((id: string) => ({ id }))
        } : undefined,
      },
      include: { skills: true }
    })

    // ✅ Шинэ ажил нэмэгдсэн → jobs cache цэвэрлэнэ
    await invalidateCache('jobs:*')

    return NextResponse.json({ job: newJob }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 },
    )
  }
}
