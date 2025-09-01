// app/api/admin/users/[id]/approve/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendApprovalEmail } from "@/lib/mail";
import { appendAuditEvent } from "@/lib/audit";
import { getRequestId, getClientIp, getActor } from "@/lib/req";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const user = await prisma.user.update({
    where: { id: params.id },
    data: { isApproved: true },
    select: { id: true, email: true, name: true },
  });

  try {
    await sendApprovalEmail(user.email, user.name, user.email);
  } catch (e) {
    console.error("approval mail error:", e);
  }
  try {
    const requestId = getRequestId();
    const ip = getClientIp();
    const admin = await getActor(); // 현재 승인하는 관리자 이메일/ID

    await appendAuditEvent({
      actorId: admin ?? "system",
      actorIp: ip,
      requestId,
      action: "APPROVE",
      targetType: "USER",
      targetId: user.id,
      title: "User approved",
      summary: `User ${user.email} approved by ${admin ?? "unknown"}`,
      changes: [{ field: "isApproved", kind: "change", to: true }],
      severity: 2,
    });
  } catch (e) {
    console.error("audit(APPROVE) failed:", e);
  }
  return NextResponse.json({ ok: true, user });
}
