// backend/routes/dev.js
import express from "express";
import { mailer } from "../lib/mail.js"; // ✨ 확장자 .js 필수

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

router.get("/test-email", async (_req, res) => {
  try {
    const from = process.env.FROM_EMAIL || process.env.SMTP_USER;
    const to = process.env.SMTP_USER; // 본인에게 테스트 발송
    const info = await mailer.sendMail({
      from,
      to,
      subject: "[UCD KSEA] Test Email",
      text: "If you can read this, SMTP is working 🎉",
    });
    res.json({ ok: true, messageId: info?.messageId || "(no id)" });
  } catch (err) {
    res.status(500).json({ ok: false, error: err?.message || String(err) });
  }
});

export default router;
