import prisma from './prisma';
import { VerificationType } from '@prisma/client';

/**
 * 6 оронтой OTP код үүсгэнэ.
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Кодыг DB-д хадгалж, хуучин кодыг идэвхгүй болгоно.
 */
export async function createVerificationCode(userId: string, type: VerificationType) {
  const code = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 минут хүчинтэй

  // Өмнөх ашиглагдаагүй кодуудыг used болгож идэвхгүй болгоно
  await prisma.verificationCode.updateMany({
    where: { user_id: userId, type, used: false },
    data: { used: true },
  });

  return await prisma.verificationCode.create({
    data: {
      user_id: userId,
      code,
      type,
      expiresAt,
    },
  });
}
