"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const app = (0, express_1.default)();
// Health & ping
app.get("/__health", (_req, res) => res.status(200).send("ok"));
app.get("/api/ping", (_req, res) => res.json({ ok: true }));
// Middlewares
app.use((0, cors_1.default)({ origin: true, credentials: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Static
const PUBLIC_ROOT = path_1.default.resolve(__dirname, "../public");
app.use("/uploads", express_1.default.static(path_1.default.join(PUBLIC_ROOT, "uploads"), { maxAge: "1y", etag: true }));
// Upload (10MB)
const UPLOAD_DIR = path_1.default.join(PUBLIC_ROOT, "uploads", "posts");
fs_1.default.mkdirSync(UPLOAD_DIR, { recursive: true });
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
    filename: (_req, file, cb) => {
        const safe = String(file.originalname || "").replace(/[^a-zA-Z0-9._-]/g, "_");
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
app.post("/api/upload", upload.single("file"), async (req, res) => {
    try {
        const file = req.file;
        if (!file)
            return res.status(400).json({ error: "No file" });
        const base = process.env.APP_BASE_URL || `${req.protocol}://${req.get("host")}`;
        const url = `${base}/uploads/posts/${file.filename}`;
        const payload = JSON.stringify({ url });
        // 명시 종료로 curl (18) 회피
        res.status(201);
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Content-Length", Buffer.byteLength(payload).toString());
        res.setHeader("Connection", "close");
        res.end(payload);
    }
    catch (e) {
        console.error("[ERR][UPLOAD]", e);
        res.status(500).json({ ok: false, error: e?.message || "Upload failed" });
    }
});
// Listen
const PORT = Number(process.env.PORT || 4000);
app.listen(PORT, "0.0.0.0", () => console.log("API up on", PORT));
