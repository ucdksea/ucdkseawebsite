// backend/routes/dev.js
import express from "express";
import { mailer } from "../lib/mail.js"; // 확장자 .js 필수(ESM)

const router = express.Router();

router.get("/env", (_req, res) => {
  res.json({
    ok: true,
    env: {
      NODE_ENV: process.env.NODE_ENV,
      SMTP_HOST: process.env.SMTP_HOST,
      SMTP_PORT: process.env.SMTP_PORT,
      SMTP_USER: process.env.SMTP_USER ? "(set)" : "",
      FROM_EMAIL: process.env.FROM_EMAIL,
      APP_BASE_URL: process.env.APP_BASE_URL,
      APP_LOGIN_URL: process.env.APP_LOGIN_URL,
    },
  });
});

router.get("/test-email", async (_req, res) => {
  try {
    const from = process.env.FROM_EMAIL || process.env.SMTP_USER;
    const to = process.env.SMTP_USER;
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
