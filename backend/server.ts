// backend/server.ts

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// ---- 1) ENV 먼저 ----
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// ---- 2) 부팅 태그/에러 가드 ----
const BUILD_TAG = `upload-v1-${Date.now()}`;
console.log("[BOOT]", BUILD_TAG);

process.on("unhandledRejection", (e) => {
  console.error("[UNHANDLED_REJECTION]", e);
});
process.on("uncaughtException", (e) => {
  console.error("[UNCAUGHT_EXCEPTION]", e);
});

// ---- 3) 가장 먼저 app + 헬스만 세움 ----
const app = express();

// 헬스는 어떤 실패와도 무관하게 즉시 200
app.get("/__sig", (_req, res) => res.type("text/plain").send(BUILD_TAG));
app.get("/__health", (_req, res) => res.status(200).send("ok"));
app.get("/healthz", (_req, res) => res.status(200).send("ok"));
app.get("/api/ping", (_req, res) => res.json({ ok: true }));

// ---- 4) 그 다음에만 나머지 미들웨어/라우터를 “안전하게” 붙임 ----
(async () => {
  try {
    // (4-1) 공통 미들웨어
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
        origin(origin, cb) => {
          if (!origin) return cb(null, true);
          cb(null, allowlist.has(origin));
        },
      })
    );
    app.use((_, res, next) => {
      res.setHeader("Vary", "Origin");
      next();
    });
    app.use(express.json());
    app.use(cookieParser());

    // (4-2) 경량 정적 서빙
    const PUBLIC_ROOT = path.resolve(__dirname, "../public");
    app.use(
      "/uploads",
      express.static(path.join(PUBLIC_ROOT, "uploads"), { maxAge: "1y", etag: true })
    );

    // (4-3) 무거운 의존성들 ‘지연 import’
    const { attachAuditMiddleware } = await import("./lib/prisma-audit-middleware");
    const { mailer } = await import("./lib/mail");
    const adminUsersRouter = (await import("./routes/admin-users")).default;
    const authRouter = (await import("./routes/auth")).default;
    const devRouter = (await import("./routes/dev")).default;
    const multer = (await import("multer")).default;
    const { prisma } = await import("./lib/prisma");

    attachAuditMiddleware();

    // (4-4) 라우트
    app.use("/api/admin", adminUsersRouter);
    app.use("/api/auth", authRouter);
    app.use("/api/dev", devRouter);

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

    // 업로드
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
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) return cb(new Error("Only image files are allowed"));
        cb(null, true);
      },
    });

    app.get("/api/upload", (_req, res) => res.status(200).send("upload GET alive"));

    app.post("/api/upload", upload.single("file"), async (req: any, res) => {
      const allowPublic = process.env.ALLOW_PUBLIC_UPLOADS === "true";

      const token = req.get("x-admin-token") || (req.get("authorization") || "").replace(/^Bearer\s+/i, "");
      const admin = !!(token && process.env.ADMIN_TOKEN && token === process.env.ADMIN_TOKEN);

      let approved = false;
      if (!(admin || allowPublic)) {
        const uid = req.cookies?.uid as string | undefined;
        if (uid) {
          try {
            const me = await prisma.user.findUnique({ where: { id: uid }, select: { isApproved: true } });
            approved = !!me?.isApproved;
          } catch {
            approved = false;
          }
        }
      }

      if (!(admin || approved || allowPublic)) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const file = req.file;
      if (!file) return res.status(400).json({ error: "No file" });

      const base = process.env.APP_BASE_URL || `${req.protocol}://${req.get("host")}`;
      const url = `${base}/uploads/posts/${file.filename}`;
      return res.status(201).json({ url });
    });

    // 오류 핸들러
    app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      console.error("[ERR]", err);
      res.status(500).json({ ok: false, error: err?.message || "Server error" });
    });

    console.log("[INIT] routers/middlewares mounted");
  } catch (e) {
    // 초기화 실패해도 서버는 살아 있음 (헬스 200 유지)
    console.error("[INIT_ERROR]", e);
  }
})();

// ---- 5) 마지막에 listen (동적 PORT) ----
const PORT = Number(process.env.PORT || 4000);
app.listen(PORT, "0.0.0.0", () => console.log("API up on", PORT));
