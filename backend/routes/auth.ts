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

    // (옵션) 도메인 제한
    const allowed = (process.env.ALLOWED_EMAIL_DOMAINS || "")
      .split(",")
      .map(s => s.trim().toLowerCase())
      .filter(Boolean);
    const domain = (email.split("@")[1] || "").toLowerCase();
    if (allowed.length && !allowed.includes(domain)) {
      return res.status(400).json({ ok: false, error: "Please use allowed email domain" });
    }

    // 중복 체크
    const dup = await prisma.user.findUnique({ where: { email } });
    if (dup) {
      return res.status(409).json({ ok: false, error: "Email already registered" });
    }

    // 패스워드 해시
    const passwordHash = await bcrypt.hash(password, 10);

    // ✨ DB에 "승인 대기" 상태로 사용자 생성
    const created = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        isApproved: false,
      },
      select: { id: true, name: true, email: true }
    });

    // 운영진에게 승인/거절 메일 전송 (토큰에 created.id 포함)
    const admins = process.env.ADMIN_EMAILS || process.env.SMTP_USER || "";
    await sendAdminNewRegistration(admins, created);

    return res.json({ ok: true, message: "Registration submitted" });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || "Internal error" });
  }
});

router.post("/login", async (_req, res) => {
  // TODO: 로그인 구현 (isApproved 체크 포함)
  res.json({ ok: true });
});

export default router;
