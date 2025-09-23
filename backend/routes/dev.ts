// backend/routes/dev.ts
import express, { Request, Response } from "express";

import { mailer } from "../lib/mail";

const router = express.Router();

router.get("/env", (_req: Request, res: Response) =>{
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

router.get("/test-email", async (_req, res) => {
  try {
    const info = await mailer.sendMail({
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to: process.env.SMTP_USER, // 자기 자신
      subject: "[UCD KSEA] Test Email",
      text: "If you can read this, SMTP is working 🎉",
    });
    res.json({ ok: true, info });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
