///Users/stephanie/Desktop/ucdksea-website/backend/app/api/upload/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { cookies } from "next/headers";
import { prisma } from "../../../lib/prisma";

const ALLOWED = (process.env.ALLOWED_ORIGINS ?? "http://127.0.0.1:5501,http://localhost:5501")
  .split(",").map(s => s.trim()).filter(Boolean);

function cors(origin: string | null) {
  const h: Record<string,string> = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
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

export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  const headers = cors(origin);

  // 간단 인증: 승인된 사용자만
  const uid = cookies().get("uid")?.value || null;
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers });
  const me = await prisma.user.findUnique({ where: { id: uid }, select: { isApproved: true } });
  if (!me?.isApproved) return NextResponse.json({ error: "Forbidden" }, { status: 403, headers });

  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400, headers });

  const bytes = Buffer.from(await file.arrayBuffer());
  const name = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const fname = `${Date.now()}_${name}`;

  const dir = path.join(process.cwd(), "public", "uploads", "posts");
  await mkdir(dir, { recursive: true });
  const full = path.join(dir, fname);
  await writeFile(full, bytes);

  // 백엔드 풀 URL (프런트가 다른 오리진에서 보기에 절대 URL 필요)
  const base = process.env.APP_BASE_URL ?? new URL(req.url).origin;
  const url = `${base}/uploads/posts/${fname}`;

  return NextResponse.json({ url }, { status: 201, headers });
}
