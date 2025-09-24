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

    // 이미 존재하면 에러
    const dup = await prisma.user.findUnique({ where: { email } });
    if (dup) return res.status(409).json({ ok: false, error: "Email already registered" });

    const id = crypto.randomUUID();
    const passwordHash = await bcrypt.hash(password, 10);

    // DB에 "승인대기"로 저장
    await prisma.user.create({
      data: {
        id,
        email,
        name,
        passwordHash,
        isApproved: false,
      },
    });

    // 운영진 알림 메일
    const admins = process.env.ADMIN_EMAILS || process.env.SMTP_USER || "";
    await sendAdminNewRegistration(admins, { id, name, email });

    return res.json({ ok: true, message: "Registration submitted" });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || "Internal error" });
  }
});

export default router;
