// backend/server.ts (단순화 버전)
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import multer from "multer";

import { attachAuditMiddleware } from "./lib/prisma-audit-middleware";
import { mailer } from "./lib/mail";
import adminUsersRouter from "./routes/admin-users";
import authRouter from "./routes/auth";
import devRouter from "./routes/dev";
import { prisma } from "./lib/prisma";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const BUILD_TAG = `upload-v1-${Date.now()}`;
console.log("[BOOT]", BUILD_TAG);

const app = express();

app.get("/__health", (_req, res) => res.status(200).send("ok"));
app.get("/api/ping", (_req, res) => res.json({ ok: true }));

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

const PUBLIC_ROOT = path.resolve(__dirname, "../public");
app.use("/uploads", express.static(path.join(PUBLIC_ROOT, "uploads")));

attachAuditMiddleware();

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

const UPLOAD_DIR = path.join(PUBLIC_ROOT, "uploads", "posts");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const safe = String(file.originalname || "").replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}_${safe}`);
  },
});
const upload = multer({ storage });

type ReqWithFile = Request & { file?: any };

app.post("/api/upload", upload.single("file"), async (req: ReqWithFile, res: Response) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file" });

    const base = process.env.APP_BASE_URL || `${req.protocol}://${req.get("host")}`;
    const url = `${base}/uploads/posts/${file.filename}`;
    const payload = JSON.stringify({ url });

    console.log("[UPLOAD_OK]", file.filename);

    res.status(201);
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Length", Buffer.byteLength(payload).toString());
    res.end(payload);
  } catch (e: any) {
    console.error("[ERR][UPLOAD]", e);
    res.status(500).json({ ok: false, error: e?.message || "Upload failed" });
  }
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[ERR]", err);
  res.status(500).json({ ok: false, error: err?.message || "Server error" });
});

const PORT = Number(process.env.PORT || 4000);
app.listen(PORT, "0.0.0.0", () => console.log("API up on", PORT));
