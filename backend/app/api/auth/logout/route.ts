// app/api/auth/logout/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";

export async function POST() {
  await clearAuthCookie();
  return NextResponse.json({ ok: true });
}
