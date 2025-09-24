import express from "express";
import { mailer } from "../lib/mail.js"; // ← 확장자 .js (NodeNext에서 TS에도 .js로 씁니다)

const router = express.Router();

router.get("/env", (_req, res) => {
  res.json({
    ok: true,
    env: {
      SMTP_HOST: process.env.SMTP_HOST,
      SMTP_PORT: process.env.SMTP_PORT,
      SMTP_USER: process.env.SMTP_USER ? "(set)" : "",
      FROM_EMAIL: process.env.FROM_EMAIL,
      APP_BASE_URL: process.env.APP_BASE_URL,
      APP_LOGIN_URL: process.env.APP_LOGIN_URL,
      NODE_ENV: process.env.NODE_ENV,
    },
  });
});

// 실제 메일 발송 테스트
router.get("/test-email", async (_req, res) => {
  try {
    const from = process.env.FROM_EMAIL || process.env.SMTP_USER!;
    const to = process.env.SMTP_USER!;
    const info = await mailer.sendMail({
      from,
      to,
      subject: "[UCD KSEA] Test Email",
      text: "If you can read this, SMTP is working 🎉",
    });
    res.json({ ok: true, messageId: info?.messageId || "(no id)" });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err?.message || String(err) });
  }
});

export default router;
