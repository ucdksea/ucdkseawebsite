export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendApprovalEmail } from "@/lib/mail"; // 메일 유틸을 만들었으면 사용, 없으면 이 import와 호출을 주석처리

function isAdmin(req: Request) {
  const t = req.headers.get("x-admin-token");
  return t && t === process.env.ADMIN_TOKEN;
}

type Params = { params: { id: string } };

export async function POST(req: Request, { params }: Params) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: params.id } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (user.isApproved) {
    return NextResponse.json({ ok: true, message: "이미 승인된 사용자입니다." });
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { isApproved: true },
    select: { id: true, email: true, username: true, isApproved: true },
  });

  // 승인 메일 발송 (메일 설정이 되어 있을 때만)
  try {
    if (updated.email && process.env.SMTP_HOST) {
      await sendApprovalEmail(updated.email, updated.username);
    }
  } catch (e) {
    console.error("MAIL_ERROR:", e);
    // 메일 실패해도 승인 자체는 성공 처리
  }

  return NextResponse.json({ ok: true, user: updated, message: "승인 완료" });
}
