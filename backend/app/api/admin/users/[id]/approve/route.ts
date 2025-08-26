// app/api/admin/users/[id]/approve/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendApprovalEmail } from "@/lib/mail";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const user = await prisma.user.update({
    where: { id: params.id },
    data: { isApproved: true },
    select: { id: true, email: true, name: true },
  });

  try {
    await sendApprovalEmail(user.email, user.name, user.email);
  } catch (e) {
    console.error("approval mail error:", e);
  }

  return NextResponse.json({ ok: true, user });
}
