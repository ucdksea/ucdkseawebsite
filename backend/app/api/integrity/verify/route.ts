export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { recordHash } from "@/lib/auditHash";

// --- 간단 CORS (로그인 라우트와 동일 정책)
const DEFAULT_ALLOWED = [
  "http://127.0.0.1:3000",
  "http://localhost:3000",
  "http://localhost:4000",
  "http://127.0.0.1:5501",
  "http://localhost:5501",
  "https://ucdksea.com",
];
const ALLOWED = (process.env.ALLOWED_ORIGINS ?? DEFAULT_ALLOWED.join(","))
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

function corsHeaders(origin: string | null) {
  const h: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-CSRF-Token",
    "Access-Control-Max-Age": "600",
    Vary: "Origin",
  };
  if (origin && ALLOWED.includes(origin)) {
    h["Access-Control-Allow-Origin"] = origin;
    h["Access-Control-Allow-Credentials"] = "true";
  }
  return h;
}

export async function OPTIONS(req: Request) {
  const origin = req.headers.get("origin");
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

export async function GET(req: Request) {
  const origin = req.headers.get("origin");
  const headers = corsHeaders(origin);

  try {
    const url = new URL(req.url);
    const start = url.searchParams.get("start");
    const end = url.searchParams.get("end");
    if (!start || !end) {
      return NextResponse.json({ ok: false, error: "start/end required" }, { status: 400, headers });
    }

    // 1) 데이터 가져오기
    const rows = await prisma.auditEvent.findMany({
      where: { ts: { gte: new Date(start), lte: new Date(end) } },
      orderBy: { ts: "asc" },
      select: {
        ts: true,
        actorId: true,
        actorIp: true,
        action: true,
        targetType: true,
        targetId: true,
        title: true,
        summary: true,
        changesJson: true,
        requestId: true,
        severity: true,
        hash: true,
        prevHash: true,
      },
    });

    // 2) 체인 검증
    let prev: string | null = null;
    for (const r of rows) {
      const payload = {
        ts: r.ts.toISOString(),
        actorId: r.actorId,
        actorIp: r.actorIp,
        action: r.action,
        targetType: r.targetType,
        targetId: r.targetId,
        title: r.title,
        summary: r.summary,
        changesJson: r.changesJson,
        requestId: r.requestId,
        severity: r.severity,
      } as const;

      const h = recordHash(prev, payload);
      if (h !== r.hash) {
        return NextResponse.json(
          { ok: false, reason: "hash_mismatch", at: r.ts.toISOString(), expected: h, got: r.hash },
          { status: 200, headers },
        );
      }
      if (r.prevHash !== prev) {
        return NextResponse.json(
          { ok: false, reason: "prev_mismatch", at: r.ts.toISOString(), expectedPrev: prev, gotPrev: r.prevHash },
          { status: 200, headers },
        );
      }
      prev = r.hash;
    }

    return NextResponse.json({ ok: true, count: rows.length, start, end, rootHash: prev }, { status: 200, headers });
  } catch (e: any) {
    // 개발 중엔 에러 메시지도 돌려주자(원인 파악 빠르게)
    return NextResponse.json(
      { ok: false, error: "Server error", detail: e?.message ?? String(e) },
      { status: 500, headers },
    );
  }
}
