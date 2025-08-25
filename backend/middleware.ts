import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  if (path.startsWith("/api/quotes")) {
    const hasAuth = req.cookies.get("auth")?.value;
    if (!hasAuth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.next();
}

// export const config = { matcher: ["/api/quotes/:path*"] };
