// app/api/users/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  // 의도된 차단: 더 이상 내부 로직 실행 X
  return NextResponse.json({ ok: false }, { status: 404 });
}
export const dynamic = "force-dynamic";
