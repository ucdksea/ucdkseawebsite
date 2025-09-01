// backend/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var _prisma: PrismaClient | undefined;
}

export const prisma: PrismaClient =
  globalThis._prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis._prisma = prisma;
}


