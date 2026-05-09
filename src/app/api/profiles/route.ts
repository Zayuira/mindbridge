export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { getOrSetCache, invalidateCache } from '@/lib/redis'

// Session user-д id талбар нэмэх
interface SessionUser {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const userId =
      searchParams.get('userId') || (session.user as SessionUser).id

    // ✅ Redis cache — profile 180 секунд
    const cacheKey = `profile:${userId}`

    const profile = await getOrSetCache(cacheKey, 180, async () => {
      const targetUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      })

      if (!targetUser) return null

      let profileData
      if (targetUser.role === 'FREELANCER') {
        profileData = await prisma.freelancerProfile.findUnique({
          where: { user_id: userId },
          include: {
            user: { select: { full_name: true, email: true, role: true } },
            skills: { include: { skill: true } },
            proposals: { 
              include: { 
                job: { 
                  select: { 
                    id: true, 
                    title: true, 
                    status: true, 
                    budget_max: true,
                    client: { select: { user_id: true } }
                  } 
                } 
              },
              orderBy: { createdAt: 'desc' }
            },
            contracts: {
              include: {
                job: { select: { title: true } },
                client: { include: { user: { select: { full_name: true } } } }
              },
              orderBy: { createdAt: 'desc' }
            },
          },
        })

        if (profileData) {
          const reviews = await prisma.review.findMany({
            where: { contract: { freelancer_id: profileData.id } }
          });
          const avg = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
          (profileData as any).averageRating = avg;
          (profileData as any).reviewCount = reviews.length;
        }
      } else {
        profileData = await prisma.clientProfile.findUnique({
          where: { user_id: userId },
          include: {
            user: { select: { full_name: true, email: true, role: true } },
            jobs: { 
              include: {
                _count: {
                  select: { proposals: true }
                }
              },
              orderBy: { createdAt: 'desc' } as any
            },
            contracts: {
              include: {
                job: { select: { title: true } },
                freelancer: { include: { user: { select: { full_name: true } } } }
              },
              orderBy: { createdAt: 'desc' } as any
            }
          },
        })

        if (profileData) {
          const reviews = await prisma.review.findMany({
            where: { contract: { client_id: profileData.id } }
          });
          const avg = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
          (profileData as any).averageRating = avg;
          (profileData as any).reviewCount = reviews.length;
        }
      }

      return profileData
    })

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    return NextResponse.json({ profile }, { status: 200 })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as SessionUser).id
    const body = await req.json()

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    })

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    let updatedProfile

    if (targetUser.role === 'FREELANCER') {
      const { title, bio, hourlyRate, location, skills } = body

      const freelancerProfile = await prisma.freelancerProfile.findUnique({
        where: { user_id: userId },
        select: { id: true },
      })

      if (!freelancerProfile) {
        return NextResponse.json(
          { error: 'Freelancer profile not found' },
          { status: 404 },
        )
      }

      if (skills && Array.isArray(skills)) {
        await prisma.freelancerSkill.deleteMany({
          where: { freelancer_id: freelancerProfile.id },
        })
        for (const skillName of skills) {
          const trimmed = (skillName as string).trim().toLowerCase()
          if (!trimmed) continue
          let skill = await prisma.skill.findFirst({ where: { name: trimmed } })
          if (!skill) {
            skill = await prisma.skill.create({
              data: { name: trimmed, category: 'Other' },
            })
          }
          await prisma.freelancerSkill.create({
            data: {
              freelancer_id: freelancerProfile.id,
              skill_id: skill.id,
              proficiency_level: 'INTERMEDIATE',
            },
          })
        }
      }

      updatedProfile = await prisma.freelancerProfile.update({
        where: { user_id: userId },
        data: {
          ...(title !== undefined && { title }),
          ...(bio !== undefined && { bio }),
          ...(hourlyRate !== undefined && {
            hourly_rate: parseFloat(hourlyRate),
          }),
          ...(location !== undefined && { location }),
        },
        include: { skills: { include: { skill: true } } },
      })

      // ✅ Freelancer profile шинэчлэгдсэн → холбогдох cache цэвэрлэнэ
      await invalidateCache(`freelancers:detail:${freelancerProfile.id}`)
      await invalidateCache('freelancers:list:*')
    } else {
      const { companyName, industry, bio, location } = body

      updatedProfile = await prisma.clientProfile.update({
        where: { user_id: userId },
        data: {
          company_name: companyName,
          industry,
          bio,
          location,
        },
      })
    }

    // ✅ Profile cache цэвэрлэнэ
    await invalidateCache(`profile:${userId}`)

    return NextResponse.json({ profile: updatedProfile }, { status: 200 })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
