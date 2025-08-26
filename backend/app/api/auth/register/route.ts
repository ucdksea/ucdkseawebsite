// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { registerSchema, type RegisterPayload } from "@/lib/validations";
import { sendAdminNewRegistration } from "@/lib/mail";

export const runtime = "nodejs";

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ?? "http://127.0.0.1:5501";
const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  Vary: "Origin",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as unknown;
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: parsed.error.flatten() },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const { email, password, name }: RegisterPayload = parsed.data;

    const exists = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (exists) {
      return NextResponse.json(
        { error: "Email already in use." },
        { status: 409, headers: CORS_HEADERS }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { email, name, passwordHash, isApproved: false },
      select: { id: true, email: true, name: true, isApproved: true },
    });

    try {
      const admins = process.env.ADMIN_EMAILS || "";
      await sendAdminNewRegistration(admins, {
        id: user.id,
        name: user.name!,
        email: user.email,
      });
    } catch (e) {
      console.error("mail error(admin notify):", e);
    }

    return NextResponse.json({ user }, { status: 201, headers: CORS_HEADERS });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500, headers: CORS_HEADERS });
  }
}
