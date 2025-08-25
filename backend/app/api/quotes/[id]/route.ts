// app/api/quotes/[id]/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthFromCookie } from "@/lib/auth";
import { quoteCreateSchema } from "@/lib/validations";

type Params = { params: { id: string } };

export async function GET(_: Request, { params }: Params) {
  const auth = await getAuthFromCookie(); // ✅ await
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const item = await prisma.quote.findFirst({
    where: { id: params.id, userId: auth.uid },
  });

  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ quote: item });
}

export async function PATCH(req: Request, { params }: Params) {
  const auth = await getAuthFromCookie(); // ✅ await
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 부분 업데이트 검증
  const body = await req.json();
  const parsed = quoteCreateSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  // 소유자 확인
  const exists = await prisma.quote.findFirst({
    where: { id: params.id, userId: auth.uid },
    select: { id: true },
  });
  if (!exists) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const item = await prisma.quote.update({
    where: { id: params.id },
    data: parsed.data,
  });

  return NextResponse.json({ ok: true, quote: item });
}

export async function DELETE(_: Request, { params }: Params) {
  const auth = await getAuthFromCookie(); // ✅ await
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 소유자 확인
  const exists = await prisma.quote.findFirst({
    where: { id: params.id, userId: auth.uid },
    select: { id: true },
  });
  if (!exists) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.quote.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
