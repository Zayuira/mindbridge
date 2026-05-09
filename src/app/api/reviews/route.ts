export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Internal server error'
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as { id: string }).id
    const role = (session.user as { role: 'ADMIN' | 'CLIENT' | 'FREELANCER' })
      .role

    // contractWhereClause type тодорхойлно
    const contractWhereClause: Record<string, unknown> = {}
    if (role === 'CLIENT') {
      const clientProfile = await prisma.clientProfile.findUnique({
        where: { user_id: userId },
      })
      if (clientProfile) contractWhereClause.client_id = clientProfile.id
    } else if (role === 'FREELANCER') {
      const freelancerProfile = await prisma.freelancerProfile.findUnique({
        where: { user_id: userId },
      })
      if (freelancerProfile)
        contractWhereClause.freelancer_id = freelancerProfile.id
    }

    const reviews = await prisma.review.findMany({
      where: {
        reviewer_id: { not: userId },
        contract: contractWhereClause,
      },
      include: {
        reviewer: { select: { full_name: true } },
        contract: { include: { job: { select: { title: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    })

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length
        : 0

    return NextResponse.json(
      { reviews, averageRating: averageRating.toFixed(1) },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const reviewerId = (session.user as { id: string }).id
    const { contractId, rating, comment } = (await req.json()) as {
      contractId: string
      rating: number | string
      comment?: string
    }

    if (!contractId || !rating) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      )
    }

    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: { job: true },
    })

    if (!contract) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 })
    }

    if (contract.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Cannot review an incomplete contract' },
        { status: 400 },
      )
    }

    // Ensure the reviewer is part of the contract
    let isParticipant = false
    const clientProfile = await prisma.clientProfile.findUnique({
      where: { user_id: reviewerId },
    })
    const freelancerProfile = await prisma.freelancerProfile.findUnique({
      where: { user_id: reviewerId },
    })

    if (clientProfile && contract.client_id === clientProfile.id)
      isParticipant = true
    if (freelancerProfile && contract.freelancer_id === freelancerProfile.id)
      isParticipant = true

    if (!isParticipant) {
      return NextResponse.json(
        { error: 'You are not a participant in this contract' },
        { status: 403 },
      )
    }

    const review = await prisma.review.create({
      data: {
        reviewer_id: reviewerId,
        contract_id: contractId,
        rating: typeof rating === 'string' ? parseInt(rating, 10) : rating,
        comment: comment || '',
      },
    })

    return NextResponse.json({ review }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 })
  }
}
