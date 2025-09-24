// backend/server.ts
import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// 내부 라이브러리들
import { withAudit } from "./lib/withAudit";
import { attachAuditMiddleware } from "./lib/prisma-audit-middleware";
import { mailer } from "./lib/mail";
import adminUsersRouter from "./routes/admin-users";
import authRouter from "./routes/auth";
import devRouter from "./routes/dev";
import multer from "multer";
import { prisma } from "./lib/prisma";

// ---------- ENV ----------
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// ---------- BOOT TAG ----------
const BUILD_TAG = `upload-v1-${Date.now()}`;
console.log("[BOOT]", BUILD_TAG);

// ---------- APP ----------
attachAuditMiddleware();

const app = express();
app.use(express.json());
app.use(cookieParser());

// ---------- CORS (단일, 확실) ----------
const allowlist = new Set(
  (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .concat([
      "https://www.ucdksea.com",
      "https://ucdksea.com",
      "http://localhost:3000",
      "http://127.0.0.1:3000",
    ])
);

app.use(
  cors({
    credentials: true,
    origin(origin, cb) {
      if (!origin) return cb(null, true); // 서버-서버 등 Origin 없음 허용
      return cb(null, allowlist.has(origin));
    },
  })
);

// 브라우저/프록시 캐시 일관화
app.use((_, res, next) => {
  res.setHeader("Vary", "Origin");
  next();
});

// ---------- HEALTH/디버그 ----------
app.get("/__sig", (_req, res) => res.type("text/plain").send(BUILD_TAG));

app.get("/__health", (_req, res) => {
  res.json({ ok: true, uptime: process.uptime(), env: process.env.NODE_ENV || "unknown" });
});

app.get("/healthz", (_req, res) => res.send("ok"));

app.get("/api/ping", (_req, res) => res.json({ ok: true }));

// 실제 등록 라우트 나열(JSON) - 한 개만 유지
app.get("/__routes", (_req, res) => {
  const out: Array<{ methods: string[]; path: string }> = [];
  // @ts-ignore
  app._router?.stack?.forEach((layer: any) => {
    if (layer.route?.path) {
      const methods = Object.keys(layer.route.methods)
        .filter((m) => layer.route.methods[m])
        .map((m) => m.toUpperCase());
      out.push({ methods, path: layer.route.path });
    } else if (layer.name === "router" && layer.handle?.stack) {
      const prefix =
        layer.regexp?.fast_slash
          ? "/"
          : (layer.regexp?.toString().match(/^\/\^\\\/(.+?)\\\/\?\$\//)?.[1] || "").replace(/\\\//g, "/");
      layer.handle.stack.forEach((r: any) => {
        if (r.route?.path) {
          const methods = Object.keys(r.route.methods)
            .filter((m) => r.route.methods[m])
            .map((m) => m.toUpperCase());
          out.push({ methods, path: `/${prefix}${r.route.path}`.replace(/\/+/g, "/") });
        }
      });
    }
  });
  res.json({ routes: out });
});

// dist 기준 public 루트
const PUBLIC_ROOT = path.resolve(__dirname, "../public");

// 정적 업로드 서빙
app.use(
  "/uploads",
  express.static(path.join(PUBLIC_ROOT, "uploads"), {
    maxAge: "1y",
    etag: true,
  })
);

// ---------- 라우터 마운트 ----------
app.use("/api/admin", adminUsersRouter);
app.use("/api/auth", authRouter);
app.use("/api/dev", devRouter);

// dev: 메일 테스트
app.get("/api/dev/test-email", async (_req, res) => {
  try {
    const info = await mailer.sendMail({
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: "[UCD KSEA] Test Email",
      text: "If you can read this, SMTP is working 🎉",
    });
    res.json({ ok: true, info });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ---------- 업로드 ----------
const UPLOAD_DIR = path.join(PUBLIC_ROOT, "uploads", "posts");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}_${safe}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) return cb(new Error("Only image files are allowed"));
    cb(null, true);
  },
});

// 업로드 헬스
app.get("/api/upload", (_req, res) => res.status(200).send("upload GET alive"));

type ReqWithFile = Request & { file?: Express.Multer.File };

async function isApprovedByCookie(req: Request) {
  const uid = (req as any).cookies?.uid as string | undefined;
  if (!uid) return false;
  try {
    const me = await prisma.user.findUnique({ where: { id: uid }, select: { isApproved: true } });
    return !!me?.isApproved;
  } catch {
    return false;
  }
}

function isAdminByToken(req: Request) {
  const token = req.get("x-admin-token") || (req.get("authorization") || "").replace(/^Bearer\s+/i, "");
  return !!(token && process.env.ADMIN_TOKEN && token === process.env.ADMIN_TOKEN);
}

app.post("/api/upload", upload.single("file"), async (req: ReqWithFile, res: Response) => {
  const allowPublic = process.env.ALLOW_PUBLIC_UPLOADS === "true";
  const admin = isAdminByToken(req);
  let approved = false;
  if (!admin && !allowPublic) approved = await isApprovedByCookie(req);

  if (!(admin || approved || allowPublic)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const file = req.file;
  if (!file) return res.status(400).json({ error: "No file" });

  const base = process.env.APP_BASE_URL || `${req.protocol}://${req.get("host")}`;
  const url = `${base}/uploads/posts/${file.filename}`;
  return res.status(201).json({ url });
});

// ---------- 오류 핸들러 (디버그용) ----------
app.use((err: any, _req: Request, res: Response, _next) => {
  console.error("[ERR]", err);
  res.status(500).json({ ok: false, error: err?.message || "Server error" });
});

// ---------- START ----------
const PORT = Number(process.env.PORT || 4000);
app.listen(PORT, "0.0.0.0", () => console.log("API up on", PORT));
