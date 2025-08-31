// app/api/auth/login/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

// .env 예시:
// ALLOWED_ORIGINS=http://127.0.0.1:3000,http://localhost:3000,https://ucdksea.com
// APP_BASE_URL=http://localhost:3000   // 운영에선 https://ucdksea.com
const DEFAULT_ALLOWED = [
  "http://127.0.0.1:3000",
  "http://localhost:3000",
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
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-CSRF-Token",
    "Access-Control-Max-Age": "600",
    "Vary": "Origin",
  };
  if (origin && ALLOWED.includes(origin)) {
    h["Access-Control-Allow-Origin"] = origin;
    h["Access-Control-Allow-Credentials"] = "true";
  }
  return h;
}

function sameOrigin(origin: string | null): boolean {
  try {
    const app = new URL(process.env.APP_BASE_URL ?? "http://localhost:3000").origin;
    return !!origin && new URL(origin).origin === app;
  } catch {
    return false;
  }
}

export async function OPTIONS(req: Request) {
  const origin = req.headers.get("origin");
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  const headers = corsHeaders(origin);

  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400, headers });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: "Invalid login" }, { status: 401, headers });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return NextResponse.json({ error: "Invalid login" }, { status: 401, headers });

    if (!user.isApproved) {
      return NextResponse.json({ error: "Not approved yet" }, { status: 403, headers });
    }

    // 쿠키 정책 결정
    const isProd = process.env.NODE_ENV === "production";
    const isSame = sameOrigin(origin);

    // 같은 오리진: Lax (개발에서 제일 편함)
    // 크로스 오리진: None + Secure (⚠️ HTTPS 필수; http 로컬에선 브라우저가 쿠키를 막음)
    const cookieSameSite = isSame ? "lax" : ("none" as const);
    const cookieSecure = isSame ? isProd : true; // cross-site면 항상 true

    cookies().set("uid", user.id, {
      httpOnly: true,
      sameSite: cookieSameSite, // "lax" | "none"
      secure: cookieSecure,     // prod 또는 cross-site일 때 true
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json(
      { ok: true, user: { id: user.id, email: user.email, name: user.name } },
      { status: 200, headers },
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500, headers });
  }
}
