// routes/dev.ts
import express from "express";
import { mailer } from "../lib/mail";

const router = express.Router();

// env 확인
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
    },
  });
});

// SMTP verify만 (이건 메일 안보냄)
router.get("/ping-mail", async (_req, res) => {
  try {
    await mailer.verify();
    res.json({ ok: true, msg: "SMTP verify OK" });
  } catch (err: any) {
    console.error("[DEV][ping-mail] verify fail:", err?.message || err);
    res.status(500).json({ ok: false, error: err?.message || String(err) });
  }
});

// 실제 발송 테스트
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
    res.json({ ok: true, infoId: info.messageId || null });
  } catch (err: any) {
    console.error("[DEV][test-email] send fail:", err?.message || err);
    res.status(500).json({ ok: false, error: err?.message || String(err) });
  }
});

export default router;
