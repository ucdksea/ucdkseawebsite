import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";
import multer from "multer";

const app = express();

// Health & ping
app.get("/__health", (_req, res) => res.status(200).send("ok"));
app.get("/api/ping", (_req, res) => res.json({ ok: true }));

// Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Static
const PUBLIC_ROOT = path.resolve(__dirname, "../public");
app.use("/uploads", express.static(path.join(PUBLIC_ROOT, "uploads"), { maxAge: "1y", etag: true }));

// Upload (10MB)
const UPLOAD_DIR = path.join(PUBLIC_ROOT, "uploads", "posts");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const safe = String(file.originalname || "").replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}_${safe}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!String(file.mimetype || "").startsWith("image/")) return cb(new Error("Only image files are allowed"));
    cb(null, true);
  },
});

type ReqWithFile = Request & { file?: any };

app.post("/api/upload", upload.single("file"), async (req: ReqWithFile, res: Response) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file" });

    const base = process.env.APP_BASE_URL || `${req.protocol}://${req.get("host")}`;
    const url = `${base}/uploads/posts/${file.filename}`;
    const payload = JSON.stringify({ url });

    // 명시 종료로 curl (18) 회피
    res.status(201);
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Length", Buffer.byteLength(payload).toString());
    res.setHeader("Connection", "close");
    res.end(payload);
  } catch (e: any) {
    console.error("[ERR][UPLOAD]", e);
    res.status(500).json({ ok: false, error: e?.message || "Upload failed" });
  }
});

import os from "os"; // 파일 상단 import들 사이에 추가해도 되고 안 써도 됨 (무시해도 OK)

// 최근 업로드 목록
app.get("/api/uploads/recent", (_req, res) => {
  try {
    const ROOT = path.resolve(__dirname, "../public/uploads/posts");
    const entries = fs.readdirSync(ROOT)
      .filter(f => !f.startsWith("."))
      .map(f => {
        const st = fs.statSync(path.join(ROOT, f));
        return { file: f, mtime: st.mtimeMs };
      })
      .sort((a, b) => b.mtime - a.mtime)
      .slice(0, 10)
      .map(x => x.file);

    res.json({ files: entries });
  } catch (e: any) {
    console.error("[RECENT_ERR]", e);
    res.status(500).json({ ok: false, error: e?.message || "list failed" });
  }
});


// Listen
const PORT = Number(process.env.PORT || 4000);
app.listen(PORT, "0.0.0.0", () => console.log("API up on", PORT));
