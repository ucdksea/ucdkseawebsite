"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mail_1 = require("../lib/mail");
const prisma_1 = require("../lib/prisma");
const router = express_1.default.Router();
router.get("/users/action", async (req, res) => {
    const token = req.query.token || "";
    if (!token)
        return res.status(400).send("Missing token");
    try {
        const { action, user } = (0, mail_1.verifyAdminActionToken)(token);
        // 반드시 존재해야 함 (등록에서 만들었으니까)
        const exists = await prisma_1.prisma.user.findUnique({ where: { id: user.id } });
        if (!exists) {
            // 혹시 토큰의 id가 달라졌다면 email로도 한 번 더 시도
            const byEmail = await prisma_1.prisma.user.findUnique({ where: { email: user.email } });
            if (!byEmail) {
                return res.status(400).send("No such user pending approval");
            }
            await prisma_1.prisma.user.update({
                where: { email: user.email },
                data: { isApproved: action === "approve" },
            });
        }
        else {
            await prisma_1.prisma.user.update({
                where: { id: user.id },
                data: { isApproved: action === "approve" },
            });
        }
        if (action === "approve") {
            await (0, mail_1.sendApprovalEmail)(user.email, user.name, user.email);
        }
        const appUrl = process.env.APP_BASE_URL || "https://www.ucdksea.com";
        res
            .setHeader("Content-Type", "text/html; charset=utf-8")
            .send(`<!doctype html><meta charset="utf-8">
        <meta http-equiv="refresh" content="2;url=${appUrl}">
        <title>${action === "approve" ? "Approved ✅" : "Declined 🚫"}</title>
        <div style="font:14px system-ui;padding:40px">
          ${action === "approve" ? "Approved" : "Declined"}. Redirecting…
        </div>`);
    }
    catch (e) {
        res.status(400).send(`Invalid or expired link. (${e?.message || "error"})`);
    }
});
exports.default = router;
