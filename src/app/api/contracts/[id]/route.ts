import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { invalidateCache } from '@/lib/redis'

export const dynamic = 'force-dynamic'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const contract = await prisma.contract.findUnique({
      where: { id },
      include: {
        job: true,
        client: { include: { user: { select: { full_name: true, email: true } } } },
        freelancer: { include: { user: { select: { full_name: true, email: true } } } },
      },
    })

    if (!contract) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 })
    }

    return NextResponse.json({ contract }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 },
    )
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { status } = body

    if (!status || !['ACTIVE', 'COMPLETED', 'CANCELLED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // ✅ Гэрээ болон Ажлын төлөвийг хамт шинэчлэнэ
    const updated = await prisma.$transaction(async (tx) => {
      const contract = await tx.contract.update({
        where: { id },
        data: { status: status as any },
        include: { job: true }
      })

      // Хэрэв гэрээ дууссан бол ажлыг хаана
      if (status === 'COMPLETED') {
        await tx.job.update({
          where: { id: contract.job_id },
          data: { status: 'CLOSED' }
        })
      }

      return contract
    })

    // ✅ Гэрээний төлөв өөрчлөгдсөн → холбогдох cache цэвэрлэнэ
    await invalidateCache(`jobs:detail:${updated.job_id}`)
    await invalidateCache('jobs:list:*')
    await invalidateCache('admin:dashboard:stats')
    await invalidateCache(`profile:*`)

    return NextResponse.json({ contract: updated }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 },
    )
  }
}
