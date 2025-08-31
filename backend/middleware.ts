// backend/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // --- 토큰 우회: Authorization / X-Admin-Token / ?token= ---
  const bearer = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim() ?? "";
  const header = req.headers.get("x-admin-token")?.trim() ?? "";
  const qp     = searchParams.get("token")?.trim() ?? "";
  const got    = bearer || header || qp;

  const want = (process.env.ADMIN_TOKEN ?? "").trim();

  // posts 라우트들에만 우회 적용
  const isAdminPosts = pathname === "/api/admin/posts" || pathname.startsWith("/api/admin/posts/");

  if (isAdminPosts && got && want && got === want) {
    const res = NextResponse.next();
    res.headers.set("x-debug-mw", "bypass"); // 디버그 표식
    return res;
  }

  // --- API는 여기서 끝. (우회 여부 판단만 하고 나감)
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // --- 정적 HTML 매핑 (프론트 라우팅)
  const map: Record<string, string> = {
    "/": "/index.html",
    "/event": "/event.html",
    "/officer": "/officer.html",
    "/gm": "/gm.html",
    "/faq": "/faq.html",
    "/join": "/join.html",
    "/login": "/login.html",
    "/post": "/post.html",
    "/admin": "/post.html",
  };

  const target = map[pathname];
  if (target) {
    return NextResponse.rewrite(new URL(target, req.url));
  }

  return NextResponse.next();
}

// 이 경로들만 인터셉트
export const config = {
  matcher: [
    "/", "/event", "/officer", "/gm", "/faq", "/join", "/login", "/admin", "/post",
    // ✅ 토큰 우회를 위해 posts API도 미들웨어에 태운다
    "/api/admin/posts/:path*",
  ],
};
