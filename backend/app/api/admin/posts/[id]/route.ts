// app/api/admin/posts/[id]/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
// 🔹 감사 로그 유틸 추가
import { appendAuditEvent } from '@/lib/audit';
import { getRequestId, getClientIp, getActor } from '@/lib/req';


type Ctx = { params: { id: string } };
// ── 공통 타입들 ─────────────────────────────────────────────────────────────
type HeadersMap = Record<string, string>;

type Gate =
  | { ok: true; headers: HeadersMap }
  | { ok: false; headers: HeadersMap; res: NextResponse };

type BeforeAfter = { id: string; type: string; active: boolean };

// 트랜잭션 결과(소프트/하드/없음) – noChange는 선택 필드로 포함
type TxResult =
  | { notFound: true }
  | { ok: true; mode: 'hard'; before: BeforeAfter; after: null }
  | { ok: true; mode: 'soft'; before: BeforeAfter; after: BeforeAfter; noChange?: true };

// ── CORS ───────────────────────────────────────────────────────────────────

const DEFAULT_ALLOWED = [
  'http://127.0.0.1:3000',
  'http://localhost:3000',
  'http://127.0.0.1:5501',
  'http://localhost:5501',
  'https://ucdksea.com',
];
const ALLOWED = (process.env.ALLOWED_ORIGINS ?? DEFAULT_ALLOWED.join(','))
  .split(',').map(s=>s.trim()).filter(Boolean);

function cors(origin: string | null) {
  const h: Record<string,string> = {
    'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token',
    'Access-Control-Max-Age': '600',
    Vary: 'Origin',
    'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
    Pragma: 'no-cache',
    Expires: '0',
  };
  if (origin && ALLOWED.includes(origin)) {
    h['Access-Control-Allow-Origin'] = origin;
    h['Access-Control-Allow-Credentials'] = 'true';
  }
  return h;
}

async function requireApproved(req: Request): Promise<Gate> {
  const origin = req.headers.get('origin');
  const headers = cors(origin);
  const uid = cookies().get('uid')?.value ?? null;

  if (!uid) {
    return { ok: false, headers, res: NextResponse.json({ error:'Unauthorized' }, { status:401, headers }) };
  }
  const me = await prisma.user.findUnique({ where: { id: uid }, select: { isApproved: true } });
  if (!me?.isApproved) {
    return { ok: false, headers, res: NextResponse.json({ error:'Forbidden' }, { status:403, headers }) };
  }
  return { ok: true, headers };
}

export async function OPTIONS(req: Request) {
  return new NextResponse(null, { status: 204, headers: cors(req.headers.get('origin')) });
}

export async function GET(req: Request, { params }: Ctx) {
  const gate = await requireApproved(req);
  if (!gate.ok) return gate.res;
  const post = await prisma.post.findUnique({ where: { id: params.id } });
  if (!post) return NextResponse.json({ error:'Not found' }, { status:404, headers: gate.headers });
  return NextResponse.json(post, { headers: gate.headers });
}

export async function DELETE(req: Request, { params }: Ctx) {
  const gate = await requireApproved(req);
  if (!gate.ok) {
    try {
      const requestId = getRequestId();
      const ip = getClientIp();
      const actor = await getActor();
      await appendAuditEvent({
        actorId: actor ?? 'anonymous',
        actorIp: ip,
        requestId,
        action: 'DELETE',
        targetType: 'POST',
        targetId: params.id,
        title: 'Post delete blocked',
        summary: `BLOCKED: ${gate.res.status === 401 ? 'Unauthorized' : 'Forbidden'}`,
        severity: 2,
      });
    } catch {}
   return gate.res; // ← 이 줄은 if 블록 내부에 유지
  }

  const { searchParams } = new URL(req.url);
  const hard = searchParams.get('hard') === '1';
  // 🔹 공통 메타
  const requestId = getRequestId();
  const ip = getClientIp();
  const actor = await getActor();

  try {
    const result = await prisma.$transaction(async (tx) => {
      const before = await tx.post.findUnique({
        where: { id: params.id },
        select: { id: true, active: true, type: true }
      });
      if (!before) return { notFound: true as const };

      if (hard) {
        await tx.post.delete({ where: { id: params.id } });
        return { ok: true as const, mode: 'hard' as const, before, after: null };
      }

      if (before.active === false) {
        return { ok: true as const, mode: 'soft' as const, before, after: before, noChange: true as const };
      }

      const updated = await tx.post.update({
        where: { id: params.id },
        data: { active: false },
        select: { id: true, active: true }
      });

      const after = await tx.post.findUnique({
        where: { id: params.id },
        select: { id: true, active: true }
      });

      return { ok: true as const, mode: 'soft' as const, before, updated, after };
    });

    if ('notFound' in result) {
      // 🔹 감사 로그: Not Found
      try {
        await appendAuditEvent({
          actorId: actor ?? 'anonymous',
          actorIp: ip,
          requestId,
          action: 'DELETE',
          targetType: 'POST',
          targetId: params.id,
          title: 'Post delete failed',
          summary: 'FAILED: Not found',
          severity: 2,
        });
      } catch {}
      return NextResponse.json({ error: 'Not found' }, { status: 404, headers: gate.headers });
    }
    // 🔹 감사 로그: 성공 케이스(하드/소프트)
    try {
      if (result.mode === 'hard') {
        await appendAuditEvent({
          actorId: actor ?? 'anonymous',
          actorIp: ip,
          requestId,
          action: 'DELETE',
          targetType: 'POST',
          targetId: result.before.id,
          title: 'Post hard delete',
          summary: `type=${result.before.type}`,
          changes: [{ field: 'post', kind: 'delete', to: null }],
          severity: 2, // 데이터 영구 삭제 → 중요도 높게
        });
      } else {
        // soft delete
        await appendAuditEvent({
          actorId: actor ?? 'anonymous',
          actorIp: ip,
          requestId,
          action: 'DELETE',
          targetType: 'POST',
          targetId: result.before.id,
          title: result.noChange ? 'Post soft delete (noop)' : 'Post soft delete',
          summary: result.noChange ? 'Already inactive' : 'active -> false',
          changes: result.noChange
            ? [{ field: 'active', kind: 'noop', to: false }]
            : [{ field: 'active', kind: 'change', to: false }],
          severity: 1,
        });
      }
    } catch {}

    // 서버에서 최종 검증: after가 null(하드) 이거나 false(소프트) 여야 함
    return NextResponse.json(result, { headers: gate.headers });
  } catch (e: any) {
    // 🔹 감사 로그: 서버 예외
    try {
      await appendAuditEvent({
        actorId: actor ?? 'anonymous',
        actorIp: ip,
        requestId,
        action: 'DELETE',
        targetType: 'POST',
        targetId: params.id,
        title: 'Post delete failed',
        summary: `FAILED: ${e?.message ?? 'Server error'}`,
        severity: 3,
      });
    } catch {}
    return NextResponse.json({ error: 'Server error' }, { status: 500, headers: gate.headers });
  }
}
