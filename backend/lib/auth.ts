// lib/auth.ts
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { sendAdminNewRegistration } from "../lib/mail"; 

const JWT_SECRET = process.env.JWT_SECRET!;
export type JwtPayload = { uid: string; email: string };

export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export async function setAuthCookie(token: string) {
  const jar = await cookies();
  jar.set("auth", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7d
  });
}

export async function getAuthFromCookie(): Promise<JwtPayload | null> {
  const jar = await cookies();
  const token = jar.get("auth")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function clearAuthCookie() {
  const jar = await cookies();
  // delete 또는 만료로 제거
  jar.set("auth", "", { path: "/", maxAge: 0 });
  // or: jar.delete("auth");
}
