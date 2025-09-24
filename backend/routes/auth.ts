import express from "express";
import crypto from "crypto";
import { sendAdminNewRegistration } from "../lib/mail.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body || {};
    if (!email || !password || !name) {
      return res.status(400).json({ ok: false, error: "Missing fields" });
    }

    // 여기서 실제 DB 저장/중복체크…(생략). 일단 ID는 임시로 생성
    const id = crypto.randomUUID();

    // 운영진에게 알림 메일 보내기
    const admins = process.env.ADMIN_EMAILS || process.env.SMTP_USER || "";
    await sendAdminNewRegistration(admins, { id, name, email });

    // 사용자에겐 “등록 접수”만 알리고 끝 (승인되면 따로 sendApprovalEmail 호출)
    return res.json({ ok: true, message: "Registration submitted" });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || "Internal error" });
  }
  res.json({ ok: true });
});
router.post("/login", async (req, res) => {
    // 로그인 처리 로직
    res.json({ ok: true });
  });
export default router;
