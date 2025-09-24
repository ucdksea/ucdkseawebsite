import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";
import multer from "multer";
import { prisma } from "./lib/prisma";
import type { PrismaClient } from "@prisma/client";


const app = express();
const corsOpts = { origin: ["https://www.ucdksea.com","https://ucdksea.com"], credentials: true };

// Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use((_, res, next) => { res.setHeader("Vary","Origin"); next(); });
app.options("*", cors(corsOpts));
app.use(express.json());
app.use(cookieParser());

// Health & ping
app.get("/__health", (_req, res) => res.status(200).send("ok"));
app.get("/api/ping", (_req, res) => res.json({ ok: true }));


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

app.get("/api/uploads/recent", (_req, res) => {
  try {
    const ROOT = path.resolve(__dirname, "../public/uploads/posts");
    const files = fs.readdirSync(ROOT)
      .filter(f => !f.startsWith("."))
      .map(f => ({ f, t: fs.statSync(path.join(ROOT, f)).mtimeMs }))
      .sort((a,b) => b.t - a.t)
      .slice(0, 10)
      .map(x => x.f);
    res.json({ files });
  } catch (e:any) {
    res.status(500).json({ ok:false, error: e?.message || "list failed" });
  }
});

app.get("/api/admin/posts", async (req, res) => {
  try {
    const ALLOWED = ["POPUP","EVENT_UPCOMING","EVENT_POLAROID","GM","OFFICER"] as const;
    const type = typeof req.query.type === "string" ? req.query.type : undefined;
    const activeParam = typeof req.query.active === "string" ? req.query.active : "1";
    const onlyActive = activeParam === "0" ? false : true;

    const where: any = {};
    if (type && (ALLOWED as readonly string[]).includes(type)) where.type = type;
    if (onlyActive) where.active = true;

    const rows = await prisma.post.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      select: {
        id: true, type: true, active: true, createdAt: true,
        imageUrl: true, linkUrl: true, title: true, date: true,
        descKo: true, descEn: true, year: true, quarter: true, meta: true,
      },
    });

    // OFFICER는 프론트가 기대하는 형태로 매핑
    const posts = rows.map(p =>
      p.type === "OFFICER"
        ? {
            ...p,
            enName:   p.title   ?? null,
            koName:   p.descKo  ?? null,
            role:     p.descEn  ?? null,
            linkedin: p.linkUrl ?? null,
          }
        : p
    );

    res.json({ posts });
  } catch (e: any) {
    console.error("[GET /api/admin/posts] ERR", e);
    res.status(500).json({ error: e?.message || "Server error" });
  }
});
const getPrisma = async () => {
  const m = await import("@prisma/client");
  return new m.PrismaClient() as PrismaClient;
};

app.get("/api/debug/posts/summary", async (_req, res) => {
  try {
    const prisma = await getPrisma();
    const total = await prisma.post.count();
    const byType = await prisma.post.groupBy({
      by: ["type"],
      _count: { _all: true },
    });
    const latest = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, type: true, active: true, createdAt: true, title: true },
    });

    const dbUrl = process.env.DATABASE_URL || "";
    const masked =
      dbUrl.replace(/:[^:@/]+@/, ":***@") // 패스워드 마스킹
           .replace(/\?.*$/, ""); // 쿼리스트링 제거

    res.json({
      ok: true,
      env: {
        NODE_ENV: process.env.NODE_ENV,
        APP_BASE_URL: process.env.APP_BASE_URL,
        DATABASE_URL: masked,
      },
      counts: {
        total,
        byType: byType.map(x => ({ type: x.type, count: x._count._all })),
      },
      latest,
    });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e?.message || "debug failed" });
  }
});

// ✅ Express: POST /api/admin/posts
app.post("/api/admin/posts", async (req, res) => {
  try {
    const ALLOWED = ["POPUP","EVENT_UPCOMING","EVENT_POLAROID","GM","OFFICER"] as const;
    type PostType = typeof ALLOWED[number];

    const body = req.body || {};
    const type: PostType | undefined = ALLOWED.includes(body.type) ? body.type : undefined;
    if (!type) return res.status(400).json({ error: `type must be one of ${ALLOWED.join("|")}` });

    if (!body.imageUrl) return res.status(400).json({ error: "imageUrl required" });
    if ((type === "POPUP" || type === "EVENT_UPCOMING") && !body.linkUrl) {
      return res.status(400).json({ error: "linkUrl required for POPUP/EVENT_UPCOMING" });
    }
    if (type === "EVENT_POLAROID" && !body.title) {
      return res.status(400).json({ error: "title required for EVENT_POLAROID" });
    }

    // Quarter/Year 정규화 (GM, EVENT_POLAROID 용)
    const seasonAliases: Record<string,string> = {
      fall:"Fall", f:"Fall", autumn:"Fall", "1":"Fall", q1:"Fall",
      winter:"Winter", w:"Winter", "2":"Winter", q2:"Winter",
      spring:"Spring", s:"Spring", "3":"Spring", q3:"Spring",
    };
    const normYear = typeof body.year === "number" ? String(body.year)
                   : typeof body.year === "string" ? body.year.trim() : "";
    const qRaw = body.quarter ?? "";
    const qStr = typeof qRaw === "number" ? String(qRaw)
               : typeof qRaw === "string" ? qRaw.trim().replace(/^q/i,"") : "";
    const qAlias = seasonAliases[qStr.toLowerCase().replace(/\s+/g,"")] ?? "";

    if (type === "GM" || type === "EVENT_POLAROID") {
      if (!normYear)  return res.status(400).json({ error: `Year required for ${type}` });
      if (!qStr)      return res.status(400).json({ error: `Quarter required for ${type}` });
      if (!qAlias)    return res.status(400).json({ error: "Quarter must be one of Fall / Winter / Spring" });
    }

    // meta 병합
    const meta: any = {};
    const posterUrl = body.posterUrl ?? body?.meta?.posterUrl ?? body.imageUrl;
    if (posterUrl) meta.posterUrl = posterUrl;
    if (body.formUrl ?? body?.meta?.formUrl) meta.formUrl = body.formUrl ?? body?.meta?.formUrl;
    if (body.instagramUrl ?? body?.meta?.instagramUrl) meta.instagramUrl = body.instagramUrl ?? body?.meta?.instagramUrl;

    const data: any = {
      type,
      imageUrl: body.imageUrl,
      active: true,
      meta: Object.keys(meta).length ? meta : null,
    };

    if (type === "OFFICER") {
      data.title   = (body.enName   ?? "").trim();
      data.descKo  = (body.koName   ?? "").trim();
      data.descEn  = (body.role     ?? "").trim();
      data.linkUrl = (body.linkedin ?? "").trim() || null;
      data.date    = null;
      data.year    = null;
      data.quarter = null;
      if (!data.title || !data.descKo || !data.descEn) {
        return res.status(400).json({ error: "enName/koName/role required for OFFICER" });
      }
    } else if (type === "GM") {
      data.title   = null;
      data.descKo  = body.descKo ?? null;
      data.descEn  = body.descEn ?? null;
      data.linkUrl = body.linkUrl ?? null;
      data.date    = null;
      data.year    = normYear;
      data.quarter = qAlias;
    } else if (type === "EVENT_POLAROID") {
      data.title   = body.title ?? null;
      data.descKo  = body.descKo ?? null;
      data.descEn  = body.descEn ?? null;
      data.linkUrl = body.linkUrl ?? null;
      data.date    = body.date ? new Date(body.date) : null;
      data.year    = normYear;
      data.quarter = qAlias;
    } else {
      data.title   = body.title ?? null;
      data.descKo  = body.descKo ?? null;
      data.descEn  = body.descEn ?? null;
      data.linkUrl = body.linkUrl ?? null;
      data.date    = body.date ? new Date(body.date) : null;
      data.year    = null;
      data.quarter = null;
    }

    const post = await prisma.post.create({ data });
    return res.json({ ok: true, post });
  } catch (e: any) {
    console.error("[POST /api/admin/posts] ERR", e);
    return res.status(500).json({ error: e?.message || "Create failed" });
  }
});

// ✅ Express: DELETE /api/admin/posts/:id?hard=1
app.delete("/api/admin/posts/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const hard = String(req.query.hard || "") === "1";

    const before = await prisma.post.findUnique({
      where: { id },
      select: { id: true, active: true, type: true }
    });
    if (!before) return res.status(404).json({ error: "Not found" });

    if (hard) {
      await prisma.post.delete({ where: { id } });
      return res.json({ ok: true, mode: "hard", before, after: null });
    }

    if (before.active === false) {
      return res.json({ ok: true, mode: "soft", before, after: before, noChange: true });
    }
    const after = await prisma.post.update({
      where: { id },
      data: { active: false },
      select: { id: true, active: true, type: true }
    });
    return res.json({ ok: true, mode: "soft", before, after });
  } catch (e: any) {
    console.error("[DELETE /api/admin/posts/:id] ERR", e);
    return res.status(500).json({ error: e?.message || "Server error" });
  }
});

function requireAdmin(req: Request, res: Response) {
  const h = req.header("x-admin-token") || req.header("authorization")?.replace(/^Bearer\s+/i,"");
  if (!process.env.ADMIN_TOKEN || h !== process.env.ADMIN_TOKEN) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
}

// 사용
app.post("/api/admin/posts", (req,res,next)=> requireAdmin(req,res) ? next() : undefined, async (req,res)=>{ /* ... */});
app.delete("/api/admin/posts/:id", (req,res,next)=> requireAdmin(req,res) ? next() : undefined, async (req,res)=>{ /* ... */});

// Listen
const PORT = Number(process.env.PORT || 4000);
app.listen(PORT, "0.0.0.0", () => console.log("API up on", PORT));
