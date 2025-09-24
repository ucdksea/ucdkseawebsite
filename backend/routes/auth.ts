// routes/auth.ts
import express from "express";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { sendAdminNewRegistration } from "../lib/mail";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body || {};
    if (!email || !password || !name) {
      return res.status(400).json({ ok: false, error: "Missing fields" });
    }

    // (선택) 도메인 제한
    const allowed = (process.env.ALLOWED_EMAIL_DOMAINS || "")
      .split(",").map(s => s.trim()).filter(Boolean);
    if (allowed.length && !allowed.some(d => email.toLowerCase().endsWith(`@${d}`))) {
      return res.status(400).json({ ok: false, error: "Please use your organization email." });
    }

    // 중복 검사
    const existing = await prisma.user.findUnique({ where: { email }});
    if (existing) {
      return res.status(409).json({ ok: false, error: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // ✅ DB에 "대기" 유저 생성 (isApproved=false)
    const created = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        isApproved: false,
      },
      select: { id: true, name: true, email: true }
    });

    // ✅ 메일 토큰에 DB의 진짜 id를 담아 보냄
    const admins = process.env.ADMIN_EMAILS || process.env.SMTP_USER || "";
    await sendAdminNewRegistration(admins, created);

    return res.json({ ok: true, message: "Registration submitted" });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || "Internal error" });
  }
});

router.post("/login", async (_req, res) => {
  // TODO: 승인/비승인 체크 후 로그인 처리
  res.json({ ok: true });
});

export default router;
