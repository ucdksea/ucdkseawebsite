///Users/stephanie/Desktop/ucdksea-website/backend/app/api/auth/resetpassword/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { email, code, newPassword } = await req.json();

  // temporary 비번 받기
  const record = await db.verificationCode.findFirst({
    where: { email, code },
    orderBy: { createdAt: "desc" },
  });

  if (!record || record.expiresAt < new Date()) {
    return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // 새로운 비번 만들기
  await db.user.update({
    where: { email },
    data: { password: hashedPassword },
  });

  // temporary 비번 없애기
  await db.verificationCode.delete({ where: { id: record.id } });

  return NextResponse.json({ success: true });
}