import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst({ where: { email: 'bat@freelance.mn' } });
  if (!user) {
    console.log('USER NOT FOUND in DB');
    return;
  }
  console.log('email:', user.email);
  console.log('role:', user.role);
  console.log('passwordHash null?', user.passwordHash === null || user.passwordHash === undefined);
  console.log('passwordHash preview:', user.passwordHash?.substring(0, 20));
  const match = await bcrypt.compare('password123', user.passwordHash ?? '');
  console.log('Password match:', match);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
