import express, { Request, Response, NextFunction, type RequestHandler } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";
import multer from "multer";
import { prisma } from "./lib/prisma";
import type { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import os from 'os';
import { S3Client, PutObjectCommand, HeadObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto';
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

const app = express();

// ── [1] 설정 및 환경 변수 ────────────────────────────────────────────────
const envOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim()) 
  : ["https://www.ucdksea.com", "https://ucdksea.com"];

const corsOpts = { 
  origin: (origin: string | undefined, callback: any) => {
    if (!origin || envOrigins.includes(origin)) return callback(null, true); 
    console.warn(`[CORS_BLOCKED] Incoming Origin: '${origin}'`);
    return callback(null, false);
  },
  credentials: true 
};

// ── [2] 전역 미들웨어 ───────────────────────────────────────────────────
app.use(cors(corsOpts));
app.options("*", cors(corsOpts));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("trust proxy", 1);
app.use((req, res, next) => { res.setHeader('X-Instance', os.hostname()); next(); });

// ── [3] 유틸리티 함수 (CORS, R2, Mail, Auth) ─────────────────────────────
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

const r2 = new S3Client({
  region: process.env.R2_REGION || 'auto',
  endpoint: process.env.R2_ENDPOINT,
  forcePathStyle: true,  
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

function uniqueName(orig: string) {
  const safe = (orig || 'upload').replace(/[^a-zA-Z0-9._-]/g, '_');
  const salt = crypto.randomBytes(4).toString('hex');
  return `${Date.now()}_${salt}_${safe}`;
}

function isResendTestMode() {
  const from = String(process.env.RESEND_FROM || "").toLowerCase();
  return !!process.env.RESEND_API_KEY && from.includes("onboarding@resend.dev");
}

const RESEND_TEST_RECIPIENT = (process.env.RESEND_TEST_RECIPIENT || "ucdksea@gmail.com").toLowerCase();

async function sendMail(opts: { to: string; subject: string; html: string; text?: string }) {
  if (!!process.env.RESEND_API_KEY) {
    if (isResendTestMode()) {
      const toList = String(opts.to).split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
      if (toList.some(t => t !== RESEND_TEST_RECIPIENT)) {
        console.warn("[MAIL][skip] Resend test mode blocked non-test recipient.");
        return;
      }
    }
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY!);
    await resend.emails.send({
      from: process.env.RESEND_FROM || "onboarding@resend.dev",
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
      replyTo: process.env.FROM_EMAIL || undefined,
    });
    return;
  }

  const smtpTransport = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! },
    tls: { minVersion: "TLSv1.2", rejectUnauthorized: true },
    family: 4,
  });
  await smtpTransport.sendMail({ from: process.env.FROM_EMAIL || "no-reply@local", ...opts });
}

function requireAdmin(req: Request, res: Response) {
  const h = req.header("x-admin-token") || req.header("authorization")?.replace(/^Bearer\s+/i,"");
  if (!process.env.ADMIN_TOKEN || h !== process.env.ADMIN_TOKEN) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
}

// ── [4] 정적 경로 탐색 (pickRoots) ──────────────────────────────────────
function pickRoots() {
  const candsRaw = [
    process.env.PUBLIC_ROOT_DIR && path.resolve(process.env.PUBLIC_ROOT_DIR),
    path.resolve(__dirname, "./public"),
    path.resolve(__dirname, "../public"),
    path.resolve(process.cwd(), "backend/public"),
    path.resolve(process.cwd(), "public"),
    "/var/data/public", "/var/data", "/data/public", "/data", "/mnt/data/public", "/mnt/data",
  ];
  const exists = candsRaw.filter(Boolean).filter(p => { try { return fs.existsSync(p as string); } catch { return false; } });
  if (!exists.length) throw new Error("No PUBLIC_ROOT found");
  return Array.from(new Set(exists as string[])).sort((a,b) => (/public/.test(a) ? -1 : 0) - (/public/.test(b) ? -1 : 0));
}

const PUBLIC_ROOTS = pickRoots();
const CANON_ROOT = PUBLIC_ROOTS[0];
const UPLOAD_DIR = path.join(CANON_ROOT, "uploads", "posts");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// ── [5] API 라우트 (Health, Auth, Admin) ────────────────────────────────
app.get("/__health", (_req, res) => res.status(200).send("ok"));
app.get("/api/ping", (_req, res) => res.json({ ok: true }));

// Auth: Register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name?.trim() || !email?.trim() || password?.length < 8) return res.status(400).json({ error: "Invalid input" });
    const emailNorm = email.trim().toLowerCase();
    if (!emailNorm.endsWith("@ucdavis.edu")) return res.status(400).json({ error: "Please use @ucdavis.edu" });
    const exists = await prisma.user.findUnique({ where: { email: emailNorm } });
    if (exists) return res.status(409).json({ error: "Already registered" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email: emailNorm, name: name.trim(), passwordHash, isApproved: false },
      select: { id: true, email: true, name: true, isApproved: true },
    });

    await sendMail({ to: user.email, subject: `[UCD KSEA] Registration received`, html: `<p>Awaiting admin approval.</p>` });
    return res.status(201).json({ ok: true, user });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// Auth: Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const user = await prisma.user.findUnique({ where: { email: String(email).toLowerCase().trim() } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) return res.status(401).json({ error: "Invalid login" });
    if (!user.isApproved) return res.status(403).json({ error: "Not approved yet" });

    res.cookie("uid", user.id, { httpOnly: true, secure: true, sameSite: "lax", domain: ".ucdksea.com", path: "/", maxAge: 7 * 24 * 60 * 60 * 1000 });
    return res.json({ ok: true, user: { id: user.id, email: user.email, name: user.name } });
  } catch (e) { res.status(500).json({ error: "Server error" }); }
});

// Admin: Posts CRUD & Reorder
app.get("/api/admin/posts", async (req, res) => {
  const rows = await prisma.post.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });
  res.json({ posts: rows });
});

app.post("/api/admin/posts", async (req, res) => {
  try {
    const body = req.body || {};
    if (body.action === "REORDER") {
      const order = Array.isArray(body.order) ? body.order : [];
      await prisma.$transaction(order.map((id: string, idx: number) => prisma.post.update({ where: { id }, data: { sortOrder: idx } })));
      return res.json({ ok: true });
    }
    const post = await prisma.post.create({ data: { ...body, active: true } });
    return res.json({ ok: true, post });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// ── [6] 업로드 및 파일 서빙 (R2 + Local Fallback) ──────────────────────────
const uploadMem = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

app.post('/api/upload', uploadMem.single('file'), async (req: any, res: any) => {
  try {
    const f = req.file;
    if (!f) return res.status(400).json({ ok: false, error: 'NO_FILE' });
    const key = `posts/${uniqueName(f.originalname)}`;
    await r2.send(new PutObjectCommand({ Bucket: process.env.R2_BUCKET!, Key: key, Body: f.buffer, ContentType: f.mimetype }));
    return res.json({ ok: true, key, url: `/uploads/${key}` });
  } catch (e) { res.status(500).json({ error: 'UPLOAD_FAILED' }); }
});

// R2 Proxy GET
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
    if (e?.$metadata?.httpStatusCode === 404) return next();
    res.status(500).send('Server error');
  }
});

// Local File 서빙 (Static + Fallback)
for (const root of PUBLIC_ROOTS) {
  app.use("/uploads", express.static(path.join(root, "uploads"), { fallthrough: true }));
}

function findCandidatePaths(rel: string) {
  let clean = rel.replace(/^(\.\.\/|\/)+/g, "");
  if (clean.startsWith("file/")) clean = clean.replace(/^file\//, "uploads/");
  if (!clean.startsWith("uploads/")) clean = "uploads/" + clean;
  return [clean, path.basename(clean)];
}

function sendFromAnyRoot(rel: string, req: Request, res: Response) {
  const candidates = findCandidatePaths(rel);
  for (const root of PUBLIC_ROOTS) {
    for (const cand of candidates) {
      const full = path.resolve(path.join(root, cand));
      if (fs.existsSync(full) && fs.statSync(full).isFile()) {
        setImageCORS(req, res);
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        return res.sendFile(full);
      }
    }
  }
  res.status(404).json({ error: "not found" });
}

app.get([/^\/file\/(.*)$/, /^\/file2\/(.*)$/], (req, res) => sendFromAnyRoot(String(req.params[0]), req, res));

// ── [7] 프론트엔드 정적 서빙 및 마무리 ─────────────────────────────────────
app.use(express.static(CANON_ROOT, { extensions: ['html'], index: ['index.html'] }));

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

const PORT = Number(process.env.PORT || 4000);
app.listen(PORT, "0.0.0.0", () => console.log(`🚀 API up on ${PORT}`));