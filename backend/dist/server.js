"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/server.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const prisma_audit_middleware_1 = require("./lib/prisma-audit-middleware");
const mail_1 = require("./lib/mail");
const admin_users_1 = __importDefault(require("./routes/admin-users"));
const auth_1 = __importDefault(require("./routes/auth"));
const dev_1 = __importDefault(require("./routes/dev"));
const multer_1 = __importDefault(require("multer"));
const prisma_1 = require("./lib/prisma");
// ---------- ENV ----------
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../.env") });
// ---------- BOOT TAG ----------
const BUILD_TAG = `upload-v1-${Date.now()}`;
console.log("[BOOT]", BUILD_TAG);
// ---------- APP ----------
(0, prisma_audit_middleware_1.attachAuditMiddleware)();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// ---------- CORS (단일, 확실) ----------
const allowlist = new Set((process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .concat([
    "https://www.ucdksea.com",
    "https://ucdksea.com",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]));
app.use((0, cors_1.default)({
    credentials: true,
    origin(origin, cb) {
        if (!origin)
            return cb(null, true); // 서버-서버 등 Origin 없음 허용
        return cb(null, allowlist.has(origin));
    },
}));
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
    const out = [];
    // @ts-ignore
    app._router?.stack?.forEach((layer) => {
        if (layer.route?.path) {
            const methods = Object.keys(layer.route.methods)
                .filter((m) => layer.route.methods[m])
                .map((m) => m.toUpperCase());
            out.push({ methods, path: layer.route.path });
        }
        else if (layer.name === "router" && layer.handle?.stack) {
            const prefix = layer.regexp?.fast_slash
                ? "/"
                : (layer.regexp?.toString().match(/^\/\^\\\/(.+?)\\\/\?\$\//)?.[1] || "").replace(/\\\//g, "/");
            layer.handle.stack.forEach((r) => {
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
const PUBLIC_ROOT = path_1.default.resolve(__dirname, "../public");
// 정적 업로드 서빙
app.use("/uploads", express_1.default.static(path_1.default.join(PUBLIC_ROOT, "uploads"), {
    maxAge: "1y",
    etag: true,
}));
// ---------- 라우터 마운트 ----------
app.use("/api/admin", admin_users_1.default);
app.use("/api/auth", auth_1.default);
app.use("/api/dev", dev_1.default);
// dev: 메일 테스트
app.get("/api/dev/test-email", async (_req, res) => {
    try {
        const info = await mail_1.mailer.sendMail({
            from: process.env.FROM_EMAIL || process.env.SMTP_USER,
            to: process.env.SMTP_USER,
            subject: "[UCD KSEA] Test Email",
            text: "If you can read this, SMTP is working 🎉",
        });
        res.json({ ok: true, info });
    }
    catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});
// ---------- 업로드 ----------
const UPLOAD_DIR = path_1.default.join(PUBLIC_ROOT, "uploads", "posts");
fs_1.default.mkdirSync(UPLOAD_DIR, { recursive: true });
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
    filename: (_req, file, cb) => {
        const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
        cb(null, `${Date.now()}_${safe}`);
    },
});
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith("image/"))
            return cb(new Error("Only image files are allowed"));
        cb(null, true);
    },
});
// 업로드 헬스
app.get("/api/upload", (_req, res) => res.status(200).send("upload GET alive"));
async function isApprovedByCookie(req) {
    const uid = req.cookies?.uid;
    if (!uid)
        return false;
    try {
        const me = await prisma_1.prisma.user.findUnique({ where: { id: uid }, select: { isApproved: true } });
        return !!me?.isApproved;
    }
    catch {
        return false;
    }
}
function isAdminByToken(req) {
    const token = req.get("x-admin-token") || (req.get("authorization") || "").replace(/^Bearer\s+/i, "");
    return !!(token && process.env.ADMIN_TOKEN && token === process.env.ADMIN_TOKEN);
}
app.post("/api/upload", upload.single("file"), async (req, res) => {
    const allowPublic = process.env.ALLOW_PUBLIC_UPLOADS === "true";
    const admin = isAdminByToken(req);
    let approved = false;
    if (!admin && !allowPublic)
        approved = await isApprovedByCookie(req);
    if (!(admin || approved || allowPublic)) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const file = req.file;
    if (!file)
        return res.status(400).json({ error: "No file" });
    const base = process.env.APP_BASE_URL || `${req.protocol}://${req.get("host")}`;
    const url = `${base}/uploads/posts/${file.filename}`;
    return res.status(201).json({ url });
});
// ---------- 오류 핸들러 (디버그용) ----------
app.use((err, _req, res, _next) => {
    console.error("[ERR]", err);
    res.status(500).json({ ok: false, error: err?.message || "Server error" });
});
// ---------- START ----------
const PORT = Number(process.env.PORT || 4000);
app.listen(PORT, "0.0.0.0", () => console.log("API up on", PORT));
