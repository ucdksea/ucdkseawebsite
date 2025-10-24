// api/admin/users.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const userSelect = {
  id: true,
  email: true,
  name: true,
  isApproved: true,
  createdAt: true,
  updatedAt: true,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const token = req.headers["x-admin-token"];
    const ADMIN_ACTION_SECRET = process.env.ADMIN_ACTION_SECRET;

    if (!ADMIN_ACTION_SECRET || token !== ADMIN_ACTION_SECRET) {
      return res.status(403).json({ error: "Forbidden" });
    }

    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const take = Math.min(Number(req.query.take ?? 50), 200);
    const cursor = typeof req.query.cursor === "string" ? req.query.cursor : undefined;

    const users = await prisma.user.findMany({
      select: userSelect,
      take,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: { createdAt: "desc" },
    });

    const nextCursor = users.length === take ? users[users.length - 1].id : null;
    return res.status(200).json({ users, nextCursor });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}