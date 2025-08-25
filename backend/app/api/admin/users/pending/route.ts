export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function isAdmin(req: Request) {
  const t = req.headers.get("x-admin-token");
  return t && t === process.env.ADMIN_TOKEN;
}

export async function GET(req: Request) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    where: { isApproved: false },
    select: { id: true, email: true, username: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ users });
}
