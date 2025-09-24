///Users/stephanie/Desktop/ucdksea-website/backend/app/api/admin/users/action/route.ts
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { sendApprovalEmail } from "@/lib/mail";

// GET /api/admin/users/action?token=...
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");
    if (!token) return html("Missing token.", 400);

    let payload: { uid: string; action: "approve" | "decline"; iat: number; exp: number };
    try {
      payload = jwt.verify(token, process.env.ADMIN_ACTION_SECRET!) as any;
    } catch {
      return html("Invalid or expired link.", 400);
    }

    const user = await prisma.user.findUnique({ where: { id: payload.uid } });
    if (!user) return html("User not found (already processed?).", 404);

    if (payload.action === "approve") {
      const updated = await prisma.user.update({
        where: { id: user.id },
        data: { isApproved: true },
      });
      try { await sendApprovalEmail(
        updated.email,
      updated.name ?? updated.email,
      updated.email); 
    } catch {}
      return html("Approved ✓ The user has been granted access.");
    }

    // decline: 보류/삭제 중 택1 — 여기선 안전하게 삭제
    await prisma.quote.deleteMany({ where: { userId: user.id } }); // 종속 데이터 먼저
    await prisma.user.delete({ where: { id: user.id } });
    return html("Declined ✗ The registration has been removed.");
  } catch (e) {
    console.error(e);
    return html("Server error.", 500);
  }
}

function html(message: string, status = 200) {
  const body = `<!doctype html>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Admin Action</title>
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;max-width:560px;margin:14vh auto;padding:24px;border:1px solid #E5E7EB;border-radius:14px">
    <p style="font-size:16px; margin:0">${message}</p>
  </div>`;
  return new NextResponse(body, { status, headers: { "content-type": "text/html; charset=utf-8" } });
}
