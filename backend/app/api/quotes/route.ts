// app/api/quotes/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthFromCookie } from "@/lib/auth";
import { quoteCreateSchema } from "@/lib/validations";

export async function GET() {
  const auth = await getAuthFromCookie(); // ✅ await
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const quotes = await prisma.quote.findMany({   // ✅ 모델 Quote → prisma.quote
    where: { userId: auth.uid },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ quotes });
}

export async function POST(req: Request) {
  const auth = await getAuthFromCookie(); // ✅ await
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = quoteCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const q = await prisma.quote.create({          // ✅ prisma.quote
    data: {
      ...parsed.data,
      userId: auth.uid,
    },
  });

  return NextResponse.json({ ok: true, quote: q });
}
