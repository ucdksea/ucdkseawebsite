"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mail_1 = require("../lib/mail");
const prisma_1 = require("../lib/prisma"); // 나중에 켜기
const router = express_1.default.Router();
console.log("[admin-users] router loaded");
router.get("/__alive", (_req, res) => {
    res.json({ ok: true, router: "admin-users" });
});
router.get("/users/action", async (req, res) => {
    const token = req.query.token || "";
    if (!token)
        return res.status(400).send("Missing token");
    try {
        const { action, user } = (0, mail_1.verifyAdminActionToken)(token);
        const appUrl = process.env.APP_BASE_URL || "https://www.ucdksea.com";
        // 나중에 DB 반영할 때:
        await prisma_1.prisma.user.update({
            where: { id: user.id },
            data: { isApproved: action === "approve" }, // ← status 말고 isApproved
        });
        if (action === "approve") {
            await (0, mail_1.sendApprovalEmail)(user.email, user.name, user.email);
        }
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
    }
    catch (e) {
        res.status(400).send(`Invalid or expired link. (${e?.message || "error"})`);
    }
});
exports.default = router;
