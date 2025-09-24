// backend/routes/admin-users.ts
import express from "express";
import { verifyAdminActionToken, sendApprovalEmail } from "../lib/mail";
// DB 연동은 후순위로. 타입 에러 막으려고 일단 제외
// import { prisma } from "../lib/prisma";

const router = express.Router();

console.log("[admin-users] router loaded");

// 헬스 체크
router.get("/__alive", (_req, res) => {
  res.json({ ok: true, router: "admin-users" });
});

/**
 * Approve/Decline 버튼 눌렀을 때 도착하는 엔드포인트
 * 예: GET /api/admin/users/action?token=...
 */
router.get("/users/action", async (req, res) => {
  const token = (req.query.token as string) || "";
  if (!token) return res.status(400).send("Missing token");

  try {
    const { action, user } = verifyAdminActionToken(token);
    const appUrl = process.env.APP_BASE_URL || "https://www.ucdksea.com";

    // ---- (선택) DB 반영: 스키마에 맞게 나중에 켜세요 ----
    // await prisma.user.update({
    //   where: { id: user.id },
    //   data: { isApproved: action === "approve" },  // ← status 가 아니라 isApproved
    // });

    // 승인 메일 발송
    if (action === "approve") {
      await sendApprovalEmail(user.email, user.name, user.email);
    }

    // 간단한 결과 페이지
    res
      .setHeader("Content-Type", "text/html; charset=utf-8")
      .send(`<!doctype html>
<meta charset="utf-8">
<meta http-equiv="refresh" content="2;url=${appUrl}">
<title>${action === "approve" ? "Approved ✅" : "Declined 🚫"}</title>
<div style="font:14px system-ui;padding:40px">
  ${action === "approve" ? "Approved" : "Declined"}. Redirecting…
  <a href="${appUrl}">Go now</a>
</div>`);
  } catch (e: any) {
    res.status(400).send(`Invalid or expired link. (${e?.message || "error"})`);
  }
});

export default router;
