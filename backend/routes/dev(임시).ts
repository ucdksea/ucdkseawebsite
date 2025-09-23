// routes/dev.ts
import express from "express";
import { mailer } from "../lib/mail";

const router = express.Router();

// 환경변수 확인 (그대로 유지)
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

// SMTP 연결 확인 (메일 안보냄)
router.get("/ping-mail", async (_req, res) => {
  try {
    await mailer.verify();
    res.json({ ok: true, msg: "SMTP verify OK" });
  } catch (err: any) {
    res.status(500).json({
      ok: false,
      code: err?.code,
      name: err?.name,
      message: err?.message,
      response: err?.response,
      command: err?.command,
    });
  }
});

// 실제 발송 테스트 (에러 상세 전부 반환)
router.get("/test-email", async (_req, res) => {
  try {
    const from = process.env.FROM_EMAIL || process.env.SMTP_USER!;
    const to = process.env.SMTP_USER!; // 자기 자신으로 보내기(가장 안전)
    const info = await mailer.sendMail({
      from,
      to,
      subject: "[UCD KSEA] Test Email",
      text: "If you can read this, SMTP is working 🎉",
    });
    res.json({ ok: true, messageId: info.messageId || null, envelope: info.envelope });
  } catch (err: any) {
    res.status(500).json({
      ok: false,
      code: err?.code,
      name: err?.name,
      message: err?.message,
      response: err?.response,
      responseCode: err?.responseCode,
      command: err?.command,
    });
  }
});

export default router;
