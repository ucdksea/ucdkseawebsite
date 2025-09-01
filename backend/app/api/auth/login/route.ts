// app/api/auth/login/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

import { appendAuditEvent } from "@/lib/audit";
import { getRequestId, getClientIp } from "@/lib/req";

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
    Vary: "Origin",
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

  const requestId = getRequestId();
  const ip = getClientIp();

  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      await appendAuditEvent({
        actorId: email ?? "anonymous",
        actorIp: ip,
        requestId,
        action: "LOGIN",
        targetType: "USER",
        summary: "FAILED: Missing credentials",
        severity: 2,
      });
      return NextResponse.json({ error: "Missing credentials" }, { status: 400, headers });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      await appendAuditEvent({
        actorId: email,
        actorIp: ip,
        requestId,
        action: "LOGIN",
        targetType: "USER",
        summary: "FAILED: No such user",
        severity: 2,
      });
      return NextResponse.json({ error: "Invalid login" }, { status: 401, headers });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      await appendAuditEvent({
        actorId: email,
        actorIp: ip,
        requestId,
        action: "LOGIN",
        targetType: "USER",
        targetId: user.id,
        summary: "FAILED: Wrong password",
        severity: 2,
      });
      return NextResponse.json({ error: "Invalid login" }, { status: 401, headers });
    }

    if (!user.isApproved) {
      await appendAuditEvent({
        actorId: email,
        actorIp: ip,
        requestId,
        action: "LOGIN",
        targetType: "USER",
        targetId: user.id,
        summary: "BLOCKED: Not approved yet",
        severity: 1,
      });
      return NextResponse.json({ error: "Not approved yet" }, { status: 403, headers });
    }

    // ── 성공 로그인 ──
    const isProd = process.env.NODE_ENV === "production";
    const isSame = sameOrigin(origin);

    const cookieSameSite = isSame ? "lax" : ("none" as const);
    const cookieSecure = isSame ? isProd : true;

    cookies().set("uid", user.id, {
      httpOnly: true,
      sameSite: cookieSameSite,
      secure: cookieSecure,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    await appendAuditEvent({
      actorId: email,
      actorIp: ip,
      requestId,
      action: "LOGIN",
      targetType: "USER",
      targetId: user.id,
      title: "User login success",
      summary: "Login successful",
      severity: 0,
    });

    return NextResponse.json(
      { ok: true, user: { id: user.id, email: user.email, name: user.name } },
      { status: 200, headers },
    );
  } catch (e: any) {
    console.error(e);
    await appendAuditEvent({
      actorId: "system",
      actorIp: ip,
      requestId,
      action: "LOGIN",
      targetType: "USER",
      summary: `FAILED: ${e?.message ?? "Server error"}`,
      severity: 3,
    });
    return NextResponse.json({ error: "Server error" }, { status: 500, headers });
  }
}
