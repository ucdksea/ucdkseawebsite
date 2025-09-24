// lib/req.ts
import crypto from "crypto";
import type { Request } from "express";
import { prisma } from "./prisma";

export function getRequestId(req?: Request) {
  return (
    (req?.headers["x-request-id"] as string) ||
    "req_" + crypto.randomBytes(6).toString("hex")
  );
}

export function getClientIp(req?: Request) {
  const fwd = (req?.headers["x-forwarded-for"] as string) || "";
  const fromFwd = fwd.split(",")[0]?.trim();
  return fromFwd || (req as any)?.ip || (req as any)?.socket?.remoteAddress || "";
}

export async function getActor(req?: Request): Promise<string> {
  try {
    const uid = (req as any)?.cookies?.uid;
    if (!uid) return "anonymous";
    const user = await prisma.user.findUnique({
      where: { id: uid },
      select: { email: true }
    });
    return user?.email || uid;
  } catch {
    return "anonymous";
  }
}
