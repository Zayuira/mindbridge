export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { getOrSetCache, invalidateCache } from '@/lib/redis'

type SessionUser = { id: string; role: string }

// ✅ GET ONE JOB — Redis cache 120 секунд
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const cacheKey = `jobs:detail:${id}`

    const job = await getOrSetCache(cacheKey, 120, async () => {
      return prisma.job.findUnique({
        where: { id },
        include: {
          client: {
            select: {
              id: true,
              user_id: true,
              company_name: true,
              location: true,
              industry: true,
              total_jobs_posted: true,
              user: { select: { full_name: true } },
            },
          },
          skills: true,
        },
      })
    })

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    return NextResponse.json({ job }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 },
    )
  }
}

// ✅ UPDATE — Owner шалгалт + cache invalidate
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: userId, role } = session.user as SessionUser

    // ✅ #6.2 Owner шалгалт: ADMIN бол bypass, CLIENT бол эзэмшигч эсэхийг шалгана
    if (role !== 'ADMIN') {
      const clientProfile = await prisma.clientProfile.findUnique({
        where: { user_id: userId },
      })
      if (!clientProfile) {
        return NextResponse.json({ error: 'Client profile not found' }, { status: 404 })
      }

      const job = await prisma.job.findUnique({ where: { id } })
      if (!job) {
        return NextResponse.json({ error: 'Job not found' }, { status: 404 })
      }
      if (job.client_id !== clientProfile.id) {
        return NextResponse.json(
          { error: 'Forbidden: You do not own this job' },
          { status: 403 },
        )
      }
    }

    const { title, description, budget_min, budget_max, status, deadline } = await req.json()

    const updateData: Record<string, unknown> = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (budget_min !== undefined) updateData.budget_min = Number(budget_min)
    if (budget_max !== undefined) updateData.budget_max = Number(budget_max)
    if (status !== undefined) updateData.status = status
    if (deadline !== undefined) updateData.deadline = new Date(deadline)

    const job = await prisma.job.update({
      where: { id },
      data: updateData,
    })

    // ✅ Ажил шинэчлэгдсэн → тухайн job + жагсаалтын cache цэвэрлэнэ
    await invalidateCache(`jobs:detail:${id}`)
    await invalidateCache('jobs:list:*')

    return NextResponse.json({ job }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 },
    )
  }
}

// ✅ DELETE — Owner шалгалт + cache invalidate
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: userId, role } = session.user as SessionUser

    // ✅ #6.2 Owner шалгалт: ADMIN бол bypass, CLIENT бол эзэмшигч эсэхийг шалгана
    if (role !== 'ADMIN') {
      if (role !== 'CLIENT') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }

      const clientProfile = await prisma.clientProfile.findUnique({
        where: { user_id: userId },
      })
      if (!clientProfile) {
        return NextResponse.json({ error: 'Client profile not found' }, { status: 404 })
      }

      const job = await prisma.job.findUnique({ where: { id } })
      if (!job) {
        return NextResponse.json({ error: 'Job not found' }, { status: 404 })
      }
      if (job.client_id !== clientProfile.id) {
        return NextResponse.json(
          { error: 'Forbidden: You do not own this job' },
          { status: 403 },
        )
      }
    }

    await prisma.job.delete({ where: { id } })

    // ✅ Ажил устгасан → cache цэвэрлэнэ
    await invalidateCache(`jobs:detail:${id}`)
    await invalidateCache('jobs:list:*')

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 },
    )
  }
}
