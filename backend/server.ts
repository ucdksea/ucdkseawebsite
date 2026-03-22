import express, { Request, Response, NextFunction, type RequestHandler } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";
import multer from "multer";
import { prisma } from "./lib/prisma";
import jwt from "jsonwebtoken";
import os from 'os';
import { S3Client, PutObjectCommand, HeadObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto';
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

const app = express();

// ── [설정 1] 환경 변수 및 CORS ──────────────────────────────────────────
const envOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim()) 
  : ["https://www.ucdksea.com", "https://ucdksea.com"];

const corsOpts = { 
  origin: (origin: string | undefined, callback: any) => {
    if (!origin || envOrigins.includes(origin)) return callback(null, true);
    console.warn(`[CORS_BLOCKED] Origin: '${origin}'`);
    return callback(null, false);
  },
  credentials: true 
};

// ── [설정 2] 전역 미들웨어 (순서 중요) ──────────────────────────────────────
app.use(cors(corsOpts));
app.options("*", cors(corsOpts));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("trust proxy", 1);
app.use((req, res, next) => { res.setHeader('X-Instance', os.hostname()); next(); });

// ── [도우미 함수] 이미지 전용 CORS 헤더 ──────────────────────────────────────
const ALLOW_ORIGINS = new Set(envOrigins);
function setImageCORS(req: Request, res: Response) {
  const origin = String(req.headers.origin || "");
  if (origin && ALLOW_ORIGINS.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
  res.setHeader("Vary", "Origin");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
}

// ── [설정 3] R2 및 파일 업로드 설정 ────────────────────────────────────────
const r2 = new S3Client({
  region: process.env.R2_REGION || 'auto',
  endpoint: process.env.R2_ENDPOINT,
  forcePathStyle: true,  
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const uploadMem = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!String(file.mimetype || '').startsWith('image/')) return cb(new Error('Only image files are allowed'));
    cb(null, true);
  },
});

function uniqueName(orig: string) {
  const safe = (orig || 'upload').replace(/[^a-zA-Z0-9._-]/g, '_');
  const salt = crypto.randomBytes(4).toString('hex');
  return `${Date.now()}_${salt}_${safe}`;
}

// ── [API 1] Health & Auth ──────────────────────────────────────────────
app.get("/__health", (_req, res) => res.status(200).send("ok"));
app.get("/api/ping", (_req, res) => res.json({ ok: true }));

// Auth API (Login, Register 등 기존 로직 유지)
app.post("/api/auth/login", async (req, res) => { /* ... 기존 Login 로직 ... */ });
app.post("/api/auth/register", async (req, res) => { /* ... 기존 Register 로직 ... */ });

// ── [API 2] Admin & Posts ─────────────────────────────────────────────
app.get("/api/admin/posts", async (req, res) => { /* ... 기존 GET 로직 ... */ });
app.post("/api/admin/posts", async (req, res) => { /* ... 기존 POST 로직 ... */ });
app.delete("/api/admin/posts/:id", async (req, res) => { /* ... 기존 DELETE 로직 ... */ });

// ── [API 3] 파일 업로드 (R2) ────────────────────────────────────────────
app.post('/api/upload', uploadMem.single('file'), async (req: Request & { file?: any }, res: Response) => {
  try {
    const f = req.file;
    if (!f) return res.status(400).json({ ok: false, error: 'NO_FILE' });
    const key = `posts/${uniqueName(f.originalname)}`;
    await r2.send(new PutObjectCommand({
      Bucket: process.env.R2_BUCKET!,
      Key: key,
      Body: f.buffer,
      ContentType: f.mimetype,
      CacheControl: 'public, max-age=31536000, immutable',
    }));
    return res.json({ ok: true, key, url: `/uploads/${key}` });
  } catch (e) {
    console.error('[upload]', e);
    return res.status(500).json({ ok:false, error:'UPLOAD_FAILED' });
  }
});

// ── [서빙 1] R2 파일 프록시 (최우선) ───────────────────────────────────────
app.get('/uploads/*', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const key = req.params[0];
    const head = await r2.send(new HeadObjectCommand({ Bucket: process.env.R2_BUCKET!, Key: key }));
    const obj = await r2.send(new GetObjectCommand({ Bucket: process.env.R2_BUCKET!, Key: key }));
    
    setImageCORS(req, res);
    if (head.ContentType) res.setHeader('Content-Type', head.ContentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    (obj.Body as any).pipe(res);
  } catch (e: any) {
    // R2에 없으면(404) 다음 미들웨어(로컬 정적 서빙)로 넘어감
    if (e?.$metadata?.httpStatusCode === 404) return next();
    res.status(500).send('Server error');
  }
});

// ── [서빙 2] 로컬 정적 서빙 및 SPA ───────────────────────────────────────
const PUBLIC_ROOTS = pickRoots(); // 기존 pickRoots 함수 사용
const CANON_ROOT = PUBLIC_ROOTS[0];

// 로컬 /uploads 폴더 서빙
for (const root of PUBLIC_ROOTS) {
  app.use("/uploads", express.static(path.join(root, "uploads"), { fallthrough: true }));
}

// 레거시 /file, /file2 및 Suffix 폴백 처리
app.get([/^\/file\/(.*)$/, /^\/file2\/(.*)$/], (req, res) => {
  const rel = req.params[0];
  return sendFromAnyRoot(rel, req, res); // 기존 sendFromAnyRoot 함수 사용
});

// 프론트엔드 정적 파일
app.use(express.static(CANON_ROOT, { extensions: ['html'], index: ['index.html'] }));

// ── [마무리] 에러 핸들러 및 서버 시작 ───────────────────────────────────────
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof multer.MulterError) return res.status(413).json({ error: err.message });
  res.status(500).json({ error: err?.message || 'Server error' });
});

const PORT = Number(process.env.PORT || 4000);
app.listen(PORT, "0.0.0.0", () => console.log(`🚀 API up on ${PORT}`));