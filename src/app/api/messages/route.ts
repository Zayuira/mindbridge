export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ✅ any cast арилгасан — next-auth.d.ts ашиглана
    const userId = session.user.id
    const { searchParams } = new URL(req.url)
    const partnerId = searchParams.get('partnerId')
    const jobId = searchParams.get('jobId')

    if (partnerId && jobId) {
      const messages = await prisma.message.findMany({
        where: {
          job_id: jobId,
          OR: [
            { sender_id: userId, receiver_id: partnerId },
            { sender_id: partnerId, receiver_id: userId },
          ],
        },
        orderBy: { createdAt: 'asc' },
        include: {
          sender: { select: { full_name: true, id: true } },
          receiver: { select: { full_name: true, id: true } },
        },
      })

      // ✅ Уншаагүй мессежийг уншигдсан болгоно
      await prisma.message.updateMany({
        where: {
          job_id: jobId,
          sender_id: partnerId,
          receiver_id: userId,
          is_read: false,
        },
        data: { is_read: true },
      })

      return NextResponse.json({ messages }, { status: 200 })
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [{ sender_id: userId }, { receiver_id: userId }],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: { select: { full_name: true, id: true, role: true } },
        receiver: { select: { full_name: true, id: true, role: true } },
        job: { select: { title: true } },
      },
    })

    // ✅ any арилгаж Prisma-ийн төрлийг ашигласан
    const seen = new Set<string>()
    const conversations = messages.filter((m) => {
      const otherId = m.sender_id === userId ? m.receiver_id : m.sender_id
      const key = `${otherId}_${m.job_id}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })

    return NextResponse.json({ conversations }, { status: 200 })
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

    const senderId = session.user.id
    const { receiverId, jobId, content } = await req.json()

    if (!receiverId || !jobId || !content?.trim()) {
      return NextResponse.json(
        { error: 'receiverId, jobId, content заавал шаардлагатай' },
        { status: 400 },
      )
    }

    // ✅ Receiver хэрэглэгч байгаа эсэхийг шалгана
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
    })

    if (!receiver) {
      return NextResponse.json(
        { error: 'Хүлээн авагч хэрэглэгч олдсонгүй' },
        { status: 404 },
      )
    }

    // ✅ Өөртөө мессеж илгээхийг хаана
    if (senderId === receiverId) {
      return NextResponse.json(
        { error: 'Өөртөө мессеж илгээх боломжгүй' },
        { status: 400 },
      )
    }

    const message = await prisma.message.create({
      data: {
        sender_id: senderId,
        receiver_id: receiverId,
        job_id: jobId,
        content: content.trim(),
      },
    })

    return NextResponse.json({ message }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 },
    )
  }
}
