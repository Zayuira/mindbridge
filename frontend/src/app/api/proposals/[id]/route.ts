export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { Prisma } from '@prisma/client' // ✅ #1 нэмэгдсэн
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { invalidateCache } from '@/lib/redis'

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return 'Internal server error'
}

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

    const proposal = await prisma.proposal.findUnique({
      where: { id },
      include: {
        freelancer: {
          select: {
            id: true,
            user: { select: { id: true, full_name: true, email: true } },
          },
        },
        job: {
          select: {
            title: true,
            budget_max: true,
            client_id: true,
            id: true,
            client: { select: { user_id: true } },
          },
        },
      },
    })

    if (!proposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 })
    }

    const role = session.user.role
    const userId = session.user.id

    if (role === 'ADMIN') {
      return NextResponse.json({ proposal }, { status: 200 })
    }

    if (role === 'CLIENT' && proposal.job.client.user_id !== userId) {
      return NextResponse.json(
        {
          error: "Forbidden: You cannot view proposals for a job you don't own",
        },
        { status: 403 },
      )
    }

    if (role === 'FREELANCER' && proposal.freelancer.user?.id !== userId) {
      return NextResponse.json(
        { error: "Forbidden: You cannot view someone else's proposal" },
        { status: 403 },
      )
    }

    return NextResponse.json({ proposal }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 })
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id // ✅ #2 засварласан
    const role = session.user.role // ✅ #2 засварласан

    if (role !== 'CLIENT' && role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Only clients can accept or reject proposals' },
        { status: 403 },
      )
    }

    let body: { status?: string }
    try {
      body = await req.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 },
      )
    }

    const { status } = body

    if (!status || !['ACCEPTED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status, must be ACCEPTED or REJECTED' },
        { status: 400 },
      )
    }

    const proposal = await prisma.proposal.findUnique({
      where: { id },
      include: { job: { include: { client: true } } },
    })

    if (!proposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 })
    }

    if (proposal.job.client.user_id !== userId && role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (proposal.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Proposal is already processed' },
        { status: 400 },
      )
    }

    const result = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        // ✅ #1 одоо ажиллана
        const updatedProposal = await tx.proposal.update({
          where: { id },
          data: { status: status as 'ACCEPTED' | 'REJECTED' },
        })

        if (status === 'ACCEPTED') {
          const contract = await tx.contract.create({
            data: {
              job_id: proposal.job_id,
              client_id: proposal.job.client_id,
              freelancer_id: proposal.freelancer_id,
              agreed_amount: proposal.bid_amount,
              status: 'ACTIVE',
              start_date: new Date(),
            },
          })

          await tx.job.update({
            where: { id: proposal.job_id },
            data: { status: 'IN_PROGRESS' },
          })

          await tx.proposal.updateMany({
            where: { job_id: proposal.job_id, id: { not: id } },
            data: { status: 'REJECTED' },
          })

          return { proposal: updatedProposal, contract }
        }

        return { proposal: updatedProposal }
      },
    )

    // ✅ Proposal зөвшөөрөгдсөн → холбогдох cache цэвэрлэнэ
    await invalidateCache(`jobs:detail:${proposal.job_id}`)
    await invalidateCache('jobs:list:*')
    await invalidateCache('admin:dashboard:stats')

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 })
  }
}
