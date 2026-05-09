import prisma from './prisma';

/**
 * Мэдэгдэл илгээх (DB-д хадгалах)
 */
export async function sendNotification({
  userId,
  type,
  title,
  content,
}: {
  userId: string;
  type: string;
  title: string;
  content: string;
}) {
  try {
    return await prisma.notification.create({
      data: {
        user_id: userId,
        type,
        title,
        content,
        is_read: false,
      },
    });
  } catch (error) {
    console.error('[sendNotification Error]:', error);
    return null;
  }
}
