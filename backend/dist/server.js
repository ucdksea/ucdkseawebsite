"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendApprovalEmail = sendApprovalEmail;
///Users/stephanie/Desktop/ucdksea-website/backend/server.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const prisma_1 = require("./lib/prisma");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const os_1 = __importDefault(require("os"));
const client_s3_1 = require("@aws-sdk/client-s3");
const crypto_1 = __importDefault(require("crypto"));
const r2 = new client_s3_1.S3Client({
    region: process.env.R2_REGION || 'auto',
    endpoint: process.env.R2_ENDPOINT,
    forcePathStyle: true,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
});
const uploadMem = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 20 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (!String(file.mimetype || '').startsWith('image/'))
            return cb(new Error('Only image files are allowed'));
        cb(null, true);
    },
});
function uniqueName(orig) {
    const safe = (orig || 'upload').replace(/[^a-zA-Z0-9._-]/g, '_');
    const salt = crypto_1.default.randomBytes(4).toString('hex');
    return `${Date.now()}_${salt}_${safe}`;
}
function isResendTestMode() {
    const from = String(process.env.RESEND_FROM || "").toLowerCase();
    return !!process.env.RESEND_API_KEY && from.includes("onboarding@resend.dev");
}
// 필요시 환경에서 오버라이드 가능 (기본 허용: ucdksea@gmail.com)
const RESEND_TEST_RECIPIENT = (process.env.RESEND_TEST_RECIPIENT || "ucdksea@gmail.com").toLowerCase();
const app = (0, express_1.default)();
const corsOpts = { origin: ["https://www.ucdksea.com", "https://ucdksea.com"], credentials: true };
// Middlewares
app.use((0, cors_1.default)(corsOpts)); // ✅ 통일
app.options("*", (0, cors_1.default)(corsOpts));
app.use((_, res, next) => { res.setHeader("Vary", "Origin"); next(); });
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.set("trust proxy", 1);
// Health & ping
app.get("/__health", (_req, res) => res.status(200).send("ok"));
app.get("/healthz", (_req, res) => res.status(200).send("ok"));
app.get("/api/ping", (_req, res) => res.json({ ok: true }));
app.get("/log", (_req, res) => {
    res.sendFile(path_1.default.join(CANON_ROOT, "activity-feed.html"));
});
// ── 이미지 경로 정의
const IMAGE_ROUTES = [/^\/uploads(\/|$)/, /^\/file(\/|$)/, /^\/file2(\/|$)/];
// ── 허용 오리진
const ALLOW_ORIGINS = new Set([
    "https://www.ucdksea.com",
    "https://ucdksea.com",
]);
function setImageCORS(req, res) {
    const origin = String(req.headers.origin || "");
    if (origin && ALLOW_ORIGINS.has(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Access-Control-Allow-Credentials", "true");
    }
    else {
        // 크리덴셜이 없을 땐 * 허용 가능 (fetch가 credentials: 'include'면 위 분기가 적용됨)
        res.setHeader("Access-Control-Allow-Origin", "*");
    }
    res.setHeader("Vary", "Origin");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
}
app.use((req, res, next) => { res.setHeader('X-Instance', os_1.default.hostname()); next(); });
// ── 이미지 라우트 전역 CORS + OPTIONS 처리 (static/프록시 **앞**)
app.use((req, res, next) => {
    if (IMAGE_ROUTES.some(rx => rx.test(req.path))) {
        setImageCORS(req, res);
        if (req.method === "OPTIONS") {
            res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS");
            res.setHeader("Access-Control-Allow-Headers", req.header("Access-Control-Request-Headers") || "*");
            return res.sendStatus(204);
        }
    }
    next();
});
// ── Static roots: 과거/현재/디스크 경로 모두 지원 ─────────────────────
function pickRoots() {
    const candsRaw = [
        process.env.PUBLIC_ROOT_DIR && path_1.default.resolve(process.env.PUBLIC_ROOT_DIR), // ✅ 환경변수 최우선
        // 빌드 산출물/레포 상대 경로
        path_1.default.resolve(__dirname, "./public"),
        path_1.default.resolve(__dirname, "../public"),
        path_1.default.resolve(process.cwd(), "backend/public"),
        path_1.default.resolve(process.cwd(), "public"),
        // 🔁 Render 등 흔한 퍼시스턴트 디스크 마운트 후보 (존재하면 자동 포함)
        "/var/data/public",
        "/var/data",
        "/data/public",
        "/data",
        "/mnt/data/public",
        "/mnt/data",
    ];
    const cands = candsRaw.filter(Boolean);
    const exists = cands.filter(p => { try {
        return fs_1.default.existsSync(p);
    }
    catch {
        return false;
    } });
    if (!exists.length)
        throw new Error("No PUBLIC_ROOT found");
    // 중복 제거 + 정렬(조금이라도 'public'이 들어간 경로를 앞쪽으로)
    const unique = Array.from(new Set(exists)).sort((a, b) => {
        const aw = /public/.test(a) ? -1 : 0;
        const bw = /public/.test(b) ? -1 : 0;
        return aw - bw;
    });
    return unique;
}
// function ensureDir(p: string) {
//   try { fs.mkdirSync(p, { recursive: true }); } catch {}
// }
const PUBLIC_ROOTS = pickRoots();
const CANON_ROOT = PUBLIC_ROOTS[0]; // ← 새 업로드는 여기로 저장(통일 지점)
console.log("[PUBLIC_ROOTS]", PUBLIC_ROOTS);
console.log("[CANON_ROOT]", CANON_ROOT, "(uploads will be written here)");
const UPLOAD_DIR = path_1.default.join(CANON_ROOT, "uploads", "posts");
fs_1.default.mkdirSync(UPLOAD_DIR, { recursive: true });
app.use(express_1.default.static(CANON_ROOT, {
    extensions: ['html'],
    index: ['index.html'],
    maxAge: '1h'
}));
// ── /uploads 정적 서빙: 여러 루트를 차례로 시도 (fallthrough) ────────────
for (const root of PUBLIC_ROOTS) {
    app.use("/uploads", express_1.default.static(path_1.default.join(root, "uploads"), {
        fallthrough: true,
        maxAge: "1y",
        etag: true,
        setHeaders(res) {
            // ✅ 헤더만 세팅
            res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        },
    }));
}
const uploadOne = uploadMem.single('file');
// === 업로드 라우트 (POST /api/upload) ===
app.post('/api/upload', uploadOne, async (req, res) => {
    try {
        const f = req.file;
        if (!f)
            return res.status(400).json({ ok: false, error: 'NO_FILE' });
        const key = `posts/${uniqueName(f.originalname)}`;
        await r2.send(new client_s3_1.PutObjectCommand({
            Bucket: process.env.R2_BUCKET,
            Key: key,
            Body: f.buffer,
            ContentType: f.mimetype,
            CacheControl: 'public, max-age=31536000, immutable',
        }));
        const url = `/uploads/${key}`;
        return res.json({ ok: true, key, url });
    }
    catch (e) {
        console.error('[upload]', e);
        return res.status(500).json({ ok: false, error: 'UPLOAD_FAILED' });
    }
});
// === 프록시 GET (GET /uploads/:path...) ===
app.get('/uploads/*', async (req, res, next) => {
    try {
        const key = req.params[0];
        const head = await r2.send(new client_s3_1.HeadObjectCommand({ Bucket: process.env.R2_BUCKET, Key: key }));
        const etag = head.ETag;
        if (etag && req.headers['if-none-match'] === etag) {
            // 304에도 ETag 헤더를 다시 달아주는 게 안전
            res.setHeader('ETag', etag);
            return res.status(304).end();
        }
        const obj = await r2.send(new client_s3_1.GetObjectCommand({ Bucket: process.env.R2_BUCKET, Key: key }));
        if (head.ContentType)
            res.setHeader('Content-Type', head.ContentType);
        if (etag)
            res.setHeader('ETag', etag);
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        // @ts-ignore
        obj.Body.pipe(res);
    }
    catch (e) {
        // ⬇️ 404는 폴백으로 넘겨 디스크/레거시 경로 탐색하게 함
        if (e?.$metadata?.httpStatusCode === 404)
            return next();
        console.error('[uploads-proxy]', e);
        return res.status(500).send('Server error');
    }
});
// ── 공개 프록시: /file/**, /file2/** → 여러 루트 + 레거시 경로 탐색 ─────────
function findCandidatePaths(rel) {
    let clean = rel.replace(/^(\.\.\/|\/)+/g, "");
    if (clean.startsWith("file/"))
        clean = clean.replace(/^file\//, "uploads/");
    if (!clean.startsWith("uploads/"))
        clean = "uploads/" + clean;
    const paths = [clean];
    const m = clean.match(/^uploads\/(posts\/.+)$/);
    if (m) {
        const tail = m[1]; // posts/123.jpg
        paths.push("posts/" + tail.replace(/^posts\//, "")); // posts/123.jpg
        paths.push("uploads/" + tail.replace(/^posts\//, "")); // uploads/123.jpg
        paths.push(tail.replace(/^posts\//, "")); // 123.jpg (루트직하)
    }
    // ✅ 혹시 clean이 uploads/xyz.jpg 형태면 루트직하 xyz.jpg도 시도
    const basename = path_1.default.basename(clean);
    if (basename)
        paths.push(basename);
    return Array.from(new Set(paths));
}
function trySuffixMatch(root, cand) {
    // uploads/posts/… 인 경우에만 suffix 매칭
    const m = cand.match(/^uploads\/posts\/(.+)$/i);
    if (!m)
        return null;
    const want = m[1]; // ex) 1758868387752_geoyang.JPG
    const base = path_1.default.basename(want);
    const lowerBase = base.toLowerCase();
    const stripLeadingTs = lowerBase.replace(/^\d{10,}_/, ""); // ex) geoyang.jpg
    const dir = path_1.default.join(root, "uploads", "posts");
    try {
        if (!fs_1.default.existsSync(dir))
            return null;
        const list = fs_1.default.readdirSync(dir).filter(f => {
            try {
                return fs_1.default.statSync(path_1.default.join(dir, f)).isFile();
            }
            catch {
                return false;
            }
        });
        // 우선순위: 완전일치 → *_원본요청 → 리딩TS제거일치 → *_리딩TS제거
        const hit = list.find(f => f.toLowerCase() === lowerBase) ||
            list.find(f => f.toLowerCase().endsWith("_" + lowerBase)) ||
            list.find(f => f.toLowerCase() === stripLeadingTs) ||
            list.find(f => f.toLowerCase().endsWith("_" + stripLeadingTs));
        if (!hit)
            return null;
        return path_1.default.join(dir, hit);
    }
    catch {
        return null;
    }
}
// ── /uploads 폴백: 정적에서 못 찾은 파일을 후보/접미사 매칭으로 재탐색
app.get(/^\/uploads\/(.*)$/, (req, res) => {
    try {
        // sendFromAnyRoot는 'uploads/...' 형태를 기대하므로 prefix를 붙여줍니다.
        const rel = 'uploads/' + String(req.params[0] || '');
        return sendFromAnyRoot(rel, req, res);
    }
    catch (e) {
        console.error("[FALLBACK /uploads] error:", e);
        return res.status(500).json({ error: "server error" });
    }
});
app.head(/^\/uploads\/(.*)$/, (req, res) => {
    try {
        const rel = 'uploads/' + String(req.params[0] || '');
        return sendFromAnyRoot(rel, req, res);
    }
    catch (e) {
        console.error("[HEAD FALLBACK /uploads] error:", e);
        return res.status(500).json({ error: "server error" });
    }
});
// ── 디버그: 어떤 실제 경로를 확인하는지 보여줌 ──────────────────────
app.get("/__probe", (req, res) => {
    const rel = String(req.query.rel || "");
    const tried = [];
    const candidates = findCandidatePaths(rel);
    for (const root of PUBLIC_ROOTS) {
        for (const cand of candidates) {
            const full = path_1.default.resolve(path_1.default.join(root, cand));
            let exists = false;
            try {
                exists = fs_1.default.existsSync(full) && fs_1.default.statSync(full).isFile();
            }
            catch { }
            tried.push({ root, path: full, exists });
        }
    }
    res.json({ rel, candidates, tried });
});
function sendFromAnyRoot(rel, req, res) {
    const candidates = findCandidatePaths(rel);
    for (const root of PUBLIC_ROOTS) {
        for (const cand of candidates) {
            const rootUploads = path_1.default.join(root, "uploads");
            const full = path_1.default.resolve(path_1.default.join(root, cand));
            const allowBase = cand.startsWith("uploads/") ? rootUploads : root;
            if (!full.startsWith(path_1.default.resolve(allowBase) + path_1.default.sep))
                continue;
            if (fs_1.default.existsSync(full) && fs_1.default.statSync(full).isFile()) {
                setImageCORS(req, res);
                res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
                return res.sendFile(full);
            }
            // ✅ 여기서 suffix 매칭 시도
            const suffixHit = trySuffixMatch(root, cand);
            if (suffixHit) {
                setImageCORS(req, res);
                res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
                return res.sendFile(suffixHit);
            }
        }
    }
    setImageCORS(req, res);
    res.setHeader("Cache-Control", "no-store, max-age=0");
    return res.status(404).json({ error: "not found" });
}
app.get(/^\/file\/(.*)$/, (req, res) => {
    try {
        return sendFromAnyRoot(String(req.params[0] || ""), req, res);
    }
    catch (e) {
        console.error("[/file] error:", e);
        return res.status(500).json({ error: "server error" });
    }
});
app.get(/^\/file2\/(.*)$/, (req, res) => {
    try {
        return sendFromAnyRoot(String(req.params[0] || ""), req, res);
    }
    catch (e) {
        console.error("[/file2] error:", e);
        return res.status(500).json({ error: "server error" });
    }
});
// HEAD도 동일 처리 (일부 환경에서 먼저 칩니다)
app.head(/^\/file\/(.*)$/, (req, res) => {
    try {
        return sendFromAnyRoot(String(req.params[0] || ""), req, res);
    }
    catch (e) {
        console.error("[HEAD /file] error:", e);
        return res.status(500).json({ error: "server error" });
    }
});
app.head(/^\/file2\/(.*)$/, (req, res) => {
    try {
        return sendFromAnyRoot(String(req.params[0] || ""), req, res);
    }
    catch (e) {
        console.error("[HEAD /file2] error:", e);
        return res.status(500).json({ error: "server error" });
    }
});
// ── 최근 업로드: 첫 번째로 파일이 존재하는 루트에서 반환 ────────────────
app.get("/api/uploads/recent", (_req, res) => {
    try {
        for (const root of PUBLIC_ROOTS) {
            const ROOT = path_1.default.join(root, "uploads", "posts");
            if (!fs_1.default.existsSync(ROOT))
                continue;
            const files = fs_1.default.readdirSync(ROOT)
                .filter(f => !f.startsWith("."))
                .map(f => ({ f, t: fs_1.default.statSync(path_1.default.join(ROOT, f)).mtimeMs }))
                .sort((a, b) => b.t - a.t)
                .slice(0, 10)
                .map(x => x.f);
            if (files.length)
                return res.json({ files, root: ROOT });
        }
        return res.json({ files: [], note: "no uploads found in any root" });
    }
    catch (e) {
        res.status(500).json({ ok: false, error: e?.message || "list failed" });
    }
});
// ── Upload (10MB): 새 파일은 CANON_ROOT에만 기록 (통일) ────────────────
const looksTimestamped = /^\d{10,}_.+\.(jpe?g|png|gif|webp|svg)$/i;
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
    filename: (_req, file, cb) => {
        const safe = String(file.originalname || "").replace(/[^a-zA-Z0-9._-]/g, "_");
        if (looksTimestamped.test(safe)) {
            // ✅ 이미 "숫자_…"로 시작하면 그대로 쓴다 (링크 안정화)
            return cb(null, safe);
        }
        cb(null, `${Date.now()}_${safe}`);
    },
});
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (!String(file.mimetype || "").startsWith("image/"))
            return cb(new Error("Only image files are allowed"));
        cb(null, true);
    },
});
// ✅ Express: POST /api/admin/posts
// --- LIST posts (RESTORE this as its own route) ---
app.get("/api/admin/posts", async (req, res) => {
    try {
        const ALLOWED = ["POPUP", "EVENT_UPCOMING", "EVENT_POLAROID", "GM", "OFFICER"];
        const type = typeof req.query.type === "string" ? req.query.type : undefined;
        const activeParam = typeof req.query.active === "string" ? req.query.active : "1";
        const onlyActive = activeParam === "0" ? false : true;
        const where = {};
        if (type && ALLOWED.includes(type))
            where.type = type;
        if (onlyActive)
            where.active = true;
        const rows = await prisma_1.prisma.post.findMany({
            where,
            orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
            select: {
                id: true, type: true, active: true, createdAt: true,
                imageUrl: true, linkUrl: true, title: true, date: true,
                descKo: true, descEn: true, year: true, quarter: true, meta: true,
            },
        });
        const posts = rows.map(p => p.type === "OFFICER"
            ? { ...p, enName: p.title ?? null, koName: p.descKo ?? null, role: p.descEn ?? null, linkedin: p.linkUrl ?? null }
            : p);
        res.json({ posts });
    }
    catch (e) {
        console.error("[GET /api/admin/posts] ERR", e);
        res.status(500).json({ error: e?.message || "Server error" });
    }
});
// --- CREATE/REORDER posts (KEEP exactly one POST route) ---
app.post("/api/admin/posts", async (req, res) => {
    try {
        const ALLOWED = ["POPUP", "EVENT_UPCOMING", "EVENT_POLAROID", "GM", "OFFICER"];
        const body = req.body || {};
        // 1) REORDER first
        const action = String(body.action ?? "").trim().toUpperCase();
        if (action === "REORDER") {
            // type 후보 추출
            const typeStr = typeof body.type === "string" ? body.type : undefined;
            const type = typeStr && ALLOWED.includes(typeStr)
                ? typeStr
                : undefined;
            // ✅ order를 확실히 string[]로 정제 (여기가 핵심)
            const rawOrder = Array.isArray(body.order) ? body.order : [];
            const order = Array.from(new Set(rawOrder
                .map(v => (typeof v === "string" ? v.trim() : ""))
                .filter((s) => s.length > 0)));
            if (!order.length)
                return res.status(400).json({ error: "order[] required" });
            // id들 가져오기 (여긴 type 필터 없이)
            const rows = await prisma_1.prisma.post.findMany({
                where: { id: { in: order } }, // ← order는 이제 string[]
                select: { id: true, type: true },
            });
            if (!rows.length)
                return res.status(400).json({ error: "no such ids" });
            // type 없으면 ids에서 단일 타입 추론
            let finalType;
            if (type) {
                finalType = type;
            }
            else {
                const distinct = Array.from(new Set(rows.map(r => r.type)));
                if (distinct.length !== 1 || !ALLOWED.includes(distinct[0])) {
                    return res.status(400).json({ error: "type is required or ids must share one valid type" });
                }
                finalType = distinct[0];
            }
            // 최종 유효 id 집합 만들기
            const validSet = new Set(rows.filter(r => r.type === finalType).map(r => r.id));
            const ids = order.filter(id => validSet.has(id)); // ← ids는 string[]
            if (!ids.length)
                return res.status(400).json({ error: "no valid ids for this type" });
            await prisma_1.prisma.$transaction(ids.map((id, idx) => prisma_1.prisma.post.update({ where: { id }, data: { sortOrder: idx } })));
            return res.json({ ok: true, type: finalType, count: ids.length });
        }
        // 2) CREATE
        const type = ALLOWED.includes(body.type) ? body.type : undefined;
        if (!type)
            return res.status(400).json({ error: `type must be one of ${ALLOWED.join("|")}` });
        if (!body.imageUrl)
            return res.status(400).json({ error: "imageUrl required" });
        if ((type === "POPUP" || type === "EVENT_UPCOMING") && !body.linkUrl) {
            return res.status(400).json({ error: "linkUrl required for POPUP/EVENT_UPCOMING" });
        }
        if (type === "EVENT_POLAROID" && !body.title) {
            return res.status(400).json({ error: "title required for EVENT_POLAROID" });
        }
        const seasonAliases = { fall: "Fall", f: "Fall", autumn: "Fall", "1": "Fall", q1: "Fall",
            winter: "Winter", w: "Winter", "2": "Winter", q2: "Winter",
            spring: "Spring", s: "Spring", "3": "Spring", q3: "Spring" };
        const normYear = typeof body.year === "number" ? String(body.year)
            : typeof body.year === "string" ? body.year.trim() : "";
        const qRaw = body.quarter ?? "";
        const qStr = typeof qRaw === "number" ? String(qRaw)
            : typeof qRaw === "string" ? qRaw.trim().replace(/^q/i, "") : "";
        const qAlias = seasonAliases[qStr.toLowerCase().replace(/\s+/g, "")] ?? "";
        if (type === "GM" || type === "EVENT_POLAROID") {
            if (!normYear)
                return res.status(400).json({ error: `Year required for ${type}` });
            if (!qStr)
                return res.status(400).json({ error: `Quarter required for ${type}` });
            if (!qAlias)
                return res.status(400).json({ error: "Quarter must be one of Fall / Winter / Spring" });
        }
        const meta = {};
        const posterUrl = body.posterUrl ?? body?.meta?.posterUrl ?? body.imageUrl;
        if (posterUrl)
            meta.posterUrl = posterUrl;
        if (body.formUrl ?? body?.meta?.formUrl)
            meta.formUrl = body.formUrl ?? body?.meta?.formUrl;
        if (body.instagramUrl ?? body?.meta?.instagramUrl)
            meta.instagramUrl = body.instagramUrl ?? body?.meta?.instagramUrl;
        const data = { type, imageUrl: body.imageUrl, active: true, meta: Object.keys(meta).length ? meta : null };
        if (type === "OFFICER") {
            data.title = (body.enName ?? "").trim();
            data.descKo = (body.koName ?? "").trim();
            data.descEn = (body.role ?? "").trim();
            data.linkUrl = (body.linkedin ?? "").trim() || null;
            data.date = null;
            data.year = null;
            data.quarter = null;
            if (!data.title || !data.descKo || !data.descEn) {
                return res.status(400).json({ error: "enName/koName/role required for OFFICER" });
            }
        }
        else if (type === "GM") {
            data.title = null;
            data.descKo = body.descKo ?? null;
            data.descEn = body.descEn ?? null;
            data.linkUrl = body.linkUrl ?? null;
            data.date = null;
            data.year = normYear;
            data.quarter = qAlias;
        }
        else if (type === "EVENT_POLAROID") {
            data.title = body.title ?? null;
            data.descKo = body.descKo ?? null;
            data.descEn = body.descEn ?? null;
            data.linkUrl = body.linkUrl ?? null;
            data.date = body.date ? new Date(body.date) : null;
            data.year = normYear;
            data.quarter = qAlias;
        }
        else {
            data.title = body.title ?? null;
            data.descKo = body.descKo ?? null;
            data.descEn = body.descEn ?? null;
            data.linkUrl = body.linkUrl ?? null;
            data.date = body.date ? new Date(body.date) : null;
            data.year = null;
            data.quarter = null;
        }
        const post = await prisma_1.prisma.post.create({ data });
        return res.json({ ok: true, post });
    }
    catch (e) {
        console.error("[POST /api/admin/posts] ERR", e);
        return res.status(500).json({ error: e?.message || "Server error" });
    }
});
const getPrisma = async () => {
    const m = await Promise.resolve().then(() => __importStar(require("@prisma/client")));
    return new m.PrismaClient();
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
        const masked = dbUrl.replace(/:[^:@/]+@/, ":***@") // 패스워드 마스킹
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
    }
    catch (e) {
        res.status(500).json({ ok: false, error: e?.message || "debug failed" });
    }
});
// ✅ Express: DELETE /api/admin/posts/:id?hard=1
app.delete("/api/admin/posts/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const hard = String(req.query.hard || "") === "1";
        const before = await prisma_1.prisma.post.findUnique({
            where: { id },
            select: { id: true, active: true, type: true }
        });
        if (!before)
            return res.status(404).json({ error: "Not found" });
        if (hard) {
            await prisma_1.prisma.post.delete({ where: { id } });
            return res.json({ ok: true, mode: "hard", before, after: null });
        }
        if (before.active === false) {
            return res.json({ ok: true, mode: "soft", before, after: before, noChange: true });
        }
        const after = await prisma_1.prisma.post.update({
            where: { id },
            data: { active: false },
            select: { id: true, active: true, type: true }
        });
        return res.json({ ok: true, mode: "soft", before, after });
    }
    catch (e) {
        console.error("[DELETE /api/admin/posts/:id] ERR", e);
        return res.status(500).json({ error: e?.message || "Server error" });
    }
});
function requireAdmin(req, res) {
    const h = req.header("x-admin-token") || req.header("authorization")?.replace(/^Bearer\s+/i, "");
    if (!process.env.ADMIN_TOKEN || h !== process.env.ADMIN_TOKEN) {
        res.status(401).json({ error: "Unauthorized" });
        return false;
    }
    return true;
}
// POST /api/auth/register
// body: { name: string, email: string, password: string }
const bcryptjs_1 = __importDefault(require("bcryptjs"));
;
app.post("/api/auth/register", async (req, res) => {
    try {
        const { name, email, password } = req.body || {};
        // 1) 입력 검증
        if (typeof name !== "string" || !name.trim()) {
            return res.status(400).json({ error: "name is required" });
        }
        if (typeof email !== "string" || !email.trim()) {
            return res.status(400).json({ error: "email is required" });
        }
        if (typeof password !== "string" || password.length < 8) {
            return res.status(400).json({ error: "password must be at least 8 characters" });
        }
        const emailNorm = email.trim().toLowerCase();
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNorm);
        if (!emailOk) {
            return res.status(400).json({ error: "invalid email" });
        }
        // 2) (선택) 도메인 제한
        const allowedDomain = "ucdavis.edu";
        const domain = (emailNorm.split("@")[1] || "").toLowerCase();
        if (domain !== allowedDomain) {
            return res.status(400).json({ error: "Please use your @ucdavis.edu email." });
        }
        // 3) 중복 이메일 체크
        const exists = await prisma_1.prisma.user.findUnique({ where: { email: emailNorm } });
        if (exists) {
            return res.status(409).json({ error: "Email already registered" });
        }
        // 4) 비밀번호 해시 + 유저 생성
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        const user = await prisma_1.prisma.user.create({
            data: { email: emailNorm, name: name.trim(), passwordHash, isApproved: false },
            select: { id: true, email: true, name: true, isApproved: true, createdAt: true },
        });
        // 5) 메일 2통 (신청자 / 관리자)
        try {
            await sendApplicantReceipt(user.email, user.name ?? user.email);
        }
        catch (e) {
            console.error("[MAIL][receipt]", e);
        }
        try {
            await sendAdminNewRegistration(process.env.ADMIN_EMAILS || "", {
                id: user.id, name: user.name ?? user.email, email: user.email,
            });
        }
        catch (e) {
            console.error("[MAIL][admin]", e);
        }
        // 6) ✅ 최종 응답
        return res.status(201).json({
            ok: true,
            user,
            message: "Registration submitted. Await admin approval.",
        });
    }
    catch (e) {
        if (e?.code === "P2002")
            return res.status(409).json({ error: "Email already registered" });
        console.error("[POST /api/auth/register] ERR", e);
        return res.status(500).json({ error: e?.message || "Server error" });
    }
});
// ──────────────────────────────────────────────
// Mail helpers (Nodemailer) — uses your .env keys
// ─────────────────────────────────────────────-
// === replace mailer + sendMail start ===
const nodemailer_1 = __importDefault(require("nodemailer"));
const useResend = !!process.env.RESEND_API_KEY;
let smtpTransport = null;
if (!useResend) {
    // Gmail SMTP가 가능한 경우에만 사용(네트워크 막히면 폴백됨)
    smtpTransport = nodemailer_1.default.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT || 587),
        secure: false, // STARTTLS
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        requireTLS: true,
        tls: { minVersion: "TLSv1.2", servername: "smtp.gmail.com", rejectUnauthorized: true },
        family: 4, // IPv4 강제 (IPv6 이슈 회피)
        connectionTimeout: 10000,
        greetingTimeout: 8000,
        socketTimeout: 15000,
        pool: true,
        maxConnections: 2,
    });
}
async function sendMail(opts) {
    const fallbackToResend = async () => {
        // ✅ Resend 테스트 모드: 허용 수신자만 통과
        if (isResendTestMode()) {
            const toList = String(opts.to)
                .split(",")
                .map(s => s.trim().toLowerCase())
                .filter(Boolean);
            const disallowed = toList.filter(t => t !== RESEND_TEST_RECIPIENT);
            if (disallowed.length) {
                console.warn("[MAIL][skip] Resend test mode. Blocked recipients:", disallowed);
                // 테스트 모드에서는 조용히 스킵 (에러 던지지 않음)
                return;
            }
        }
        const { Resend } = await Promise.resolve().then(() => __importStar(require("resend")));
        const resend = new Resend(process.env.RESEND_API_KEY);
        const from = process.env.RESEND_FROM || "onboarding@resend.dev";
        const result = await resend.emails.send({
            from,
            to: opts.to,
            subject: opts.subject,
            html: opts.html,
            text: opts.text,
            replyTo: process.env.FROM_EMAIL || undefined,
        });
        if (result?.id) {
            console.log("[MAIL][resend] id:", result.id);
        }
        if (result?.error) {
            console.error("[MAIL][resend] error", result.error);
        }
    };
    const useResend = !!process.env.RESEND_API_KEY;
    // 1) RESEND 우선
    if (useResend)
        return fallbackToResend();
    // 2) (옵션) SMTP 시도 → 실패 시 끝 (테스트 모드 폴백 불필요)
    if (!smtpTransport)
        throw new Error("SMTP transport missing");
    const from = process.env.FROM_EMAIL || `${process.env.APP_NAME || "App"} <no-reply@local>`;
    await smtpTransport.sendMail({ from, ...opts });
}
// === replace mailer + sendMail end ===
// 이미 있는 nodemailer 설정/ sendMail 활용
async function sendApplicantReceipt(to, name) {
    const appName = process.env.APP_NAME || "UCD KSEA";
    const loginUrl = process.env.APP_LOGIN_URL || "/";
    await sendMail({
        to,
        subject: `[${appName}] Registration received`,
        text: `Hello ${name || to}

  We received your officer registration. An admin will review it soon.
  You can sign in after approval: ${loginUrl}
  `,
        html: `<p>Hello ${name || to},</p>
            <p>We received your officer registration. An admin will review it soon.</p>
            <p>After approval, sign in here: <a href="${loginUrl}">${loginUrl}</a></p>`
    });
}
function signAdminActionToken(uid, action) {
    const secret = process.env.ADMIN_ACTION_SECRET;
    return jsonwebtoken_1.default.sign({ uid, action }, secret, { expiresIn: "30m" });
}
async function sendAdminNewRegistration(listCsv, user) {
    const to = listCsv.split(",").map(s => s.trim()).filter(Boolean);
    if (!to.length)
        return;
    const actionBase = process.env.ADMIN_ACTION_BASE || // << 반드시 https://api.ucdksea.com
        process.env.APP_BASE_URL ||
        "http://localhost:4000";
    const approveUrl = `${actionBase}/api/admin/users/action?token=${encodeURIComponent(signAdminActionToken(user.id, "approve"))}`;
    const declineUrl = `${actionBase}/api/admin/users/action?token=${encodeURIComponent(signAdminActionToken(user.id, "decline"))}`;
    const appName = process.env.APP_NAME || "UCD KSEA";
    const subject = `[${appName}] New officer registration pending`;
    const profile = `${user.name} <${user.email}>`;
    await sendMail({
        to: to.join(","),
        subject,
        text: `New registration: ${profile}
  Approve: ${approveUrl}
  Decline: ${declineUrl}
  `,
        html: `<p>New registration: <b>${profile}</b></p>
            <p><a href="${approveUrl}">Approve</a> | <a href="${declineUrl}">Decline</a></p>`
    });
}
async function sendApprovalEmail(to, name, loginEmail) {
    const appName = process.env.APP_NAME || "App";
    const loginUrl = process.env.APP_LOGIN_URL || "/";
    const subject = `[${appName}] Your officer account is approved`;
    const text = `Hello ${name || to},

Your officer account has been approved. You can now sign in:
${loginUrl}
${loginEmail ? `\nEmail: ${loginEmail}` : ""}

Thank you.`;
    const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial">
      <p>Hello ${name || to},</p>
      <p>Your officer account has been <b>approved</b>.</p>
      <p><a href="${loginUrl}">Sign in</a>${loginEmail ? ` with <code>${loginEmail}</code>` : ""}.</p>
      <p>Thank you.</p>
    </div>
  `;
    await sendMail({ to, subject, text, html });
}
// ──────────────────────────────────────────────
// POST /api/admin/users/:id/approve
// Header: x-admin-token: <ADMIN_TOKEN>
// ─────────────────────────────────────────────-
app.post("/api/admin/users/:id/approve", (req, res, next) => (requireAdmin(req, res) ? next() : undefined), async (req, res) => {
    try {
        const id = req.params.id;
        const user = await prisma_1.prisma.user.update({
            where: { id },
            data: { isApproved: true },
            select: { id: true, email: true, name: true, isApproved: true },
        });
        try {
            await sendApprovalEmail(user.email, user.name ?? user.email, user.email);
        }
        catch (e) {
            console.error("[MAIL][approve] fail:", e);
        }
        return res.json({ ok: true, user });
    }
    catch (e) {
        if (e?.code === "P2025")
            return res.status(404).json({ error: "User not found" });
        console.error("[POST /api/admin/users/:id/approve] ERR", e);
        return res.status(500).json({ error: e?.message || "Server error" });
    }
});
app.get("/api/admin/users/action", async (req, res) => {
    try {
        const token = String(req.query.token || "");
        if (!token)
            return res.status(400).send("Missing token.");
        let payload;
        try {
            payload = jsonwebtoken_1.default.verify(token, process.env.ADMIN_ACTION_SECRET);
        }
        catch {
            return res.status(400).send("Invalid or expired link.");
        }
        const user = await prisma_1.prisma.user.findUnique({ where: { id: payload.uid } });
        if (!user)
            return res.status(404).send("User not found (already processed?).");
        if (payload.action === "approve") {
            const updated = await prisma_1.prisma.user.update({
                where: { id: user.id },
                data: { isApproved: true },
                select: { email: true, name: true }
            });
            try {
                await sendApprovalEmail(updated.email, updated.name ?? updated.email, updated.email);
            }
            catch (e) {
                console.error("[MAIL][approve]", e);
            }
            return res.status(200).send("Approved The user has been granted access.");
        }
        // decline: 관련 데이터 정리 후 삭제
        await prisma_1.prisma.quote.deleteMany({ where: { userId: user.id } }).catch(() => { });
        await prisma_1.prisma.user.delete({ where: { id: user.id } });
        return res.status(200).send("Declined The registration has been removed.");
    }
    catch (e) {
        console.error("[ACTION] error", e);
        return res.status(500).send("Server error.");
    }
});
/* ────────────── MAIL QUICK DIAG ────────────── */
// 환경 확인용
app.get("/__mail_env", (_req, res) => {
    res.json({
        mode: process.env.RESEND_API_KEY ? "resend" : "smtp",
        has_resend_key: !!process.env.RESEND_API_KEY,
        resend_from: process.env.RESEND_FROM || "onboarding@resend.dev",
        from_email: process.env.FROM_EMAIL || null,
        admin_emails: process.env.ADMIN_EMAILS || null,
    });
});
// 실제 발송 테스트
app.get("/__mail_test", async (req, res) => {
    try {
        const to = String(req.query.to || process.env.ADMIN_EMAILS || "").trim();
        if (!to)
            return res.status(400).json({ error: "no 'to' given" });
        const id = await sendMail({
            to,
            subject: "[UCD KSEA] MAIL TEST",
            text: "This is a mail test via current backend config.",
            html: "<p>This is a <b>mail test</b> via current backend config.</p>",
        });
        return res.json({ ok: true, id }); // ← id 포함
    }
    catch (e) {
        console.error("[MAILTEST] error:", e?.message || e);
        return res.status(500).json({ ok: false, error: e?.message || "send failed" });
    }
});
// ✅ 로그인 라우트 추가
app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body || {};
        if (!email || !password)
            return res.status(400).json({ error: "Missing credentials" });
        const emailNorm = String(email).toLowerCase().trim();
        const user = await prisma_1.prisma.user.findUnique({ where: { email: emailNorm } });
        if (!user)
            return res.status(401).json({ error: "Invalid login" });
        const ok = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!ok)
            return res.status(401).json({ error: "Invalid login" });
        if (!user.isApproved)
            return res.status(403).json({ error: "Not approved yet" });
        // 같은 사이트(ucdksea.com)의 서브도메인 간 공유
        res.cookie("uid", user.id, {
            httpOnly: true,
            secure: true, // HTTPS 필수
            sameSite: "lax", // same-site라 Lax 가능 (원하면 "none")
            domain: ".ucdksea.com",
            path: "/",
            maxAge: 60 * 60 * 24 * 7 * 1000,
        });
        return res.json({ ok: true, user: { id: user.id, email: user.email, name: user.name } });
    }
    catch (e) {
        console.error("[POST /api/auth/login] ERR", e);
        return res.status(500).json({ error: "Server error" });
    }
});
// ── 이미지 라우트 최종 404 (맨 아래쪽에 둔다)
app.use((req, res, next) => {
    if (!IMAGE_ROUTES.some(rx => rx.test(req.path)))
        return next();
    setImageCORS(req, res);
    res.setHeader("Cache-Control", "no-store, max-age=0");
});
// server.ts (라우트들 아래, 마지막 미들웨어들 위에)
app.use((err, _req, res, _next) => {
    if (err instanceof multer_1.default.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE')
            return res.status(413).json({ error: 'File too large (max 10MB)' });
        return res.status(400).json({ error: err.message });
    }
    if (err && err.message === 'Only image files are allowed') {
        return res.status(415).json({ error: 'Only image files are allowed' });
    }
    return res.status(500).json({ error: err?.message || 'Server error' });
});
// Listen
const PORT = Number(process.env.PORT || 4000);
console.log("MAIL_MODE:", process.env.RESEND_API_KEY ? "resend" : "smtp");
app.listen(PORT, "0.0.0.0", () => console.log("API up on", PORT));
