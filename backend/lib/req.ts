// lib/req.ts
import { headers, cookies } from "next/headers";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export function getRequestId() {
  const h = headers();
  return h.get("x-request-id") || "req_" + crypto.randomBytes(6).toString("hex");
}

export function getClientIp() {
  const h = headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    ""
  );
}

// 🔹 로그인 시 세팅한 uid 쿠키 기준으로 배우자 식별
export async function getActor(): Promise<string> {
  try {
    const uid = cookies().get("uid")?.value;
    if (!uid) return "anonymous";
    // 이메일을 선호(이력/감사에서 식별이 더 명확)
    const user = await prisma.user.findUnique({
      where: { id: uid },
      select: { email: true },
    });
    return user?.email || uid;
  } catch {
    return "anonymous";
  }
}
