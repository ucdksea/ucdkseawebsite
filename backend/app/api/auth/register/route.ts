// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"; // ← bcryptjs 사용
import { prisma } from "@/lib/prisma";
import { registerSchema, type RegisterPayload } from "@/lib/validations";
import { sendAdminNewRegistration } from "@/lib/mail";

export const runtime = "nodejs";

/* ───────────────────── CORS ─────────────────────
   .env:
   ALLOWED_ORIGINS="https://ucdksea.com,https://www.ucdksea.com"
*/
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? "http://127.0.0.1:5501")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

function corsHeaders(origin: string | null) {
  const h: Record<string, string> = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    Vary: "Origin",
  };
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    h["Access-Control-Allow-Origin"] = origin;
    h["Access-Control-Allow-Credentials"] = "true";
  }
  return h;
}

export async function OPTIONS(req: Request) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req.headers.get("origin")) });
}

/* ─────────────── Register ───────────────
   .env:
   ALLOWED_EMAIL_DOMAINS="ucdavis.edu"
   ADMIN_EMAILS="bjiwon766@gmail.com"
*/
export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  const headers = corsHeaders(origin);

  try {
    const body = (await req.json()) as unknown;
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: parsed.error.flatten() },
        { status: 400, headers }
      );
    }

    const { email, password, name }: RegisterPayload = parsed.data;

    // (옵션) 이메일 도메인 제한
    const allowed = (process.env.ALLOWED_EMAIL_DOMAINS ?? "")
      .split(",")
      .map(s => s.trim().toLowerCase())
      .filter(Boolean);
    if (allowed.length) {
      const domain = String(email).split("@")[1]?.toLowerCase() ?? "";
      if (!allowed.includes(domain)) {
        return NextResponse.json(
          { error: `Please use your @${allowed[0]} email.` },
          { status: 400, headers }
        );
      }
    }

    // 중복 체크
    const exists = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (exists) {
      return NextResponse.json(
        { error: "Email already in use." },
        { status: 409, headers }
      );
    }

    // 해시 & 생성
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, name, passwordHash, isApproved: false },
      select: { id: true, email: true, name: true, isApproved: true, createdAt: true },
    });

    // 관리자 알림 (한 번만)
    try {
      const admins = process.env.ADMIN_EMAILS || "";
      if (admins.trim()) {
        await sendAdminNewRegistration(admins, {
          id: user.id,
          name: user.name ?? user.email,
          email: user.email,
        });
      }
    } catch (e) {
      console.error("[MAIL][admin-notify] error:", e);
    }

    return NextResponse.json(
      {
        ok: true,
        user,
        message: "Registration submitted. Await admin approval.",
      },
      { status: 201, headers }
    );
  } catch (err) {
    console.error("[POST /api/auth/register] ERR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500, headers });
  }
}
