// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

/** 여러 오리진 허용 (localhost/127.0.0.1 둘 다) */
const ALLOWED = (process.env.ALLOWED_ORIGINS ??
  "http://127.0.0.1:5501,http://localhost:5501")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

function corsHeaders(origin: string | null) {
  const h: Record<string, string> = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Vary": "Origin",
  };
  if (origin && ALLOWED.includes(origin)) {
    h["Access-Control-Allow-Origin"] = origin;
    // 쿠키를 쓸 거면 Credentials 허용 필요
    h["Access-Control-Allow-Credentials"] = "true";
  }
  return h;
}

export async function OPTIONS(req: Request) {
  // 프리플라이트 응답
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

    cookies().set("uid", user.id, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
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
