// app/api/_debug/prisma/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const keys = Object.keys(prisma as any).filter(k => !k.startsWith("$"));
  const hasAuditEvent = typeof (prisma as any).auditEvent?.findMany === "function";
  return NextResponse.json({ keys, hasAuditEvent });
}
