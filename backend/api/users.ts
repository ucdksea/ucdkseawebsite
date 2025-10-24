import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      const users = await prisma.user.findMany({ orderBy: { id: 'asc' } });
      return res.status(200).json(users);
    }
    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: e.message || 'Internal Server Error' });
  }
}
