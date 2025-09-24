// lib/auth.ts
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

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

/** 쿠키 설정 (Express) */
export function setAuthCookie(res: Response, token: string) {
  res.cookie("auth", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7 * 1000, // 7d (ms)
  });
}

/** 쿠키에서 JWT 파싱 (Express) */
export function getAuthFromCookie(req: Request): JwtPayload | null {
  const token = req.cookies?.auth as string | undefined;
  if (!token) return null;
  return verifyToken(token);
}

export function clearAuthCookie(res: Response) {
  res.clearCookie("auth", { path: "/" });
}
