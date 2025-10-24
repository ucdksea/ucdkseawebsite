// app/api/admin/users/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const userSelect = {
  id: true,
  email: true,
  name: true,
  isApproved: true,
  createdAt: true,
  updatedAt: true,
};

export async function GET(req: Request) {
  const ADMIN_SECRET = process.env.ADMIN_ACTION_SECRET;
  const token = req.headers.get("x-admin-token");

  if (!ADMIN_SECRET || token !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // (옵션) 쿼리 파라미터로 검색/페이지네이션 지원
  const url = new URL(req.url);
  const take = Math.min(Number(url.searchParams.get("take") ?? 50), 200);
  const cursor = url.searchParams.get("cursor") || undefined;

  const users = await prisma.user.findMany({
    select: userSelect,
    take,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    orderBy: { createdAt: "desc" },
  });

  const nextCursor = users.length === take ? users[users.length - 1].id : null;
  return NextResponse.json({ users, nextCursor }, { status: 200 });
}

export const dynamic = "force-dynamic";
