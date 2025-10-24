// app/api/users/route.ts
import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({ ok: false }, { status: 403 });
}
export const dynamic = "force-dynamic";
