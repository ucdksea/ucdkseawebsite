"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/admin-users.ts
const express_1 = __importDefault(require("express"));
const mail_1 = require("../lib/mail");
const prisma_1 = require("../lib/prisma");
const router = express_1.default.Router();
router.get("/__alive", (_req, res) => {
    res.json({ ok: true, router: "admin-users" });
});
router.get("/users/action", async (req, res) => {
    const token = req.query.token || "";
    if (!token)
        return res.status(400).send("Missing token");
    try {
        const { action, user } = (0, mail_1.verifyAdminActionToken)(token); // user:{id,name,email}
        // 등록 시 반드시 user 레코드를 만들었으므로, email로 조회해서 업데이트
        const existing = await prisma_1.prisma.user.findUnique({ where: { email: user.email } });
        if (!existing) {
            // 등록이 안돼 있으면 승인 불가 (정상 흐름에선 안 옴)
            return res
                .status(400)
                .send("User not found. Please ensure registration created a record.");
        }
        await prisma_1.prisma.user.update({
            where: { id: existing.id },
            data: { isApproved: action === "approve" },
        });
        if (action === "approve") {
            await (0, mail_1.sendApprovalEmail)(user.email, user.name, user.email);
        }
        const appUrl = process.env.APP_LOGIN_URL || "https://www.ucdksea.com/login";
        res.setHeader("Content-Type", "text/html; charset=utf-8").send(`
      <!doctype html><meta charset="utf-8">
      <meta http-equiv="refresh" content="2;url=${appUrl}">
      <title>${action === "approve" ? "Approved ✅" : "Declined 🚫"}</title>
      <div style="font:14px system-ui;padding:40px">
        ${action === "approve" ? "Approved" : "Declined"}. Redirecting…
      </div>
    `);
    }
    catch (e) {
        res.status(400).send(`Invalid or expired link. (${e?.message || "error"})`);
    }
});
exports.default = router;
