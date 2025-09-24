"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/admin.ts
const express_1 = require("express");
const mail_1 = require("../lib/mail");
const audit_1 = require("../lib/audit");
const router = (0, express_1.Router)();
router.get("/api/admin/users/action", async (req, res) => {
    try {
        const token = String(req.query.token || "");
        if (!token)
            return res.status(400).send("Missing token");
        const payload = (0, mail_1.verifyAdminActionToken)(token); // { action, user:{id,name,email} }
        const { action, user } = payload;
        // TODO: 여기서 실제 DB 조회/상태 변경
        // const found = await prisma.user.findUnique({ where:{ id: user.id }});
        // if (!found) return res.status(404).send("User not found");
        // if (action === "approve") { await prisma.user.update({ where:{ id:user.id }, data:{ status:"APPROVED" }}) }
        // else { await prisma.user.update({ where:{ id:user.id }, data:{ status:"DECLINED" }}) }
        await (0, audit_1.appendAuditEvent)({
            action: action === "approve" ? "APPROVE" : "REJECT",
            targetType: "USER",
            targetId: user.id,
            title: user.name,
            summary: `${action.toUpperCase()} by admin link`,
            severity: 1,
        });
        if (action === "approve") {
            try {
                await (0, mail_1.sendApprovalEmail)(user.email, user.name, user.email);
                console.log("[MAIL] sent approval email to", user.email);
            }
            catch (e) {
                console.error("[MAIL][approval] failed:", e?.message || e);
            }
            return res.send("Approved ✔ — The user has been notified by email.");
        }
        else {
            return res.send("Declined ✖");
        }
    }
    catch (err) {
        console.error("[ADMIN ACTION] error:", err?.message || err);
        return res.status(400).send("Invalid or expired link");
    }
});
exports.default = router;
