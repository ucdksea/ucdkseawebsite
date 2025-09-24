"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/routes/admin-users.ts
const express_1 = __importDefault(require("express"));
const mail_1 = require("../lib/mail");
const prisma_1 = require("../lib/prisma"); // ← 실제로 DB 업데이트 시 사용
const router = express_1.default.Router();
router.get("/__alive", (_req, res) => {
    res.json({ ok: true, router: "admin-users" });
});
/**
 * 이메일의 Approve/Decline 버튼이 여길 두드림
 * GET /api/admin/users/action?token=...
 */
router.get("/users/action", async (req, res) => {
    const token = req.query.token || "";
    if (!token)
        return res.status(400).send("Missing token");
    try {
        const { action, user } = (0, mail_1.verifyAdminActionToken)(token); // { action: "approve"|"decline", user: { id,name,email } }
        // (선택) DB 업데이트 : 유저가 이미 DB에 있으면 승인/거절 반영
        try {
            await prisma_1.prisma.user.update({
                where: { id: user.id },
                data: { isApproved: action === "approve" },
            });
        }
        catch (e) {
            // 사용자가 아직 DB에 없으면 여기로 빠질 수 있음 — 로깅만 하고 계속 진행
            console.warn("[admin-users] user.update skipped:", e?.message);
        }
        // 승인일 때 사용자에게 승인 메일 발송
        if (action === "approve") {
            await (0, mail_1.sendApprovalEmail)(user.email, user.name, user.email);
        }
        // 간단한 결과 페이지
        const appUrl = process.env.APP_BASE_URL || "https://www.ucdksea.com";
        const title = action === "approve" ? "Approved ✅" : "Declined 🚫";
        const desc = action === "approve"
            ? `User ${user.name} (${user.email}) has been approved.`
            : `User ${user.name} (${user.email}) has been declined.`;
        res
            .setHeader("Content-Type", "text/html; charset=utf-8")
            .send(`<!doctype html><meta charset="utf-8">
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
      </div>`);
    }
    catch (e) {
        res
            .status(400)
            .setHeader("Content-Type", "text/html; charset=utf-8")
            .send(`Invalid or expired link. (${e?.message || "error"})`);
    }
});
exports.default = router;
