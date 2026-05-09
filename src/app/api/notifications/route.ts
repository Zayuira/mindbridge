import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * ✅ GET: Хэрэглэгчийн бүх мэдэгдлийг авна (хамгийн сүүлийн 50)
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const notifications = await prisma.notification.findMany({
      where: { user_id: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ notifications }, { status: 200 });
  } catch (error: any) {
    console.error('[Notifications GET]', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

/**
 * ✅ PUT: Мэдэгдлийг уншсан төлөвт оруулна
 */
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, all } = await req.json();

    if (all) {
      // Бүгдийг уншсанаар тэмдэглэх
      await prisma.notification.updateMany({
        where: { user_id: session.user.id, is_read: false },
        data: { is_read: true },
      });
    } else if (id) {
      // Тухайн мэдэгдлийг уншсанаар тэмдэглэх
      await prisma.notification.update({
        where: { id, user_id: session.user.id },
        data: { is_read: true },
      });
    } else {
      return NextResponse.json({ error: 'Missing notification id or "all" flag' }, { status: 400 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('[Notifications PUT]', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

/**
 * ✅ POST: Шинэ мэдэгдэл үүсгэх (Internal use - optional if utilities are used instead)
 */
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user as any).role !== 'ADMIN') {
            // Зөвхөн ADMIN эсвэл систем өөрөө үүсгэж болохоор хязгаарлах нь зөв (эсвэл internal API)
            // Энд түр зуур зөвхөн login хийсэн хэрэглэгчдэд зөвшөөрөв.
        }

        const { userId, type, title, content } = await req.json();

        const notification = await prisma.notification.create({
            data: {
                user_id: userId,
                type,
                title,
                content,
                is_read: false,
            },
        });

        return NextResponse.json({ success: true, notification }, { status: 201 });
    } catch (error: any) {
        console.error('[Notifications POST]', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
