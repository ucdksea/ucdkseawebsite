// =============================================================
// /app/api/log/route.ts
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
  "https://www.ucdksea.com",
  "https://api.ucdksea.com",
];
const ALLOWED = (process.env.ALLOWED_ORIGINS ?? DEFAULT_ALLOWED.join(","))
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

function corsHeaders(origin: string | null) {
  const h: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-CSRF-Token",
    "Access-Control-Max-Age": "600",
    "Cache-Control": "no-store",
    Vary: "Origin",
  };
  if (origin && ALLOWED.includes(origin)) {
    h["Access-Control-Allow-Origin"] = origin;
    h["Access-Control-Allow-Credentials"] = "true";
  }
  return h;
}

// ✅ UI→DB 액션 매핑 (ASSIGN 지원)
function normalizeAction(a: string): string {
  const up = a.toUpperCase();
  if (up === "ASSIGN") return "ROLE_ASSIGN";
  // 필요하면 REVOKE도 노출 시 "UNASSIGN" 같은 별칭 처리 가능
  return up;
}

export async function GET(req: Request) {
  const origin = req.headers.get("origin");
  const headers = corsHeaders(origin);

  const url = new URL(req.url);
  const page = Math.max(1, Number(url.searchParams.get("page") || "1"));
  const pageSize = Math.min(200, Math.max(1, Number(url.searchParams.get("page_size") || "20")));
  const actionRaw = url.searchParams.get("action") || "";
  const action = actionRaw ? normalizeAction(actionRaw) : "";              // ✅ 매핑 반영
  const target = url.searchParams.get("target") || "";
  const user = url.searchParams.get("user") || "";
  const q = (url.searchParams.get("q") || "").trim();
  const start = url.searchParams.get("start");
  const end = url.searchParams.get("end");
  const order = (url.searchParams.get("order") || "desc").toLowerCase() === "asc" ? "asc" : "desc";

  try {
    const where: any = {};
    if (action) where.action = action as any;
    if (target) where.targetType = target;
    if (user) where.actorId = { contains: user, mode: "insensitive" };
    if (start || end) {
      const gte = start ? new Date(start) : undefined;
      const lte = end ? new Date(end) : undefined;
      where.ts = { ...(gte ? { gte } : {}), ...(lte ? { lte } : {}) };
    }
    if (q) {
      where.OR = [
        { title:      { contains: q, mode: "insensitive" } },
        { summary:    { contains: q, mode: "insensitive" } },
        { targetType: { contains: q, mode: "insensitive" } },
        { targetId:   { contains: q, mode: "insensitive" } },
        { actorId:    { contains: q, mode: "insensitive" } },
        { actorIp:    { contains: q, mode: "insensitive" } },
        { requestId:  { contains: q, mode: "insensitive" } },
      ];
    }

    const [total, rows] = await Promise.all([
      prisma.auditEvent.count({ where }),
      prisma.auditEvent.findMany({
        where,
        orderBy: { ts: order as "asc" | "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    const data = rows.map((r) => ({
      id: r.id,
      timestamp: r.ts.toISOString(),
      action: r.action,                 // e.g., ROLE_ASSIGN도 그대로 반환(필요시 'ASSIGN'으로 재매핑 가능)
      actor: r.actorId ?? "system",
      actor_avatar: "",
      target_type: r.targetType,
      target_id: r.targetId ?? "",
      title: r.title ?? "",
      summary: r.summary ?? "",
      changes: Array.isArray(r.changesJson) ? (r.changesJson as any[]) : [],
      diff_before: "",
      diff_after: "",
      ip: r.actorIp ?? "",
      request_id: r.requestId ?? "",
      labels: [],                       // ✅ FE가 배열 기대 → 빈 배열 보장
      meta: { severity: r.severity, hash: r.hash, prevHash: r.prevHash },
    }));
    return NextResponse.json({ data, page, page_size: pageSize, total }, { headers });
  } catch (e) {
    console.error("/api/log error", e);
    return NextResponse.json({ error: "Server error" }, { status: 500, headers });
  }
}

// app/api/log/route.ts (GET 함수 아래에 추가)

// ─────────────────────────────────────────────────────────────
// POST: 프론트엔드에서 날아오는 보안 로그 DB에 저장
// ─────────────────────────────────────────────────────────────
// ────────────────── POST: 모든 보안/활동 로그 저장 ──────────────────
export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  const headers = corsHeaders(origin);

  try {
    const body = await req.json();
    // ✅ 프론트엔드에서 action(CREATE, DELETE 등)과 targetType(POST, OFFICER 등)도 받도록 추가!
    const { email, status, reason, actionType, targetType } = body;

    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0] : "unknown";

    // 프론트에서 actionType을 안 보냈으면 기본값으로 로그인 결과를 넣음
    const finalAction = actionType || (status === "SUCCESS" ? "LOGIN_SUCCESS" : "LOGIN_FAILED");

    const newLog = await prisma.auditEvent.create({
      data: {
        action: finalAction, // CREATE, DELETE, LOGIN_SUCCESS 등
        actorId: email || "Admin", // 토큰이나 이메일
        actorIp: ip,
        targetType: targetType || "AUTH",
        title: status === "SUCCESS" ? "Action Successful" : "Action Failed",
        summary: reason || "Activity recorded",
        severity: status === "SUCCESS" ? "INFO" : "WARNING", 
        ts: new Date(),
      },
    });

    return NextResponse.json({ success: true, logId: newLog.id }, { status: 201, headers });
  } catch (e) {
    console.error("POST /log error:", e);
    return NextResponse.json({ error: "Failed to create audit log" }, { status: 500, headers });
  }
}
// ─────────────────────────────────────────────────────────────
// OPTIONS: 브라우저의 CORS 사전 요청(Preflight) 처리
// ─────────────────────────────────────────────────────────────
export async function OPTIONS(req: Request) {
  const origin = req.headers.get("origin");
  const headers = corsHeaders(origin);
  
  return new NextResponse(null, { status: 204, headers });
}