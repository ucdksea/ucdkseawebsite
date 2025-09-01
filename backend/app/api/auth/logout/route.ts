// app/api/auth/logout/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { appendAuditEvent } from "@/lib/audit";
import { getRequestId, getClientIp, getActor } from "@/lib/req";

export async function POST() {
  // 쿠키 제거 (세션 만료)
  cookies().set("uid", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });

  // 감사 로그 남기기
  try {
    const requestId = getRequestId();
    const ip = getClientIp();
    const actor = await getActor(); 

    await appendAuditEvent({
      actorId: actor ?? "anonymous",
      actorIp: ip,
      requestId,
      action: "LOGOUT",
      targetType: "USER",
      title: "User logout",
      summary: "Logout successful",
      severity: 0,
    });
  } catch (e) {
    console.error("audit(LOGOUT) failed:", e);
  }

  return NextResponse.json({ ok: true });
}
