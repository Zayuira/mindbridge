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

    const { searchParams } = new URL(req.url)
    const jobId = searchParams.get('jobId')
    const freelancerId = searchParams.get('freelancerId')
    const status = searchParams.get('status') as
      | 'ACCEPTED'
      | 'REJECTED'
      | 'PENDING'
      | null

    const role = session.user.role as 'ADMIN' | 'CLIENT' | 'FREELANCER';
    const userId = session.user.id;

    const whereClause: Record<string, unknown> = {}

    if (jobId) whereClause.job_id = jobId
    if (freelancerId) whereClause.freelancer_id = freelancerId
    if (status) whereClause.status = status

    if (role === 'CLIENT') {
      const clientProfile = await prisma.clientProfile.findUnique({
        where: { user_id: userId },
      })
      if (clientProfile) {
        whereClause.job = {
          ...((whereClause.job as Record<string, unknown>) ?? {}),
          client_id: clientProfile.id,
        }
      }
    } else if (role === 'FREELANCER') {
      const freelancerProfile = await prisma.freelancerProfile.findUnique({
        where: { user_id: userId },
      })
      if (freelancerProfile) {
        whereClause.freelancer_id = freelancerProfile.id
      }
    }

    const proposals = await prisma.proposal.findMany({
      where: whereClause,
      include: {
        freelancer: {
          select: {
            id: true,
            title: true,
            user: { select: { id: true, full_name: true, email: true } },
          },
        },
        job: { select: { title: true, budget_max: true, client_id: true } },
      },
    })

    return NextResponse.json({ proposals }, { status: 200 })
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

    const role = (session.user as { role: string }).role
    const userId = (session.user as { id: string }).id

    if (role !== 'FREELANCER' && role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Only freelancers can submit proposals' },
        { status: 403 },
      )
    }

    const freelancerProfile = await prisma.freelancerProfile.findUnique({
      where: { user_id: userId },
    })

    if (!freelancerProfile) {
      return NextResponse.json(
        { error: 'Freelancer profile not found' },
        { status: 404 },
      )
    }

    const { jobId, coverLetter, bidAmount } = await req.json()

    if (!jobId || !coverLetter || bidAmount === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      )
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { skills: true },
    })
    if (!job || job.status !== 'OPEN') {
      return NextResponse.json(
        { error: 'Job is not available for proposals' },
        { status: 400 },
      )
    }

    const existing = await prisma.proposal.findFirst({
      where: { job_id: jobId, freelancer_id: freelancerProfile.id },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'You already submitted a proposal for this job' },
        { status: 409 },
      )
    }

    // ✅ #2.3 — Proposal AI Score: AI сервис дуудаж оноо тооцно
    let aiScore = 0.0
    try {
      const freelancerWithDetails = await prisma.freelancerProfile.findUnique({
        where: { id: freelancerProfile.id },
        include: {
          skills: { include: { skill: true } },
          contracts: {
            where: { status: 'COMPLETED' },
            include: { reviews: { select: { rating: true } } },
          },
        },
      })

      if (freelancerWithDetails) {
        const allReviews = freelancerWithDetails.contracts.flatMap((c) => c.reviews)
        const avgRating =
          allReviews.length > 0
            ? allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length
            : 3.0

        const payload = {
          job_title: job.title,
          job_description: job.description,
          job_budget_max: job.budget_max,
          required_skills: job.skills.map((s) => s.name),
          freelancers: [
            {
              id: freelancerWithDetails.id,
              title: freelancerWithDetails.title ?? '',
              bio: freelancerWithDetails.bio ?? '',
              hourly_rate: freelancerWithDetails.hourly_rate ?? 0,
              avg_rating: parseFloat(avgRating.toFixed(2)),
              completed_jobs: freelancerWithDetails.contracts.length,
              skills: freelancerWithDetails.skills.map((s) => s.skill.name),
            },
          ],
        }

        const aiServiceUrl = process.env.AI_SERVICE_URL
        if (aiServiceUrl) {
          const aiRes = await fetch(`${aiServiceUrl}/match`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(10000), // 10 секунд
          })

          if (aiRes.ok) {
            const { matches } = (await aiRes.json()) as {
              matches: { score: number }[]
            }
            if (matches && matches.length > 0) {
              aiScore = matches[0].score
            }
          }
        }
      }
    } catch (aiError) {
      console.error('[Proposal AI Score Error]:', aiError)
      // Алдаа гарсан ч proposal үүсгэхээ зогсоохгүй (0.0 оноотой)
    }

    const proposal = await prisma.proposal.create({
      data: {
        job_id: jobId,
        freelancer_id: freelancerProfile.id,
        cover_letter: coverLetter,
        bid_amount: parseFloat(bidAmount),
        status: 'PENDING',
        ai_relevance_score: aiScore,
      },
    })

    return NextResponse.json({ proposal }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 })
  }
}
