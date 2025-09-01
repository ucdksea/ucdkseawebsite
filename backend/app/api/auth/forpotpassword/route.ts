///Users/stephanie/Desktop/ucdksea-website/backend/app/api/auth/forpotpassword/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { db } from "@/lib/db"; 

export async function POST(req: Request) {
  const { email } = await req.json();

  // 유저 이메일 계정 확인
  const user = await db.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: "No user with that email" }, { status: 404 });

  // 랜덤 6 digit 비번
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // Temporary password 15분 동안 유용
  await db.verificationCode.create({
    data: {
      email,
      code,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), 
    },
  });

  // nodemailer로 비번 보내기
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Password Reset Code",
    text: `Your reset code is: ${code}`,
  });

  return NextResponse.json({ success: true });
}