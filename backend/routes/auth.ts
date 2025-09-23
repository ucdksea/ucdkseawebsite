// routes/auth.ts
import { Router, Request, Response } from "express";
import crypto from "crypto";
import { sendAdminNewRegistration } from "../lib/mail";
import { appendAuditEvent } from "../lib/audit";

const router = Router();

router.post("/api/auth/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ ok:false, error:"Missing fields" });
    }

    // (선택) 허용 도메인 제한
    const allowed = (process.env.ALLOWED_EMAIL_DOMAINS || "")
      .split(",").map(s=>s.trim().toLowerCase()).filter(Boolean);
    const domain = String(email).split("@")[1]?.toLowerCase() || "";
    if (allowed.length && !allowed.includes(domain)) {
      return res.status(400).json({ ok:false, error:"Not allowed email domain" });
    }

    // TODO: 실제 DB 저장/중복검사/비밀번호 해시
    const user = { id: crypto.randomUUID(), name, email, status: "PENDING" };

    // 감사 로그
    await appendAuditEvent({
      action: "SIGNUP_REQUEST",
      targetType: "USER",
      targetId: user.id,
      title: name,
      summary: `Signup requested (${email})`,
      severity: 1,
    });

    // 운영진 메일 리스트
    const adminList = (process.env.ADMIN_EMAILS || "")
      .split(",").map(s=>s.trim()).filter(Boolean);

    // 운영진에게 승인/거절 링크 포함 메일 발송
    try {
      if (adminList.length) {
        await sendAdminNewRegistration(adminList, {
          id: user.id, name: user.name, email: user.email
        });
        console.log("[MAIL] sent admin new registration ->", adminList.join(", "));
      } else {
        console.warn("[MAIL] ADMIN_EMAILS not set — skipped admin notify");
      }
    } catch (e:any) {
      console.error("[MAIL][admin new registration] failed:", e?.message || e);
    }

    return res.json({ ok:true, message:"Registration submitted. Await admin approval.", userId: user.id });
  } catch (err:any) {
    console.error("[REGISTER] error:", err?.message || err);
    return res.status(500).json({ ok:false, error:"Server error" });
  }
});

export default router;
