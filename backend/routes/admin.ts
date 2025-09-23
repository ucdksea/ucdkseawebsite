// routes/admin.ts
import { Router, Request, Response } from "express";
import { verifyAdminActionToken, sendApprovalEmail } from "../lib/mail";
import { appendAuditEvent } from "../lib/audit";

const router = Router();

router.get("/api/admin/users/action", async (req: Request, res: Response) => {
  try {
    const token = String(req.query.token || "");
    if (!token) return res.status(400).send("Missing token");

    const payload = verifyAdminActionToken(token); // { action, user:{id,name,email} }
    const { action, user } = payload;

    // TODO: 여기서 실제 DB 조회/상태 변경
    // const found = await prisma.user.findUnique({ where:{ id: user.id }});
    // if (!found) return res.status(404).send("User not found");
    // if (action === "approve") { await prisma.user.update({ where:{ id:user.id }, data:{ status:"APPROVED" }}) }
    // else { await prisma.user.update({ where:{ id:user.id }, data:{ status:"DECLINED" }}) }

    await appendAuditEvent({
      action: action === "approve" ? "APPROVE" : "REJECT",
      targetType: "USER",
      targetId: user.id,
      title: user.name,
      summary: `${action.toUpperCase()} by admin link`,
      severity: 1,
    });

    if (action === "approve") {
      try {
        await sendApprovalEmail(user.email, user.name, user.email);
        console.log("[MAIL] sent approval email to", user.email);
      } catch (e:any) {
        console.error("[MAIL][approval] failed:", e?.message || e);
      }
      return res.send("Approved ✔ — The user has been notified by email.");
    } else {
      return res.send("Declined ✖");
    }
  } catch (err:any) {
    console.error("[ADMIN ACTION] error:", err?.message || err);
    return res.status(400).send("Invalid or expired link");
  }
});

export default router;
