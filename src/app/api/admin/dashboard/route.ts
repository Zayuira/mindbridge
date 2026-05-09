import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { getOrSetCache } from '@/lib/redis'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    // if (!session || (session.user as any).role !== 'ADMIN') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    // ✅ Redis cache — Admin dashboard stats 30 секунд
    const cacheKey = 'admin:dashboard:stats'

    const data = await getOrSetCache(cacheKey, 30, async () => {
      const [userCount, clientCount, jobCount, freelancerCount, unverifiedCount] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { role: 'CLIENT' } }),
        prisma.job.count({ where: { status: 'OPEN' } }),
        prisma.user.count({ where: { role: 'FREELANCER' } }),
        prisma.user.count({ where: { is_verified: false } }),
      ])

      const payments = await prisma.payment.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          contract: {
            include: {
              client: {
                include: { user: { select: { full_name: true } } }
              }
            }
          }
        }
      })

      const totalRevenue = await prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: 'PAID' }
      })

      const stats = [
        { title: "Нийт Харилцагч", value: userCount.toLocaleString(), shift: "+0%", type: 'users' },
        { title: "Нийт Орлого", value: `₮${(totalRevenue._sum.amount || 0).toLocaleString()}`, shift: "+0%", type: 'revenue' },
        { title: "Идэвхтэй Ажил", value: jobCount.toLocaleString(), shift: "+0%", type: 'jobs' },
        { title: "Фрилансерүүд", value: freelancerCount.toLocaleString(), shift: "+0%", type: 'freelancers' },
      ]

      const internalStats = {
        unverifiedCount,
        recentPayments: payments.map(p => ({
          id: p.id,
          amount: p.amount,
          clientName: p.contract.client.user.full_name,
          date: p.createdAt,
          status: p.status
        }))
      }

      return { stats, internalStats }
    })

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
