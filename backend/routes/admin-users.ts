// backend/routes/admin-users.ts
import express from "express";
import { verifyAdminActionToken, sendApprovalEmail } from "../lib/mail";
// DB를 쓸 거면 주석 해제하세요
import { prisma } from "../lib/prisma";

const router = express.Router();

/**
 * Approve/Decline 버튼 눌렀을 때 열리는 라우트
 * 예: GET /api/admin/users/action?token=...
 */
router.get("/users/action", async (req, res) => {
  const token = (req.query.token as string) || "";

  if (!token) {
    return res.status(400).send("Missing token");
  }

  try {
    // lib/mail.ts 에서 만든 토큰 검증 함수
    const payload = verifyAdminActionToken(token); // { action, user:{id,name,email} }
    const { action, user } = payload;

    // (선택) DB 업데이트 — 필요하면 켜기
    await prisma.user.update({
      where: { id: user.id },
      data: { status: action === "approve" ? "ACTIVE" : "REJECTED" },
    });

    // 승인 시: 사용자에게 승인 메일 발송
    if (action === "approve") {
      await sendApprovalEmail(user.email, user.name, user.email);
    }

    // 간단한 결과 페이지 (HTML)
    const appUrl = process.env.APP_BASE_URL || "https://www.ucdksea.com";
    const title = action === "approve" ? "Approved ✅" : "Declined 🚫";
    const desc =
      action === "approve"
        ? `User ${user.name} (${user.email}) has been approved.`
        : `User ${user.name} (${user.email}) has been declined.`;

    res.setHeader("Content-Type", "text/html; charset=utf-8").send(`
      <!doctype html><meta charset="utf-8">
      <meta http-equiv="refresh" content="2;url=${appUrl}">
      <title>${title}</title>
      <style>
        body{font:14px/1.5 system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;padding:40px;color:#111}
        .card{max-width:560px;margin:auto;border:1px solid #e5e7eb;border-radius:12px;padding:24px;background:#fff}
        .ok{color:#14532d} .bad{color:#7f1d1d}
      </style>
      <div class="card">
        <h1 class="${action === "approve" ? "ok" : "bad"}">${title}</h1>
        <p>${desc}</p>
        <p>You’ll be redirected shortly… <a href="${appUrl}">Go now</a></p>
      </div>
    `);
  } catch (e: any) {
    res
      .status(400)
      .setHeader("Content-Type", "text/html; charset=utf-8")
      .send(`Invalid or expired link. (${e?.message || "error"})`);
  }
});

export default router;
