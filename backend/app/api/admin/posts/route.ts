// /Users/stephanie/Desktop/ucdksea-website/backend/app/api/admin/posts/route.ts
console.log("✅ Loaded route.ts V7", new Date().toISOString());
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const FINGERPRINT = "posts2-V7-THIS-IS-NEW";

const ALLOWED = ["POPUP", "EVENT_UPCOMING", "EVENT_POLAROID", "GM", "OFFICER"] as const;
type PostType = typeof ALLOWED[number];

const DEFAULT_ALLOWED = [
  "http://127.0.0.1:3000","http://localhost:3000",
  "http://127.0.0.1:5501","http://localhost:5501",
  "https://ucdksea.com",
];

function cors(origin: string | null) {
  const h: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-CSRF-Token, X-Admin-Token, Accept",
    "Access-Control-Max-Age": "600",
    "Cache-Control": "no-store",
    Vary: "Origin",
    "x-route-fingerprint": FINGERPRINT,
  };
  if (origin && DEFAULT_ALLOWED.includes(origin)) {
    h["Access-Control-Allow-Origin"] = origin;
    h["Access-Control-Allow-Credentials"] = "true";
  }
  return h;
}

function parsePostType(v: string | null): PostType | undefined {
  if (!v) return undefined;
  return (ALLOWED as readonly string[]).includes(v) ? (v as PostType) : undefined;
}

export async function OPTIONS(req: Request) {
  return new NextResponse(null, { status: 204, headers: cors(req.headers.get("origin")) });
}

export async function GET(req: Request) {
  const headers = cors(req.headers.get("origin"));
  const url = new URL(req.url);
  const typeEnum = parsePostType(url.searchParams.get("type"));
  const activeParam = url.searchParams.get("active");
  const onlyActive =
    activeParam == null ? true :
    activeParam === "1" ? true :
    activeParam === "0" ? false : true;

  const rows = await prisma.post.findMany({
    where: { ...(typeEnum ? { type: typeEnum } : {}), active: onlyActive },
    orderBy: [
      { sortOrder: 'asc' },   
      { createdAt: 'desc' },
    ],
    select: {
      id: true, type: true, active: true, createdAt: true,
      imageUrl: true, linkUrl: true, title: true, date: true, descKo: true, descEn: true,
      year: true, quarter: true, meta: true,
    },
  });

  const posts = rows.map((p) =>
    p.type === "OFFICER"
      ? {
          ...p,
          enName:   p.title   ?? null,
          koName:   p.descKo  ?? null,
          role:     p.descEn  ?? null,
          linkedin: p.linkUrl ?? null,
        }
      : p
  );

  return NextResponse.json({ posts }, { headers });
}

export async function POST(req: Request) {
  const headers = cors(req.headers.get("origin"));

  let body: any = {};
  try { body = await req.json(); } catch {}

  if (body?.action === "REORDER") {
    const typeEnum = parsePostType(body?.type ?? null);
    const rawOrder = body?.order;
    const order: string[] | null =
      Array.isArray(rawOrder) && rawOrder.every((x: unknown) => typeof x === "string")
        ? (rawOrder as string[])
        : null;

    if (!typeEnum) {
      return NextResponse.json({ error: "type required for REORDER" }, { status: 400, headers });
    }
    if (!order || order.length === 0) {
      return NextResponse.json({ error: "order (string[]) required" }, { status: 400, headers });
    }

    const existing = await prisma.post.findMany({
      where: { id: { in: order }, type: typeEnum },
      select: { id: true },
    });
    const existingIds = new Set(existing.map(x => x.id));
    const invalid = order.filter(id => !existingIds.has(id));
    if (invalid.length) {
      return NextResponse.json({ error: "Invalid ids for REORDER", invalid }, { status: 400, headers });
    }

    await prisma.$transaction(
      order.map((id: string, idx: number) =>
        prisma.post.update({
          where: { id },
          data:  { sortOrder: idx },
        })
      )
    );

    console.log("[REORDER] type=%s ids=%o", typeEnum, order);

    return NextResponse.json({ ok: true, type: typeEnum, order }, { headers });
  }

  console.log("[HIT /api/admin/posts] NEW ROUTE", Date.now());
  
  const seasonAliases: Record<string, string> = {
    fall: "Fall", f: "Fall", "autumn": "Fall", "1": "Fall", q1: "Fall",
    winter: "Winter", w: "Winter", "2": "Winter", q2: "Winter",
    spring: "Spring", s: "Spring", "3": "Spring", q3: "Spring",
  };
  function normalizeQuarter(raw: unknown): string {
    if (raw == null) return "";
    const s = String(raw).trim();
    if (!s) return "";
    const key = s.toLowerCase().replace(/\s+/g, "");
    return seasonAliases[key] ?? "";
  }
  headers["x-posts-route-fp"] = "posts2-V7-THIS-IS-NEW";
  headers["x-posts-route-hit"] = String(Date.now());
  try { body = await req.json(); } catch {}

  const typeEnum = parsePostType(body?.type ?? null);
  if (!typeEnum) {
    return NextResponse.json({ error: `type must be one of ${ALLOWED.join("|")}` }, { status: 400, headers });
  }
  if (!body?.imageUrl) {
    return NextResponse.json({ error: "imageUrl required" }, { status: 400, headers });
  }


  const yRaw =
    body.year ??
    body.gmYear ??
    body.polaroidYear ??
    body?.meta?.year ??
    null;

  const qRaw =
    body.quarter ??
    body.gmQuarter ??
    body.polaroidQuarter ??
    body?.meta?.quarter ??
    null;

  const normYear =
    typeof yRaw === "number" ? String(yRaw) :
    typeof yRaw === "string" ? yRaw.trim() : "";

  // "Q1", "q2", "2 " 같은 입력도 허용
  const normQuarterStr =
    typeof qRaw === "number" ? String(qRaw) :
    typeof qRaw === "string" ? qRaw.trim().replace(/^q/i, "").replace(/^Q/i, "") : "";

  const normQuarterNum = Number(normQuarterStr);
  const normQuarter = normalizeQuarter(qRaw);

  if ((typeEnum === "POPUP" || typeEnum === "EVENT_UPCOMING") && !body.linkUrl) {
    return NextResponse.json({ error: "linkUrl required for POPUP/EVENT_UPCOMING" }, { status: 400, headers });
  }
  if (typeEnum === "EVENT_POLAROID" && !body.title) {
    return NextResponse.json({ error: "title required for EVENT_POLAROID" }, { status: 400, headers });
  }

  if (typeEnum === "GM" || typeEnum === "EVENT_POLAROID") {
    if (!normYear) {
      return NextResponse.json(
        { error: `Year required for ${typeEnum}`, received: { year: yRaw } },
        { status: 400, headers }
      );
    }
    if (!normQuarterStr) {
      return NextResponse.json(
        { error: `Quarter required for ${typeEnum}`, received: { quarter: qRaw } },
        { status: 400, headers }
      );
    }
    if (!normQuarter) {
      return NextResponse.json(
        { error: "Quarter must be one of Fall / Winter / Spring", received: { quarter: qRaw } },
        { status: 400, headers }
      );
    }
  }

  const data: any = {
    type: typeEnum,
    imageUrl: body.imageUrl,     
    active: true,
    meta: {
      posterUrl: body?.meta?.posterUrl ?? body.posterUrl ?? null,
      instagramUrl: body?.meta?.instagramUrl ?? body.instagramUrl ?? null,
      formUrl: body?.meta?.formUrl ?? body.formUrl ?? null,
      year: body?.meta?.year ?? null,
      quarter: body?.meta?.quarter ?? null,
    },
  };
  const posterUrlIn = body.posterUrl ?? body?.meta?.posterUrl ?? "";
  const effectivePosterUrl = posterUrlIn || data.imageUrl;

    const meta: any = {};
    if (effectivePosterUrl) meta.posterUrl = effectivePosterUrl;
    if (body.formUrl ?? body?.meta?.formUrl) meta.formUrl = body.formUrl ?? body?.meta?.formUrl;
    if (body.instagramUrl ?? body?.meta?.instagramUrl) meta.instagramUrl = body.instagramUrl ?? body?.meta?.instagramUrl;
    if (Object.keys(meta).length) data.meta = meta;
  

  if (typeEnum === "OFFICER") {
    data.title   = (body.enName   ?? "").trim();
    data.descKo  = (body.koName   ?? "").trim();
    data.descEn  = (body.role     ?? "").trim();
    data.linkUrl = (body.linkedin ?? "").trim() || null;
    data.date    = null;
    data.year    = null;
    data.quarter = null;
  } else if (typeEnum === "GM") {
    data.title   = null;
    data.date    = null;
    data.descKo  = body.descKo ?? null;
    data.descEn  = body.descEn ?? null;
    data.linkUrl = body.linkUrl ?? null;
    data.year    = normYear;           
    data.quarter = String(normQuarterNum);
    data.quarter = normQuarter;
  } else if (typeEnum === "EVENT_POLAROID") {
    data.title   = body.title ?? null;
    data.descKo  = body.descKo ?? null;
    data.descEn  = body.descEn ?? null;
    data.linkUrl = body.linkUrl ?? null;  
    data.date    = body.date ? new Date(body.date) : null;
    data.year    = normYear;
    data.quarter = normQuarter;
  } else {
    data.title   = body.title ?? null;
    data.descKo  = body.descKo ?? null;
    data.descEn  = body.descEn ?? null;
    data.linkUrl = body.linkUrl ?? null;
    data.date    = body.date ? new Date(body.date) : null;
    data.year    = null;
    data.quarter = null;
  }

  try {
    const post = await prisma.post.create({ data });
    return NextResponse.json({ ok: true, post }, { headers });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Create failed" }, { status: 500, headers });
  }  
}



