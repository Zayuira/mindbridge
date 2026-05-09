import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Fetching users...')
    const users = await prisma.user.findMany({
      take: 1
    })
    console.log('Success! Found', users.length, 'users.')
    console.log('User fields:', Object.keys(users[0] || {}))
  } catch (error) {
    console.error('ERROR:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
