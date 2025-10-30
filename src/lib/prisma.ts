// lib/prisma.ts
import { PrismaClient } from '@/generated/prisma';

/**
 * Prisma Client Singleton
 *
 * Prevents multiple instances of Prisma Client in development due to hot reloading.
 * In production, creates a single instance.
 *
 * Usage:
 * import prisma from '@/lib/prisma';
 * const users = await prisma.user.findMany();
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
