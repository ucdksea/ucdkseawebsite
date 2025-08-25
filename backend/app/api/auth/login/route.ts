// app/api/auth/login/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { signToken, setAuthCookie } from "@/lib/auth";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().min(2).max(32),   // ✅ 아이디 로그인
  password: z.string().min(8),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    const { username, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    if (!user.isApproved) {
      return NextResponse.json({ error: "관리자 승인 대기 중입니다." }, { status: 403 });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const token = signToken({ uid: user.id, email: user.email });
    await setAuthCookie(token);

    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
