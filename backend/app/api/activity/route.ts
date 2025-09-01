// =============================================================
// /app/api/activity/route.ts
//  - 변화 이력 조회 API (캔버스 'activity-feed.html'과 호환)
//  - CORS는 로그인 라우트와 동일 정책 사용
// =============================================================

export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ────────────────── CORS helpers (로그인 라우트와 동일 규칙) ──────────────────
const DEFAULT_ALLOWED = [
  "http://127.0.0.1:3000",
  "http://localhost:3000",
  "http://127.0.0.1:5501",
  "http://localhost:5501",
  "https://ucdksea.com",
];
const ALLOWED = (process.env.ALLOWED_ORIGINS ?? DEFAULT_ALLOWED.join(","))
  .split(",")
  .map((s) => s.trim())
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

  const url = new URL(req.url);
  const page = Math.max(1, Number(url.searchParams.get("page") || "1"));
  const pageSize = Math.min(200, Math.max(1, Number(url.searchParams.get("page_size") || "20")));
  const action = url.searchParams.get("action") || ""; // CREATE/UPDATE/... (enum)
  const target = url.searchParams.get("target") || ""; // POST/USER/...
  const user = url.searchParams.get("user") || "";     // actorId contains
  const q = (url.searchParams.get("q") || "").trim();  // free text
  const start = url.searchParams.get("start");
  const end = url.searchParams.get("end");
  const order = (url.searchParams.get("order") || "desc").toLowerCase() === "asc" ? "asc" : "desc";

  try {
    const where: any = {};
    if (action) where.action = action as any;
    if (target) where.targetType = target;
    if (user) where.actorId = { contains: user, mode: "insensitive" };
    if (start || end) {
      where.ts = { gte: start ? new Date(start) : undefined, lte: end ? new Date(end) : undefined };
    }
    if (q) {
      // 텍스트 필드 다중 검색
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { summary: { contains: q, mode: "insensitive" } },
        { targetType: { contains: q, mode: "insensitive" } },
        { targetId: { contains: q, mode: "insensitive" } },
        { actorId: { contains: q, mode: "insensitive" } },
        { actorIp: { contains: q, mode: "insensitive" } },
        { requestId: { contains: q, mode: "insensitive" } },
      ];
    }

    const [total, rows] = await Promise.all([
      prisma.auditEvent.count({ where }),
      prisma.auditEvent.findMany({
        where,
        orderBy: { ts: order },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    const data = rows.map((r) => ({
      id: r.id,
      timestamp: r.ts.toISOString(),
      action: r.action,
      actor: r.actorId ?? "system",
      actor_avatar: "",
      target_type: r.targetType,
      target_id: r.targetId ?? "",
      title: r.title ?? "",
      summary: r.summary ?? "",
      changes: Array.isArray(r.changesJson) ? (r.changesJson as any[]) : [],
      diff_before: "", // 필요 시 별도 저장/가공
      diff_after: "",
      ip: r.actorIp ?? "",
      request_id: r.requestId ?? "",
      meta: { severity: r.severity, hash: r.hash, prevHash: r.prevHash },
    }));

    return NextResponse.json({ data, page, page_size: pageSize, total }, { headers });
  } catch (e) {
    console.error("/api/activity error", e);
    return NextResponse.json({ error: "Server error" }, { status: 500, headers });
  }
}

