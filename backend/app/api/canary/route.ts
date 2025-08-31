export const runtime = 'nodejs';
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    ok: true,
    cwd: process.cwd(),
    file: '/app/api/canary/route.ts'
  });
}
