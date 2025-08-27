export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "lib/prisma";

const ALLOWED = (process.env.ALLOWED_ORIGINS ?? "http://127.0.0.1:5501,http://localhost:5501")
  .split(",").map(s => s.trim()).filter(Boolean);

function cors(origin: string | null) {
  const h: Record<string,string> = {
    "Access-Control-Allow-Methods": "DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Vary": "Origin",
  };
  if (origin && ALLOWED.includes(origin)) {
    h["Access-Control-Allow-Origin"] = origin;
    h["Access-Control-Allow-Credentials"] = "true";
  }
  return h;
}

export async function OPTIONS(req: Request) {
  const origin = req.headers.get("origin");
  return new NextResponse(null, { status: 204, headers: cors(origin) });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const origin = req.headers.get("origin");
  const headers = cors(origin);

  const uid = cookies().get("uid")?.value || null;
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers });
  const me = await prisma.user.findUnique({ where: { id: uid }, select: { isApproved: true } });
  if (!me?.isApproved) return NextResponse.json({ error: "Forbidden" }, { status: 403, headers });

  await prisma.post.update({ where: { id: params.id }, data: { active: false } });
  return NextResponse.json({ ok: true }, { status: 200, headers });
}
