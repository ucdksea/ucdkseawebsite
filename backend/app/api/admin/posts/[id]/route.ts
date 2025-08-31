// app/api/admin/posts/[id]/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

type Ctx = { params: { id: string } };

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

async function requireApproved(req: Request) {
  const origin = req.headers.get('origin');
  const headers = cors(origin);
  const uid = cookies().get('uid')?.value ?? null;
  if (!uid) return { ok:false as const, res: NextResponse.json({ error:'Unauthorized' }, { status:401, headers }) };
  const me = await prisma.user.findUnique({ where: { id: uid }, select: { isApproved: true } });
  if (!me?.isApproved) return { ok:false as const, res: NextResponse.json({ error:'Forbidden' }, { status:403, headers }) };
  return { ok:true as const, headers };
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
  if (!gate.ok) return gate.res;

  const { searchParams } = new URL(req.url);
  const hard = searchParams.get('hard') === '1';

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
        return { ok: true as const, mode: 'soft' as const, before, after: before };
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
      return NextResponse.json({ error: 'Not found' }, { status: 404, headers: gate.headers });
    }

    // 서버에서 최종 검증: after가 null(하드) 이거나 false(소프트) 여야 함
    return NextResponse.json(result, { headers: gate.headers });
  } catch (e: any) {
    return NextResponse.json({ error: 'Server error' }, { status: 500, headers: gate.headers });
  }
}
