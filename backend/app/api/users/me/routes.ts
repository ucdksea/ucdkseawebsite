// app/api/users/me/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// (A) NextAuth 쓰는 경우
import { auth } from "@/lib/auth"; // 없다면 (B) 버전 사용

// 안전 필드만 선택
const userSelect = {
  id: true,
  email: true,
  name: true,
  isApproved: true,
  createdAt: true,
  updatedAt: true,
};

export async function GET() {
  // (A) NextAuth
  const session = await auth().catch(() => null);
  const email = session?.user?.email;

  // (B) 만약 NextAuth가 없다면, 위 3줄 대신 이런 식으로 가져오세요:
  // import { cookies } from "next/headers";
  // const email = cookies().get("ucdksea_email")?.value;

  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: userSelect,
  });

  if (!user) return NextResponse.json({ error: "Not Found" }, { status: 404 });
  return NextResponse.json(user, { status: 200 });
}

export const dynamic = "force-dynamic";
