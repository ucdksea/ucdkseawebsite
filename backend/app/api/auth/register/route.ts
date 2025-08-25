// app/api/auth/register/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { registerSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = registerSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email, username, password } = parsed.data;

    // 중복 검증 (명시적으로 한 번 더)
    const dup = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
      select: { id: true, email: true, username: true },
    });
    if (dup) {
      return NextResponse.json(
        { error: "이미 사용 중인 이메일 또는 아이디입니다." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { email, username, passwordHash, isApproved: false },
      select: { id: true, email: true, username: true, isApproved: true, createdAt: true },
    });

    return NextResponse.json({
      ok: true,
      message: "승인 요청이 접수되었습니다. 관리자 승인 후 로그인할 수 있습니다.",
      user,
    });
  } catch (e: any) {
    console.error("REGISTER_ERROR:", e);

    // Prisma 고유값 위반
    if (e?.code === "P2002") {
      return NextResponse.json(
        { error: "이미 사용 중인 이메일 또는 아이디입니다." },
        { status: 409 }
      );
    }

    // 기타 에러
    return NextResponse.json(
      { error: "Server error", detail: String(e?.message ?? e) },
      { status: 500 }
    );
  }
}
