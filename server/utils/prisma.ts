import { PrismaClient } from '@prisma/client'

const prismaGlobal = global as unknown as { prisma?: PrismaClient }

export function createPrismaClient() {
  return new PrismaClient({
    log: ['query', 'error', 'warn'],
  })
}

export const prisma = prismaGlobal.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  prismaGlobal.prisma = prisma
}

export default prisma 