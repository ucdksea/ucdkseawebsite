// app/api/admin/posts/[id]/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
// import { revalidateTag, revalidatePath } from 'next/cache'; // 캐시 무효화가 필요하면 사용

type Ctx = { params: { id: string } };

/* ─────────────────────────── CORS ─────────────────────────── */
const DEFAULT_ALLOWED = [
  'http://127.0.0.1:3000',
  'http://localhost:3000',
  'http://127.0.0.1:5501',
  'http://localhost:5501',
  'https://ucdksea.com',
];
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? DEFAULT_ALLOWED.join(','))
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

function corsHeaders(origin: string | null) {
  const h: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token',
    'Access-Control-Max-Age': '600',
    Vary: 'Origin',
  };
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    h['Access-Control-Allow-Origin'] = origin;
    h['Access-Control-Allow-Credentials'] = 'true';
  }
  return h;
}

function withCors<T extends BodyInit | null>(
  body: T,
  init: ResponseInit & { origin?: string | null } = {}
) {
  const headers = { ...(init.headers || {}), ...corsHeaders(init.origin ?? null) };
  return new NextResponse(body, { ...init, headers });
}

export async function OPTIONS(req: Request) {
  return withCors(null, { status: 204, origin: req.headers.get('origin') });
}

/* ──────────────── 인증(로그인/회원가입은 기존 라우트 유지) ────────────────
   - 이 파일은 "삭제/조회" 라우트이며, 접근은 승인된 officer만 허용
   - 로그인은 /api/auth/login, 회원가입은 /api/auth/signup 에서 처리
   - 여기서는 그 결과로 셋된 uid 쿠키만 확인
*/
async function requireApprovedOfficer(req: Request) {
  const origin = req.headers.get('origin');
  const headers = corsHeaders(origin);

  const uid = cookies().get('uid')?.value ?? null;
  if (!uid) {
    return { ok: false as const, resp: NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers }) };
  }

  // 사용자 승인 여부 검사 (isApproved가 true여야 함)
  const me = await prisma.user.findUnique({
    where: { id: uid },
    select: { id: true, isApproved: true, role: true }, // role이 있으면 참고용
  });

  if (!me?.isApproved) {
    return { ok: false as const, resp: NextResponse.json({ error: 'Forbidden' }, { status: 403, headers }) };
  }

  return { ok: true as const, headers, user: me };
}

/* ───────────────────────── 단건 조회(관리자 확인용) ───────────────────────── */
export async function GET(req: Request, { params }: Ctx) {
  const gate = await requireApprovedOfficer(req);
  if (!gate.ok) return gate.resp;

  try {
    const post = await prisma.post.findUnique({ where: { id: params.id } });
    if (!post) {
      return NextResponse.json({ error: 'Not found' }, { status: 404, headers: gate.headers });
    }
    return NextResponse.json(post, { headers: gate.headers });
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500, headers: gate.headers });
  }
}

/* ───────── 삭제: 기본 소프트삭제(active=false), ?hard=1 시 하드삭제 ───────── */
export async function DELETE(req: Request, { params }: Ctx) {
  const gate = await requireApprovedOfficer(req);
  if (!gate.ok) return gate.resp;

  const { searchParams } = new URL(req.url);
  const hard = searchParams.get('hard') === '1';

  try {
    if (hard) {
      await prisma.post.delete({ where: { id: params.id } });
      // revalidateTag('posts');  // 태그 캐시를 쓰는 경우
      // revalidatePath('/officer'); // 페이지 캐시를 쓰는 경우
      return NextResponse.json({ ok: true, mode: 'hard' }, { headers: gate.headers });
    }

    const updated = await prisma.post.update({
      where: { id: params.id },
      data: { active: false },
      select: { id: true, active: true },
    });

    // revalidateTag('posts');
    // revalidatePath('/officer');
    return NextResponse.json({ ok: true, mode: 'soft', post: updated }, { headers: gate.headers });
  } catch (e: any) {
    // Prisma: P2025 (Record not found) 등
    return NextResponse.json({ error: 'Not found' }, { status: 404, headers: gate.headers });
  }
}
