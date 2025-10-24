// 관리자 전용: x-admin-token 필요
const { PrismaClient } = require("@prisma/client");

// Lambda 재사용 최적화
const prisma = global.__prisma || new PrismaClient();
if (!global.__prisma) global.__prisma = prisma;

const USER_SELECT = {
  id: true,
  email: true,
  name: true,
  isApproved: true,
  createdAt: true,
  updatedAt: true,
};

module.exports = async (req, res) => {
  try {
    const token = req.headers["x-admin-token"];
    const secret = process.env.ADMIN_ACTION_SECRET;

    if (!secret || token !== secret) {
      return res.status(403).json({ error: "Forbidden" });
    }
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const take = Math.min(Number(req.query.take ?? 50), 200);
    const cursor = typeof req.query.cursor === "string" ? req.query.cursor : undefined;

    const users = await prisma.user.findMany({
      select: USER_SELECT,
      take,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: { createdAt: "desc" },
    });

    const nextCursor = users.length === take ? users[users.length - 1].id : null;
    return res.status(200).json({ users, nextCursor });
  } catch (e) {
    console.error("ADMIN_USERS_ERROR", e);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
