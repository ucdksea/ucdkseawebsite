// app/api/admin/posts/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "lib/prisma";

const ALLOWED = (process.env.ALLOWED_ORIGINS ?? "http://127.0.0.1:5501,http://localhost:5501")
  .split(",").map(s => s.trim()).filter(Boolean);

function cors(origin: string | null) {
  const h: Record<string,string> = {
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Vary": "Origin",
  };
  if (origin && ALLOWED.includes(origin)) {
    h["Access-Control-Allow-Origin"] = origin;
    h["Access-Control-Allow-Credentials"] = "true";
  }
  return h;
}

export async function OPTIONS(req: Request) {
  return new NextResponse(null, { status: 204, headers: cors(req.headers.get("origin")) });
}

export async function GET(req: Request) {
  const origin = req.headers.get("origin");
  const headers = cors(origin);
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") as any;
  const active = searchParams.get("active");

  const posts = await prisma.post.findMany({
    where: {
      ...(type ? { type } : {}),
      ...(active ? { active: active === "1" || active === "true" } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ posts }, { status: 200, headers });
}

// 생성
export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  const headers = cors(origin);

  // 간단한 인증(로그인 + 승인)
  const uid = cookies().get("uid")?.value || null;
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers });
  const me = await prisma.user.findUnique({ where: { id: uid }, select: { isApproved: true } });
  if (!me?.isApproved) return NextResponse.json({ error: "Forbidden" }, { status: 403, headers });

  const body = await req.json();
  const { type } = body as { type?: string };
  if (!type) return NextResponse.json({ error: "type required" }, { status: 400, headers });

  // 타입별 검증/매핑
  let data: any = { type, active: true };

  switch (type) {
    case "POPUP": {
      // index popup: 구글폼 링크 + 포스터 이미지
      const { imageUrl, linkUrl } = body;
      if (!imageUrl) return NextResponse.json({ error: "imageUrl required" }, { status: 400, headers });
      if (!linkUrl)  return NextResponse.json({ error: "linkUrl required" },  { status: 400, headers });
      data.imageUrl = imageUrl;
      data.linkUrl  = linkUrl;
      break;
    }

    case "GM": {
      // gm 카드: 사진 + 캡션(title: "YYYY Spring General Members")
      const { imageUrl, title } = body;
      if (!imageUrl) return NextResponse.json({ error: "imageUrl required" }, { status: 400, headers });
      if (!title)    return NextResponse.json({ error: "title required" },    { status: 400, headers });
      data.imageUrl = imageUrl;
      data.title    = title;
      break;
    }

    case "EVENT_POLAROID": {
      // 폴라로이드: 썸네일(활동사진) + posterUrl + instagramUrl + 제목/학기/년/날짜/설명(한/영)
      const { imageUrl, posterUrl, instagramUrl, title, semester, year, date, descKo, descEn } = body;
      if (!imageUrl) return NextResponse.json({ error: "imageUrl required" }, { status: 400, headers });
      if (!title)    return NextResponse.json({ error: "title required" },    { status: 400, headers });
      data.imageUrl = imageUrl;
      data.title    = title;
      if (date) {
        const d = new Date(date);
        if (isNaN(d.getTime())) return NextResponse.json({ error: "Bad date" }, { status: 400, headers });
        data.date = d;
      }
      data.descKo = descKo ?? null;
      data.descEn = descEn ?? null;
      data.meta = {
        posterUrl: posterUrl || null,
        instagramUrl: instagramUrl || null,
        semester: semester || null,  // "Spring" 등
        year: year || null,          // "2025"
      };
      break;
    }

    case "EVENT_UPCOMING": {
      // upcmoing: 포스터 이미지 + 구글폼 링크 + 설명(ko/en 중 택)
      const { imageUrl, linkUrl, descKo, descEn } = body;
      if (!imageUrl) return NextResponse.json({ error: "imageUrl required" }, { status: 400, headers });
      if (!linkUrl)  return NextResponse.json({ error: "linkUrl required" },  { status: 400, headers });
      data.imageUrl = imageUrl;
      data.linkUrl  = linkUrl;
      data.descKo   = descKo ?? null;
      data.descEn   = descEn ?? null;
      break;
    }

    case "OFFICER": {
      // officer: 영문/한글 이름 + 직책 + 사진 + linkedin
      const { imageUrl, enName, koName, role, linkedin } = body;
      if (!imageUrl) return NextResponse.json({ error: "imageUrl required" }, { status: 400, headers });
      if (!enName || !koName || !role) return NextResponse.json({ error: "enName/koName/role required" }, { status: 400, headers });
      data.imageUrl = imageUrl;
      data.title    = `${enName} | ${koName}`;
      data.meta     = { enName, koName, role, linkedin: linkedin || null };
      break;
    }

    default:
      return NextResponse.json({ error: "Unknown type" }, { status: 400, headers });
  }

  const post = await prisma.post.create({ data });
  return NextResponse.json({ ok: true, post }, { status: 201, headers });
}
