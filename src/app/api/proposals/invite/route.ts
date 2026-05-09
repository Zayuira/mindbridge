export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || session.user.role !== 'CLIENT') {
      return NextResponse.json(
        { error: 'Unauthorized. Only clients can invite freelancers.' },
        { status: 401 },
      )
    }

    const userId = session.user.id

    // Get the client profile of this user
    const clientProfile = await prisma.clientProfile.findUnique({
      where: { user_id: userId },
    })

    if (!clientProfile) {
      return NextResponse.json(
        { error: 'Client profile not found.' },
        { status: 404 },
      )
    }

    const { freelancerId, jobId, coverLetter, price } = await req.json()

    if (!freelancerId || !jobId) {
      return NextResponse.json(
        { error: 'freelancerId and jobId are required.' },
        { status: 400 },
      )
    }

    // Check if job belongs to this client
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    })

    if (!job || job.client_id !== clientProfile.id) {
      return NextResponse.json(
        { error: 'Job not found or does not belong to you.' },
        { status: 404 },
      )
    }

    // Check if already invited or applied
    const existing = await prisma.proposal.findFirst({
      where: {
        job_id: jobId,
        freelancer_id: freelancerId,
      },
    })

    if (existing) {
      return NextResponse.json(
        {
          error:
            'You have already invited this freelancer to this job, or they have already applied.',
        },
        { status: 400 },
      )
    }

    // Create the invitation proposal.
    // Status INVITED doesn't exist on ProposalStatus so we use PENDING instead but message them.
    const proposal = await prisma.proposal.create({
      data: {
        job_id: jobId,
        freelancer_id: freelancerId,
        cover_letter:
          coverLetter ||
          'Би танд энэ ажилд орох санал илгээж байна. Хэрэв сонирхож байвал хариу өгнө үү.',
        bid_amount: price || 0,
        status: 'PENDING',
        ai_relevance_score: 100.0, // 100 since client explicitly invited
      },
    })

    // Optionally create a message here to let them know
    // Since freelancerId is the profile ID, we need their user_id to send a message.
    const freelancerProfile = await prisma.freelancerProfile.findUnique({
      where: { id: freelancerId },
    })

    if (freelancerProfile) {
      await prisma.message.create({
        data: {
          sender_id: userId,
          receiver_id: freelancerProfile.user_id,
          job_id: jobId,
          content: `Сайн байна уу? Би танд өөрийн "${job.title}" нэртэй ажилд хамтран ажиллах санал илгээж байна.`,
        },
      })
    }

    return NextResponse.json({ proposal }, { status: 201 })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
