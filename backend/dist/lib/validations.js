"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postCreateSchema = exports.quoteUpdateSchema = exports.quoteCreateSchema = exports.registerSchema = void 0;
// lib/validations.ts
const zod_1 = require("zod"); // ← 하나만! (import z from "zod" 나 import * as z ... 있으면 삭제)
const allowed = (process.env.ALLOWED_EMAIL_DOMAINS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
// ✅ 이메일: 공백 제거 → email 포맷 체크 → 소문자 변환
// ✅ 비밀번호: 길이/문자 조합
// ✅ 이름: 먼저 trim 후 길이 체크 (공백만 입력하는 경우 방지)
exports.registerSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .trim()
        .email()
        .transform((v) => v.toLowerCase())
        .refine((v) => {
        if (!allowed.length)
            return true;
        const d = v.split("@")[1] ?? "";
        return allowed.includes(d);
    }, "Email domain not allowed"),
    password: zod_1.z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Za-z]/, "Password must include letters")
        .regex(/\d/, "Password must include numbers"),
    name: zod_1.z.string().trim().min(2, "Please enter your full name"),
});
// ✅ Quote: transform 대신 .trim() 사용 → 계속 ZodString이므로 .min/.max 사용 가능
exports.quoteCreateSchema = zod_1.z.object({
    content: zod_1.z.string().trim().min(1, "Quote cannot be empty").max(500, "Quote is too long"),
});
// PATCH/PUT용 (필요 시 사용)
exports.quoteUpdateSchema = exports.quoteCreateSchema.partial();
exports.postCreateSchema = zod_1.z.object({
    type: zod_1.z.enum(["POPUP", "EVENT_POLAROID", "GM", "EVENT_UPCOMING", "OFFICER"]),
    title: zod_1.z.string().trim().min(1).optional(),
    date: zod_1.z.string().trim().optional(), // "2025-09-01" 같은 문자열 -> 서버에서 Date로 변환
    descKo: zod_1.z.string().trim().optional(),
    descEn: zod_1.z.string().trim().optional(),
    imageUrl: zod_1.z.string().url(),
});
