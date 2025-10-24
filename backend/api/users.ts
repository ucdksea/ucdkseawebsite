// backend/api/users.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'asc' },
      select: { id: true, name: true, email: true, isApproved: true, createdAt: true, updatedAt: true }, // ← passwordHash 제외
    });
    res.status(200).json(users);
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e.message || 'Internal Server Error' });
  }
}
