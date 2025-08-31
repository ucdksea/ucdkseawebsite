// app/api/auth/logout/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  cookies().set("uid", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,        // 즉시 만료
  });
  return NextResponse.json({ ok: true });
}
